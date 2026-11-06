"""Offline regressions for Telegram's unsupported-post metadata fallback.

Run: .venv/Scripts/python.exe -B tools/test_fetch_telegram.py
No test contacts Telegram or writes the production feed file.
"""
import html
import io
import json
import sys
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import call, patch
from urllib.error import HTTPError, URLError

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_telegram as feed
from bs4 import BeautifulSoup


AVATAR = "https://cdn4.telesco.pe/file/channel-avatar.jpg"
POST_IMAGE = "https://cdn4.telesco.pe/file/post-cover.jpg"
CHANNEL_NAME = "‹‹ Лево руля! | Магия хаоса и ПЛР"
BIO = "Ничто не истинно, всё дозволено.\tМагия хаоса и Путь Левой Руки."
ARTICLE_TITLE = "И ТУТ МАТЕМАТИКА"
ARTICLE_BODY = (
    "Для гуманитариев любая формула сама по себе уже выглядит как тайное заклинание. "
    "Стоит написать буквы, скобки, плюсики или, простигосподи, степень - "
    "и все сразу выглядит научно. А я гуманитарий."
)
ARTICLE_DESCRIPTION = ARTICLE_TITLE + "\n\n\n" + ARTICLE_BODY
POST_DATE = "2026-11-06T09:53:32+00:00"


def page(description=ARTICLE_DESCRIPTION, image=AVATAR, post_id=142,
         widget_id=None, post_class=True, widget=True):
    """Match the relevant structure of t.me/levorules/142, not its embed."""
    widget_id = post_id if widget_id is None else widget_id
    post_marker = '<div class="tgme_page tgme_page_post">' if post_class else '<div class="tgme_page">'
    script = (
        '<script src="https://telegram.org/js/telegram-widget.js?24" '
        f'data-telegram-post="levorules/{widget_id}" data-mode="tme"></script>'
        if widget else ""
    )
    photo = f'<meta property="og:image" content="{html.escape(image, quote=True)}">' if image else ""
    return (
        '<!doctype html><html><head>'
        f'<meta property="og:title" content="{html.escape(CHANNEL_NAME, quote=True)}">'
        f'<meta property="og:description" content="{html.escape(description, quote=True)}">'
        f'{photo}<meta property="al:ios:url" '
        f'content="tg://resolve?domain=levorules&amp;post={post_id}">'
        f'</head><body>{post_marker}{script}</div></body></html>'
    )


def message(post_id=142, content=None, unsupported=True, photo=None):
    media = (
        '<div class="message_media_not_supported_wrap">'
        '<div class="message_media_not_supported">'
        'Please open Telegram to view this post</div></div>'
        if unsupported else ""
    )
    text = f'<div class="tgme_widget_message_text">{content}</div>' if content is not None else ""
    image = (
        f'<a class="tgme_widget_message_photo_wrap" style="background-image:url(\'{photo}\')"></a>'
        if photo else ""
    )
    markup = (
        f'<div class="tgme_widget_message" data-post="levorules/{post_id}">'
        f'{media}{text}{image}<time datetime="{POST_DATE}">09:53</time>'
        '<span class="tgme_widget_message_views">24</span></div>'
    )
    return BeautifulSoup(markup, "html.parser").div


def cached_article():
    return {
        "id": 142,
        "url": "https://telegram.me/levorules/142",
        "title": ARTICLE_TITLE,
        "body": ARTICLE_BODY,
        "photo": POST_IMAGE,
        "date": "2026-11-05T08:00:00+00:00",
        "views": "7",
        "titleParts": [{"text": ARTICLE_TITLE, "strike": True}],
    }


def preview(*messages):
    return f'<html><head><meta property="og:image" content="{AVATAR}"></head><body>' + "".join(map(str, messages)) + "</body></html>"


class LinkPreviewTests(unittest.TestCase):
    def test_142_uses_description_first_line_and_preserves_body(self):
        title, body, photo = feed.extract_link_preview(page(), 142, channel_photo=AVATAR)
        self.assertEqual(title, ARTICLE_TITLE)
        self.assertEqual(body, ARTICLE_BODY)
        self.assertNotEqual(title, CHANNEL_NAME)
        self.assertIsNone(photo)

    def test_actual_channel_avatar_is_not_a_post_cover(self):
        self.assertIsNone(feed.extract_link_preview(page(image=AVATAR), 142, AVATAR)[2])

    def test_post_specific_https_image_is_accepted(self):
        self.assertEqual(feed.extract_link_preview(page(image=POST_IMAGE), 142, AVATAR)[2], POST_IMAGE)

    def test_unknown_channel_avatar_does_not_guess_post_image(self):
        self.assertIsNone(feed.extract_link_preview(page(image=POST_IMAGE), 142)[2])

    def test_non_https_images_are_ignored_without_losing_text(self):
        for url in ("http://cdn4.telesco.pe/file/cover.jpg", "//cdn4.telesco.pe/file/cover.jpg", "javascript:alert(1)"):
            with self.subTest(url=url):
                title, body, photo = feed.extract_link_preview(page(image=url), 142, AVATAR)
                self.assertEqual((title, body), (ARTICLE_TITLE, ARTICLE_BODY))
                self.assertIsNone(photo)

    def test_nonexistent_post_generic_channel_page_is_rejected(self):
        # Telegram returns HTTP 200 and a deep link containing even this nonexistent ID.
        generic = page(BIO, AVATAR, post_id=9999999, post_class=False, widget=False)
        self.assertEqual(feed.extract_link_preview(generic, 9999999, AVATAR), ("", "", None))

    def test_both_post_container_and_matching_widget_are_required(self):
        for markup in (page(post_class=False), page(widget=False), page(widget_id=140)):
            with self.subTest(markup=markup):
                self.assertEqual(feed.extract_link_preview(markup, 142, AVATAR), ("", "", None))

    def test_missing_description_does_not_turn_channel_title_into_post(self):
        self.assertEqual(feed.extract_link_preview(page(description=""), 142, AVATAR), ("", "", None))

    def test_entities_and_formula_backslashes_are_plain_text(self):
        markup = page("Сила магии\n\nM = G × L & R. \\times")
        markup = markup.replace("Сила магии", "Сила&nbsp;магии").replace("\\times", "&#092;times")
        title, body, _ = feed.extract_link_preview(markup, 142, AVATAR)
        self.assertEqual(title, "Сила магии")
        self.assertEqual(body, "M = G × L & R. \\times")


class ExtractPostTests(unittest.TestCase):
    def test_cached_142_survives_unavailable_metadata_with_fresh_counters_and_manual_cover(self):
        cached = cached_article()
        manual = {"142": {"photo": "/media/telegram/142.webp"}}
        for failure in (URLError("temporarily unavailable"), page(description="")):
            with self.subTest(failure=type(failure).__name__):
                fetch_kwargs = {"side_effect": failure} if isinstance(failure, Exception) else {"return_value": failure}
                with patch.object(feed, "MANUAL", manual), patch.object(feed, "fetch_html", **fetch_kwargs), redirect_stderr(io.StringIO()), redirect_stdout(io.StringIO()):
                    post = feed.extract_post(message(), channel_photo=AVATAR, previous_posts={"142": cached})
                self.assertEqual(post["id"], 142)
                self.assertEqual(post["title"], cached["title"])
                self.assertEqual(post["body"], cached["body"])
                self.assertEqual(post["titleParts"], cached["titleParts"])
                self.assertEqual(post["date"], POST_DATE)
                self.assertEqual(post["views"], "24")
                self.assertEqual(post["photo"], manual["142"]["photo"])

    def test_new_public_message_text_overrides_cached_article_without_metadata_fetch(self):
        msg = message(content="Обновлённый заголовок<br>Новый публичный текст.", unsupported=False)
        with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html") as fetch:
            post = feed.extract_post(msg, channel_photo=AVATAR, previous_posts={"142": cached_article()})
        fetch.assert_not_called()
        self.assertEqual(post["title"], "Обновлённый заголовок")
        self.assertEqual(post["body"], "Новый публичный текст.")
        self.assertIsNone(post["photo"])
        self.assertNotIn("titleParts", post)

    def test_new_public_link_preview_overrides_cached_article(self):
        fresh = page(description="Обновлённый заголовок\n\nНовая выдержка.", image=POST_IMAGE)
        with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html", return_value=fresh), redirect_stdout(io.StringIO()):
            post = feed.extract_post(message(), channel_photo=AVATAR, previous_posts={"142": cached_article()})
        self.assertEqual(post["title"], "Обновлённый заголовок")
        self.assertEqual(post["body"], "Новая выдержка.")
        self.assertEqual(post["photo"], POST_IMAGE)
        self.assertNotIn("titleParts", post)

    def test_unsupported_142_recovers_text_but_keeps_original_date_and_views(self):
        with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html", return_value=page()) as fetch:
            post = feed.extract_post(message(), channel_photo=AVATAR)
        fetch.assert_called_once_with("https://t.me/levorules/142")
        self.assertEqual(post["id"], 142)
        self.assertEqual(post["title"], ARTICLE_TITLE)
        self.assertEqual(post["body"], ARTICLE_BODY)
        self.assertEqual(post["date"], POST_DATE)
        self.assertEqual(post["views"], "24")
        self.assertEqual(post["url"], "https://telegram.me/levorules/142")
        self.assertIsNone(post["photo"])

    def test_manual_141_has_priority_and_needs_no_extra_fetch(self):
        manual = {"141": {"title": "ЧТО ВЫБРАТЬ НА ОДИН РАЗ", "body": "Ручная выдержка.", "photo": "/media/telegram/141.webp"}}
        with patch.object(feed, "MANUAL", manual), patch.object(feed, "fetch_html") as fetch:
            post = feed.extract_post(message(post_id=141), channel_photo=AVATAR)
        fetch.assert_not_called()
        self.assertEqual(post["title"], manual["141"]["title"])
        self.assertEqual(post["body"], manual["141"]["body"])
        self.assertEqual(post["photo"], manual["141"]["photo"])

    def test_manual_photo_only_142_still_fetches_article_text(self):
        manual = {"142": {"photo": "/media/telegram/142.webp"}}
        with patch.object(feed, "MANUAL", manual), patch.object(feed, "fetch_html", return_value=page()) as fetch:
            post = feed.extract_post(message(), channel_photo=AVATAR)
        fetch.assert_called_once_with("https://t.me/levorules/142")
        self.assertEqual(post["id"], 142)
        self.assertEqual(post["title"], ARTICLE_TITLE)
        self.assertEqual(post["body"], ARTICLE_BODY)
        self.assertEqual(post["date"], POST_DATE)
        self.assertEqual(post["photo"], "/media/telegram/142.webp")

    def test_normal_first_line_strikethrough_is_preserved_without_fetch(self):
        msg = message(post_id=140, content="Это <s>ошибка</s> проверка<br><br>Обычный текст.", unsupported=False)
        with patch.object(feed, "fetch_html") as fetch:
            post = feed.extract_post(msg, channel_photo=AVATAR)
        fetch.assert_not_called()
        self.assertEqual(post["title"], "Это ошибка проверка")
        self.assertEqual(post["body"], "Обычный текст.")
        self.assertEqual(post["titleParts"], [
            {"text": "Это ", "strike": False},
            {"text": "ошибка", "strike": True},
            {"text": " проверка", "strike": False},
        ])

    def test_empty_service_message_does_not_trigger_fallback(self):
        with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html") as fetch:
            self.assertIsNone(feed.extract_post(message(unsupported=False), channel_photo=AVATAR))
        fetch.assert_not_called()

    def test_photo_only_post_does_not_trigger_fallback(self):
        with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html") as fetch:
            post = feed.extract_post(message(photo=POST_IMAGE), channel_photo=AVATAR)
        fetch.assert_not_called()
        self.assertEqual(post["photo"], POST_IMAGE)
        self.assertEqual(post["title"], "Пост с изображением")

    def test_failed_fallback_is_logged_and_does_not_abort_later_posts(self):
        for error in (OSError("network unavailable"), ValueError("invalid response")):
            with self.subTest(error=type(error).__name__):
                stderr = io.StringIO()
                with patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html", side_effect=error) as fetch, redirect_stderr(stderr):
                    self.assertIsNone(feed.extract_post(message(), channel_photo=AVATAR))
                    later = feed.extract_post(message(post_id=140, content="Заголовок<br>Обычный текст.", unsupported=False), channel_photo=AVATAR)
                self.assertEqual(later["id"], 140)
                self.assertTrue(stderr.getvalue().strip(), "A failed fallback must be visible in diagnostics")
                fetch.assert_called_once()


class MainCacheTests(unittest.TestCase):
    def test_main_does_not_resurrect_cached_id_absent_from_current_preview(self):
        markup = preview(message(143, content="Новый пост<br>Публичный текст.", unsupported=False))
        with TemporaryDirectory() as directory:
            output = Path(directory) / "telegram.json"
            output.write_text(json.dumps({"items": [cached_article()]}), encoding="utf-8")
            with patch.object(feed, "OUT", output), patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html", return_value=markup) as fetch, patch.object(feed, "blocked", return_value=None), redirect_stdout(io.StringIO()):
                feed.main()
            items = json.loads(output.read_text(encoding="utf-8"))["items"]
        self.assertEqual([post["id"] for post in items], [143])
        self.assertEqual(items[0]["title"], "Новый пост")
        fetch.assert_called_once_with()

    def test_main_recovers_present_cached_article_and_still_applies_stoplist(self):
        cached = cached_article()
        markup = preview(message(), message(143, content="Новый пост<br>Публичный текст.", unsupported=False))

        def fetch(url=feed.PREVIEW_URL):
            if url == feed.PREVIEW_URL:
                return markup
            self.assertEqual(url, "https://t.me/levorules/142")
            raise URLError("metadata temporarily unavailable")

        for block_cached in (False, True):
            with self.subTest(block_cached=block_cached), TemporaryDirectory() as directory:
                output = Path(directory) / "telegram.json"
                output.write_text(json.dumps({"items": [cached]}), encoding="utf-8")

                def blocked(title, body, item_id):
                    return "cached-title-stop" if block_cached and title == cached["title"] else None

                with patch.object(feed, "OUT", output), patch.object(feed, "MANUAL", {}), patch.object(feed, "fetch_html", side_effect=fetch), patch.object(feed, "blocked", side_effect=blocked) as stoplist, redirect_stderr(io.StringIO()), redirect_stdout(io.StringIO()):
                    feed.main()
                items = json.loads(output.read_text(encoding="utf-8"))["items"]
                stoplist.assert_any_call(cached["title"], cached["body"], item_id=142)
                self.assertEqual([post["id"] for post in items], [143] if block_cached else [143, 142])
                if not block_cached:
                    restored = items[1]
                    self.assertEqual(restored["title"], cached["title"])
                    self.assertEqual(restored["body"], cached["body"])
                    self.assertEqual(restored["photo"], cached["photo"])
                    self.assertEqual(restored["titleParts"], cached["titleParts"])
                    self.assertEqual(restored["date"], POST_DATE)
                    self.assertEqual(restored["views"], "24")


class FetchRetryTests(unittest.TestCase):
    def test_transient_url_error_is_retried_then_returns_decoded_html(self):
        markup = "<html>Доступно снова</html>"
        response = io.BytesIO(markup.encode("utf-8"))
        with patch.object(feed.urllib.request, "urlopen", side_effect=[URLError("temporary"), response]) as urlopen, patch.object(feed.time, "sleep") as sleep:
            result = feed.fetch_html()
        self.assertEqual(result, markup)
        self.assertEqual(urlopen.call_count, 2)
        sleep.assert_called_once_with(1)

    def test_three_network_failures_raise_last_error_without_a_fourth_request(self):
        errors = [URLError("first failure"), OSError("second failure"), URLError("last failure")]
        with patch.object(feed.urllib.request, "urlopen", side_effect=errors) as urlopen, patch.object(feed.time, "sleep") as sleep:
            with self.assertRaises(URLError) as raised:
                feed.fetch_html()
        self.assertIs(raised.exception, errors[-1])
        self.assertEqual(urlopen.call_count, 3)
        self.assertEqual(sleep.call_args_list, [call(1), call(2)])

    def test_http_404_is_raised_immediately_without_retry_or_sleep(self):
        error = HTTPError(feed.PREVIEW_URL, 404, "Not Found", None, None)
        self.addCleanup(error.close)
        with patch.object(feed.urllib.request, "urlopen", side_effect=error) as urlopen, patch.object(feed.time, "sleep") as sleep:
            with self.assertRaises(HTTPError) as raised:
                feed.fetch_html()
        self.assertIs(raised.exception, error)
        urlopen.assert_called_once()
        sleep.assert_not_called()


if __name__ == "__main__":
    unittest.main()
