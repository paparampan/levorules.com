#!/usr/bin/env python3
"""Fetch latest @levorules Telegram posts from t.me/s/levorules preview page.

Writes site/telegram.json for the homepage «ПОСЛЕДНИЕ ПОСТЫ» block.
Real file lives in ~/Library/Application Support/levorules/ so launchd can
write it (Desktop is TCC-guarded). A symlink in the site points to it.
"""
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup

CHANNEL_HANDLE = "levorules"
PREVIEW_URL = f"https://t.me/s/{CHANNEL_HANDLE}"
COUNT = 6  # fetch a bit more than the 2 shown; frontend can pick
# Write directly to the repo's site/telegram.json (same rationale as fetch_shorts.py).
OUT = Path(__file__).resolve().parents[1] / "site" / "telegram.json"

ACCENTS = [
    "var(--cyber-cyan)",
    "var(--magenta)",
    "var(--acid-green)",
    "var(--amber)",
    "var(--purple)",
    "var(--blood-text)",
]


def fetch_html():
    req = urllib.request.Request(
        PREVIEW_URL,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8")


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


def extract_text(msg):
    """Return (title, body). Title is first bold line or first sentence."""
    text_div = msg.find("div", class_="tgme_widget_message_text")
    if not text_div:
        return "", ""

    # Preserve line breaks
    for br in text_div.find_all("br"):
        br.replace_with("\n")

    full = text_div.get_text("", strip=False).strip()
    if not full:
        return "", ""

    lines = [ln.strip() for ln in full.split("\n") if ln.strip()]
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

    # Clamp body length
    if len(body) > 260:
        body = body[:257].rstrip() + "…"
    return title, body


def extract_post(msg):
    post_id_attr = msg.get("data-post", "")  # "levorules/96"
    if "/" not in post_id_attr:
        return None
    try:
        pid = int(post_id_attr.split("/", 1)[1])
    except ValueError:
        return None

    title, body = extract_text(msg)
    photo = extract_photo(msg)

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

    return {
        "id": pid,
        "url": f"https://t.me/{CHANNEL_HANDLE}/{pid}",
        "title": title,
        "body": body,
        "photo": photo,
        "date": iso,
        "views": views,
    }


def main():
    html = fetch_html()
    soup = BeautifulSoup(html, "html.parser")
    messages = soup.find_all("div", class_="tgme_widget_message")
    posts = []
    for msg in messages:
        p = extract_post(msg)
        if p:
            posts.append(p)

    if not posts:
        print("no posts parsed", file=sys.stderr)
        sys.exit(1)

    # Newest last on the page → reverse so index 0 = newest
    posts.reverse()
    posts = posts[:COUNT]
    for i, p in enumerate(posts):
        p["acc"] = ACCENTS[i % len(ACCENTS)]

    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "channel": f"https://t.me/{CHANNEL_HANDLE}",
        "items": posts,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(f"Wrote {len(posts)} posts to {OUT}")


if __name__ == "__main__":
    main()
