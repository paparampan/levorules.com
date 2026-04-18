#!/usr/bin/env python3
"""Fetch latest 5 YouTube Shorts from @levorules and write site/shorts.json.

yt-dlp --flat-playlist gives IDs and view counts (no auth, no API key), but its
title field gets auto-translated. YouTube's public oEmbed endpoint returns the
original-language title for each video, also without auth. We combine both.
"""
import json
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CHANNEL = "https://www.youtube.com/@levorules/shorts"
COUNT = 5
# Write directly to the repo's site/shorts.json so both local runs and
# GitHub Actions leave an immediately-committable result in the working tree.
OUT = Path(__file__).resolve().parents[1] / "site" / "shorts.json"

ACCENTS = [
    "var(--magenta)",
    "var(--acid-green)",
    "var(--purple)",
    "var(--amber)",
    "var(--cyber-cyan)",
]


def fmt_views(n):
    if n is None:
        return ""
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M".replace(".0M", "M")
    if n >= 1_000:
        return f"{n / 1_000:.1f}k".replace(".0k", "k")
    return str(n)


def fetch_ids_and_views():
    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--playlist-end", str(COUNT),
        "--dump-json",
        "--no-warnings",
        CHANNEL,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        print(f"yt-dlp failed: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    out = []
    for ln in r.stdout.splitlines():
        if not ln.strip():
            continue
        d = json.loads(ln)
        out.append({
            "id": d.get("id"),
            "view_count": d.get("view_count"),
            "fallback_title": (d.get("title") or "").strip(),
        })
    return out


def fetch_original_title(video_id):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/shorts/{video_id}&format=json"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
            return (data.get("title") or "").strip()
    except Exception as e:
        print(f"oembed failed for {video_id}: {e}", file=sys.stderr)
        return None


def main():
    raw = fetch_ids_and_views()[:COUNT]
    items = []
    for i, e in enumerate(raw):
        vid = e["id"]
        title = fetch_original_title(vid) or e["fallback_title"]
        items.append({
            "id": vid,
            "title": title,
            "url": f"https://www.youtube.com/shorts/{vid}",
            "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
            "views": fmt_views(e.get("view_count")),
            "acc": ACCENTS[i % len(ACCENTS)],
        })

    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "channel": CHANNEL,
        "items": items,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(f"Wrote {len(items)} shorts to {OUT}")


if __name__ == "__main__":
    main()
