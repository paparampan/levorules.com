"""Stop list for the auto-fetched home page feeds (content/feed-stoplist.json).

The feed scripts skip matching shorts and posts, and verify_site.py fails if
one reaches public/. build.mjs applies the same rules when it copies the feeds.
"""
import json
import re
from pathlib import Path

LIST = Path(__file__).resolve().parents[1] / "content" / "feed-stoplist.json"


def _load():
    data = json.loads(LIST.read_text(encoding="utf-8"))
    substrings = [s.lower() for s in data["substrings"]]
    words = "|".join(re.escape(w.lower()) for w in data["words"])
    allow = {str(i) for i in data.get("allow_ids", [])}
    return substrings, re.compile(rf"(?<!\w)({words})\w{{0,3}}(?!\w)"), allow


SUBSTRINGS, WORDS, ALLOW_IDS = _load()


def blocked(*texts, item_id=None):
    """Return the stop word found in any of the texts, or None.

    Items listed in allow_ids (YouTube video id or Telegram post number) pass.
    """
    if item_id is not None and str(item_id) in ALLOW_IDS:
        return None
    for text in texts:
        low = (text or "").lower()
        for stem in SUBSTRINGS:
            if stem in low:
                return stem
        match = WORDS.search(low)
        if match:
            return match.group(1)
    return None
