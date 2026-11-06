#!/usr/bin/env python3
"""Fetch public @levorules posts for the homepage «ПОСЛЕДНИЕ ПОСТЫ» block.

For posts hidden in the web feed, use the individual post's link preview.
"""
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit

from bs4 import BeautifulSoup, NavigableString

from feed_stoplist import blocked

CHANNEL_HANDLE = "levorules"
PREVIEW_URL = f"https://telegram.me/s/{CHANNEL_HANDLE}"
COUNT = 6  # fetch a bit more than the 2 shown; frontend can pick
# Write directly to the repo's site/telegram.json (same rationale as fetch_shorts.py).
OUT = Path(__file__).resolve().parents[1] / "site" / "telegram.json"
# Optional text or local covers for posts hidden in the public preview page.
MANUAL = json.loads(
    (Path(__file__).resolve().parents[1] / "content" / "telegram-manual.json").read_text(encoding="utf-8")
)["posts"]

ACCENTS = [
    "var(--cyber-cyan)",
    "var(--magenta)",
    "var(--acid-green)",
    "var(--amber)",
    "var(--purple)",
    "var(--blood-text)",
]


def fetch_html(url=PREVIEW_URL):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        },
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read().decode("utf-8")
        except OSError as exc:
            if isinstance(exc, HTTPError) and exc.code not in (408, 425, 429, 500, 502, 503, 504):
                raise
            if attempt == 2:
                raise
            time.sleep(attempt + 1)


def load_previous_posts():
    """Keep a known article available when its link preview temporarily fails."""
    try:
        payload = json.loads(OUT.read_text(encoding="utf-8"))
        return {str(post["id"]): post for post in payload["items"]}
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f"previous Telegram feed unavailable: {exc}", file=sys.stderr)
        return {}


def parse_views(text):
    """Turn "12.3K" / "1.2M" / "567" → "12.3k" / "1.2M" / "567"."""
    if not text:
        return ""
    t = text.strip().replace(" ", "")
    return t.replace("K", "k")


def extract_photo(msg):
    wrap = msg.find("a", class_="tgme_widget_message_photo_wrap")
    if not wrap:
        return None
    style = wrap.get("style", "")
    m = re.search(r"background-image:url\('([^']+)'\)", style)
    return m.group(1) if m else None


def extract_first_line_parts(text_div):
    """Return safe text segments for Telegram strikethrough in the first line."""
    chars = []
    strike_tags = {"s", "strike", "del"}

    for node in text_div.descendants:
        if getattr(node, "name", None) == "br":
            break
        if not isinstance(node, NavigableString):
            continue

        struck = False
        parent = node.parent
        while parent is not None and parent is not text_div:
            if getattr(parent, "name", None) in strike_tags:
                struck = True
                break
            parent = parent.parent

        for char in str(node):
            normalized = " " if char.isspace() else char
            if normalized == " " and chars and chars[-1][0] == " ":
                continue
            # Do not extend the line through separator spaces around a word.
            chars.append((normalized, struck and normalized != " "))

    while chars and chars[0][0] == " ":
        chars.pop(0)
    while chars and chars[-1][0] == " ":
        chars.pop()

    parts = []
    for char, struck in chars:
        if parts and parts[-1]["strike"] == struck:
            parts[-1]["text"] += char
        else:
            parts.append({"text": char, "strike": struck})
    return parts


def clamp_body(body):
    if len(body) > 260:
        return body[:257].rstrip() + "…"
    return body


def extract_text(msg):
    """Return (title, body, title_parts) from a Telegram message."""
    text_div = msg.find("div", class_="tgme_widget_message_text")
    if not text_div:
        return "", "", None

    first_line_parts = extract_first_line_parts(text_div)
    first_line_text = "".join(part["text"] for part in first_line_parts)

    # Preserve line breaks
    for br in text_div.find_all("br"):
        br.replace_with("\n")

    full = text_div.get_text("", strip=False).strip()
    title, body = split_text(full)

    title_parts = None
    if title == first_line_text and any(part["strike"] for part in first_line_parts):
        title_parts = first_line_parts
    return title, body, title_parts


def split_text(full):
    """Use the same title and excerpt rules for message text and link previews."""

    lines = [re.sub(r"\s+", " ", ln.strip()) for ln in full.split("\n") if ln.strip()]
    if not lines:
        return "", ""

    # If first line is SHORT and followed by content, it's the title.
    # Otherwise split at the first sentence end of the first line.
    first = lines[0]
    if len(lines) > 1 and len(first) <= 120:
        title = first
        body = " ".join(lines[1:]).strip()
    else:
        # Split at first . ! ? — or cap at 100 chars
        m = re.match(r"^(.{5,120}?[.!?…])\s+(.*)$", first, re.DOTALL)
        if m:
            title = m.group(1).strip()
            rest = m.group(2).strip()
            body = (rest + " " + " ".join(lines[1:])).strip()
        else:
            title = first[:100].strip()
            body = (first[100:] + " " + " ".join(lines[1:])).strip()

    return title, clamp_body(body)


def extract_link_preview(html, post_id, channel_photo=None):
    """Read a real post's metadata, excluding channel pages and their avatar."""
    soup = BeautifulSoup(html, "html.parser")
    # Missing/deleted posts return HTTP 200 with the channel's description.
    # A deep link alone is not proof that the requested post exists.
    widget = soup.find("script", attrs={"data-telegram-post": f"{CHANNEL_HANDLE}/{post_id}"})
    if not soup.select_one(".tgme_page_post") or not widget:
        return "", "", None

    description = soup.find("meta", property="og:description")
    title, body = split_text(description.get("content", "") if description else "")
    if not title:
        return "", "", None

    image = soup.find("meta", property="og:image")
    photo = image.get("content", "") if image else ""
    # Telegram uses the channel avatar when an article has no public cover.
    # Without the feed's avatar to compare against, omit the ambiguous image.
    if not channel_photo or photo == channel_photo or urlsplit(photo).scheme != "https":
        photo = None
    return title, body, photo


def extract_post(msg, channel_photo=None, previous_posts=None):
    post_id_attr = msg.get("data-post", "")  # "levorules/96"
    if "/" not in post_id_attr:
        return None
    try:
        pid = int(post_id_attr.split("/", 1)[1])
    except ValueError:
        return None

    title, body, title_parts = extract_text(msg)
    photo = extract_photo(msg)

    manual = MANUAL.get(str(pid))
    hidden_post = not title and not body and not photo
    if manual and manual.get("title") and hidden_post:
        title = manual["title"]
        body = clamp_body(manual.get("body", ""))
        photo = manual.get("photo")

    if not title and not body and not photo and msg.find(class_="message_media_not_supported"):
        try:
            title, body, photo = extract_link_preview(
                fetch_html(f"https://t.me/{CHANNEL_HANDLE}/{pid}"), pid, channel_photo
            )
            if title:
                print(f"read link preview: #{pid} {title}")
            else:
                print(f"no public link preview: #{pid}", file=sys.stderr)
        except (OSError, ValueError) as exc:
            # One unavailable post must not prevent refreshing the rest of the feed.
            print(f"could not read link preview for #{pid}: {exc}", file=sys.stderr)

        # Reuse only IDs still present in today's public feed as unsupported posts.
        # Never append old entries wholesale: that would resurrect deleted posts.
        previous = (previous_posts or {}).get(str(pid))
        if not title and previous and previous.get("title"):
            title = previous["title"]
            body = clamp_body(previous.get("body", ""))
            photo = previous.get("photo")
            title_parts = previous.get("titleParts")
            print(f"kept previous link preview: #{pid} {title}")

    # A cover-only entry keeps the article's title and excerpt automatic.
    if hidden_post and title and manual and manual.get("photo"):
        photo = manual["photo"]

    # If no text but a photo, fall back to "Фото · <date>" style title
    if not title and not body:
        if not photo:
            return None
        title = "Пост с изображением"

    # Date
    time_tag = msg.find("time")
    iso = time_tag.get("datetime") if time_tag else ""

    # Views
    views_tag = msg.find("span", class_="tgme_widget_message_views")
    views = parse_views(views_tag.get_text()) if views_tag else ""

    post = {
        "id": pid,
        "url": f"https://telegram.me/{CHANNEL_HANDLE}/{pid}",
        "title": title,
        "body": body,
        "photo": photo,
        "date": iso,
        "views": views,
    }
    if title_parts:
        post["titleParts"] = title_parts
    return post


def main():
    html = fetch_html()
    soup = BeautifulSoup(html, "html.parser")
    channel_image = soup.find("meta", property="og:image")
    channel_photo = channel_image.get("content") if channel_image else None
    messages = soup.find_all("div", class_="tgme_widget_message")
    previous_posts = load_previous_posts()
    posts = []
    for msg in messages:
        p = extract_post(msg, channel_photo, previous_posts)
        if p:
            posts.append(p)

    if not posts:
        print("no posts parsed", file=sys.stderr)
        sys.exit(1)

    # Newest last on the page → reverse so index 0 = newest
    posts.reverse()
    # The home page shows title and body, so only those are checked.
    kept = []
    for p in posts:
        stop = blocked(p["title"], p["body"], item_id=p["id"])
        if stop:
            print(f"skipped by stop list ({stop}): #{p['id']} {p['title']}")
            continue
        kept.append(p)
    posts = kept[:COUNT]
    for i, p in enumerate(posts):
        p["acc"] = ACCENTS[i % len(ACCENTS)]

    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "channel": f"https://telegram.me/{CHANNEL_HANDLE}",
        "items": posts,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(posts)} posts to {OUT}")


if __name__ == "__main__":
    main()
