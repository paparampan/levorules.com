#!/usr/bin/env python3
"""Web derivatives for the PRINTS section.

Masters stay outside the repository (the handoff package). This tool verifies
each master against the sha256 recorded in content/prints/<slug>.json, writes
hashed web copies to media/prints/<slug>/ and the map of those copies to
content/prints/<slug>.media.json. npm run build only copies media/ to public/.

  python tools/prints_media.py images --source <unpacked package dir>
  python tools/prints_media.py video --slug sdelay-tak-chtoby-pylalo --input loop.mp4 [--poster-from-video] [--x264-params ...]

The video command strips audio, checks 16:9, writes a hashed MP4 and sets
video.src/width/height/duration_seconds in the print JSON. With
--poster-from-video the poster copies are rebuilt from the first frame.

A loop restarts on a keyframe whose coding grain differs from the last
P-frames, which shows as a grain flash at the seam. --x264-params passes
libx264 options, e.g. bitrate zones rising toward the end (informatsionnyy-shum):
  zones=0,2,b=4/120,139,b=1.15/140,159,b=1.35/160,179,b=1.6/180,199,b=2/200,214,b=2.6/215,230,b=3.5
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat

REPO = Path(__file__).resolve().parents[1]
CONTENT = REPO / "content" / "prints"
MEDIA = REPO / "media" / "prints"

PRODUCT_WIDTHS = (480, 800)
PRODUCT_QUALITY = 86
POSTER_WIDTHS = (960,)
POSTER_QUALITY = 84
ARTWORK_WIDTHS = (1400, 2800)
OG_SIZE = (1200, 630)
VOID = (10, 10, 10)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_print(slug: str) -> dict:
    return json.loads((CONTENT / f"{slug}.json").read_text(encoding="utf-8"))


def section_slugs() -> list[str]:
    return json.loads((CONTENT / "index.json").read_text(encoding="utf-8"))["prints"]


def read_master(source: Path, entry: dict) -> Image.Image:
    path = source / entry["master"]
    data = path.read_bytes()
    if sha256(data) != entry["sha256"]:
        raise SystemExit(f"master hash mismatch: {path}")
    image = Image.open(io.BytesIO(data))
    image.load()
    if image.size != (entry["width"], entry["height"]):
        raise SystemExit(f"master size mismatch: {path} is {image.size}")
    return image


def psnr(a: Image.Image, b: Image.Image) -> float:
    diff = ImageChops.difference(a.convert("RGB"), b.convert("RGB"))
    mse = sum(v * v for v in ImageStat.Stat(diff).rms) / 3
    return float("inf") if mse == 0 else 20 * math.log10(255 / math.sqrt(mse))


def resize(image: Image.Image, width: int) -> Image.Image:
    if width >= image.width:
        return image.copy()
    height = round(image.height * width / image.width)
    if image.mode == "RGBA":
        # Premultiplied alpha keeps antialiased letter edges free of dark fringes.
        return image.convert("RGBa").resize((width, height), Image.LANCZOS).convert("RGBA")
    return image.resize((width, height), Image.LANCZOS)


class Writer:
    def __init__(self, slug: str):
        self.dir = MEDIA / slug
        self.url = f"/media/prints/{slug}"
        self.keep: set[str] = set()

    def write(self, stem: str, ext: str, data: bytes) -> str:
        name = f"{stem}-{sha256(data)[:10]}.{ext}"
        self.dir.mkdir(parents=True, exist_ok=True)
        (self.dir / name).write_bytes(data)
        self.keep.add(name)
        return f"{self.url}/{name}"

    def webp(self, stem: str, image: Image.Image, **options) -> tuple[str, bytes]:
        buffer = io.BytesIO()
        image.save(buffer, "WEBP", method=6, **options)
        data = buffer.getvalue()
        return self.write(stem, "webp", data), data

    def prune(self, keep_prefixes: tuple[str, ...] = ()) -> None:
        for path in self.dir.iterdir():
            if path.name in self.keep or path.name.startswith(keep_prefixes):
                continue
            path.unlink()


def webp_variants(writer: Writer, stem: str, image: Image.Image, widths, quality, report, label):
    variants = []
    for width in sorted({*(w for w in widths if w < image.width), image.width}):
        scaled = resize(image, width)
        url, data = writer.webp(f"{stem}-{width}", scaled.convert("RGB"), quality=quality)
        decoded = Image.open(io.BytesIO(data))
        report.append(f"  {label} {width}w  {len(data) / 1024:7.1f} KB  PSNR {psnr(scaled, decoded):5.1f} dB")
        variants.append({"src": url, "width": scaled.width, "height": scaled.height})
    return variants


def og_card(artwork: Image.Image) -> bytes:
    card = Image.new("RGB", OG_SIZE, VOID)
    # Scale and centre by the visible lettering; the canvas keeps its own print margins.
    # A tall artwork is capped by height so it stays whole above the caption line.
    left, top, right, bottom = artwork.getchannel("A").getbbox()
    scale = min(980 / (right - left), 440 / (bottom - top))
    art = resize(artwork, round(artwork.width * scale))
    x = round(OG_SIZE[0] / 2 - (left + right) / 2 * scale)
    y = round(250 - (top + bottom) / 2 * scale)
    card.paste(art, (x, y), art)
    draw = ImageDraw.Draw(card)
    font_path = REPO / "brand" / "fonts" / "Oswald-VariableFont_wght.ttf"
    font = ImageFont.truetype(str(font_path), 30)
    try:
        font.set_variation_by_axes([600])
    except (OSError, AttributeError):
        pass
    draw.rectangle((80, 520, 80 + 48, 522), fill=(179, 0, 0))
    draw.text((80, 536), "ЛЕВО РУЛЯ · ПРИНТЫ", font=font, fill=(232, 226, 211))
    draw.text((OG_SIZE[0] - 80, 536), "levorules.com", font=font, fill=(140, 136, 121), anchor="ra")
    buffer = io.BytesIO()
    card.save(buffer, "PNG", optimize=True)
    return buffer.getvalue()


def build_images(source: Path, slug: str) -> None:
    data = load_print(slug)
    writer = Writer(slug)
    report: list[str] = [f"{slug}:"]
    media: dict = {"generated_by": "tools/prints_media.py images", "slug": slug}

    artwork_master = (source / data["artwork"]["master"]).read_bytes()
    artwork = read_master(source, data["artwork"])
    if artwork.mode != "RGBA" or artwork.getextrema()[3][0] != 0:
        raise SystemExit("artwork must keep its transparent background")
    media["artwork"] = {
        "full": {"src": writer.write("artwork", "png", artwork_master), "width": artwork.width, "height": artwork.height},
        "variants": [],
    }
    # No upscaled duplicates: an artwork narrower than every target ships at its own width.
    for width in [w for w in ARTWORK_WIDTHS if w < artwork.width] or [artwork.width]:
        scaled = resize(artwork, width)
        url, encoded = writer.webp(f"artwork-{width}", scaled, lossless=True, quality=100, exact=False)
        decoded = Image.open(io.BytesIO(encoded)).convert("RGBA")
        exact = ImageChops.difference(decoded, scaled).getbbox() is None or psnr(decoded, scaled) > 60
        report.append(f"  artwork {width}w lossless {len(encoded) / 1024:6.1f} KB  identical to resample: {exact}")
        media["artwork"]["variants"].append({"src": url, "width": scaled.width, "height": scaled.height})

    poster = read_master(source, data["video"]["poster"]).convert("RGB")
    media["poster"] = webp_variants(writer, "poster", poster, POSTER_WIDTHS, POSTER_QUALITY, report, "poster")

    og = og_card(artwork)
    media["og"] = {"src": writer.write("og", "png", og), "width": OG_SIZE[0], "height": OG_SIZE[1]}
    report.append(f"  og {OG_SIZE[0]}x{OG_SIZE[1]} {len(og) / 1024:6.1f} KB")

    media["products"] = {}
    for product in data["products"]:
        image = read_master(source, product["image"]).convert("RGB")
        stem = f"{product['order']:02d}-{product['id'].removeprefix(data['id'].rsplit('-', 1)[0] + '-')}"
        media["products"][product["id"]] = webp_variants(
            writer, stem, image, PRODUCT_WIDTHS, PRODUCT_QUALITY, report, f"{product['order']:02d}",
        )

    writer.prune(keep_prefixes=("loop-",))
    (CONTENT / f"{slug}.media.json").write_text(json.dumps(media, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    total = sum(p.stat().st_size for p in writer.dir.iterdir())
    report.append(f"  total {total / 1024 / 1024:.2f} MB in {writer.dir.relative_to(REPO)}")
    print("\n".join(report))


def ffprobe(path: Path) -> dict:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


def poster_from_video(slug: str, video: Path) -> None:
    frame = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        check=True, capture_output=True,
    ).stdout
    image = Image.open(io.BytesIO(frame)).convert("RGB")
    writer = Writer(slug)
    media_path = CONTENT / f"{slug}.media.json"
    media = json.loads(media_path.read_text(encoding="utf-8"))
    old = {Path(v["src"]).name for v in media["poster"]}
    report: list[str] = []
    media["poster"] = webp_variants(writer, "poster", image, POSTER_WIDTHS, POSTER_QUALITY, report, "poster")
    for name in old - writer.keep:
        (writer.dir / name).unlink(missing_ok=True)
    media_path.write_text(json.dumps(media, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("poster from the first frame:\n" + "\n".join(report))


def build_video(slug: str, source: Path, crf: int, poster: bool = False, x264_params: str | None = None) -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise SystemExit("ffmpeg and ffprobe are required")
    probe = ffprobe(source)
    video = next((s for s in probe["streams"] if s["codec_type"] == "video"), None)
    if not video:
        raise SystemExit("no video stream")
    width, height = int(video["width"]), int(video["height"])
    if abs(width / height - 16 / 9) > 0.002:
        raise SystemExit(f"video is {width}x{height}, expected 16:9; crop it deliberately before connecting")

    writer = Writer(slug)
    temp = writer.dir / "_transcode.mp4"
    writer.dir.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(source),
        "-map", "0:v:0", "-an", "-sn", "-dn",
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        *(["-x264-params", x264_params] if x264_params else []),
        "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
        str(temp),
    ], check=True)
    data = temp.read_bytes()
    temp.unlink()
    for old in writer.dir.glob("loop-*.mp4"):
        old.unlink()
    url = writer.write("loop", "mp4", data)

    result = ffprobe(writer.dir / url.rsplit("/", 1)[1])
    if any(s["codec_type"] == "audio" for s in result["streams"]):
        raise SystemExit("audio stream survived transcoding")
    duration = round(float(result["format"]["duration"]), 2)

    path = CONTENT / f"{slug}.json"
    content = json.loads(path.read_text(encoding="utf-8"))
    content["video"].update({"src": url, "width": width, "height": height, "duration_seconds": duration})
    path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{slug}: {url} {width}x{height} {duration}s {len(data) / 1024 / 1024:.2f} MB, no audio")
    if poster:
        poster_from_video(slug, writer.dir / url.rsplit("/", 1)[1])
    print("Check the loop seam by eye, then run npm run build.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest="command", required=True)
    images = commands.add_parser("images")
    images.add_argument("--source", type=Path, required=True)
    images.add_argument("--slug", action="append")
    video = commands.add_parser("video")
    video.add_argument("--slug", required=True)
    video.add_argument("--input", type=Path, required=True)
    video.add_argument("--crf", type=int, default=20)
    video.add_argument("--poster-from-video", action="store_true", help="replace the poster with the first frame")
    video.add_argument("--x264-params", help="extra libx264 options, e.g. zones toward the loop seam")
    args = parser.parse_args()

    if args.command == "images":
        for slug in args.slug or section_slugs():
            build_images(args.source.resolve(), slug)
    else:
        build_video(args.slug, args.input.resolve(), args.crf, args.poster_from_video, args.x264_params)


if __name__ == "__main__":
    sys.exit(main())
