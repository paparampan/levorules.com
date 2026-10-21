#!/usr/bin/env python3
"""Fast regression checks for course content and the production artifact."""

from pathlib import Path
import json
import re
import sys


REPO = Path(__file__).resolve().parents[1]
COURSE = REPO / "content" / "servitors-course.md"
text = COURSE.read_text(encoding="utf-8")
errors: list[str] = []


FORBIDDEN = {
    "unsafe breath-hold protocol": r"до полной физиологической невозможности",
    "unsafe falling instruction": r"падаешь расслабленно",
    "blood puncture instruction": r"стерильн(?:ая|ой) игл",
    "false Carroll taxonomy": r"Кэрролл даёт \*\*пять спектров",
    "obsolete schizophrenia subtype": r"параноидная шизофрения",
    "stale Hine publication year": r"Hine's Varieties[^\n]*2024",
    "duplicate Vessiere title": r"Sentient Imaginary Friends, Embodied Joint Attention",
    "stale glossary typo": r"\*\*Кампир",
    "stale appendix count": r"Шаблоны протоколов \(10 листов\)",
    "legacy Koetting spelling": r"\bКеттинг\b",
    "legacy Enmerkar spelling": r"\bEnmerkar\b",
    "legacy Brother Marsyas spelling": r"\bMarsyas\b",
    "legacy Mathers spelling": r"\bМэзерс\b",
    "legacy Pagels spelling": r"\bПейгелс\b",
    "legacy Leitch spelling": r"\bЛейтч\b",
    "legacy Stratton-Kent spelling": r"\bСтраттон-Кент\b",
    "legacy Kripal spelling": r"\bКрипаль\b",
    "legacy Wayne spelling": r"\bВэйн\b",
    "legacy Wilde spelling": r"\bВайлд\b",
    "stale Vessiere sample size": r"166 информант",
    "stale Vessiere country count": r"17 стран",
    "translationese review": r"\bревю\b",
    "translationese case": r"\bкейс(?:ы|а|ов|ом|е)?\b",
    "translationese valid": r"\bвалиден\b",
    "translationese insight": r"\bинсайт(?:а|ы|ов|ом|е)?\b",
    "translationese trigger": r"\bтриггер(?:а|ы|ов|ом|е)?\b",
    "translationese stress profile": r"стресс-профиль",
    "translationese sharing": r"\bшеринг\b",
    "translationese background": r"философский бэкграунд",
    "translationese banishing routine": r"банишинг-рутина",
    "obsolete M-SMART framework": r"M-SMART",
    "obsolete qualification tests": r"квалификационн(?:ый|ые|ого|ых|ому|ым|ыми|ая|ой|ую)\s+(?:тест|испыт)",
    "unsafe acid disposal": r"солян(?:ая|ой|ую) кислот",
    "unsafe water disposal": r"выбросить (?:его |их )?в (?:реку|море|воду)",
    "obsessive forty-day residue check": r"через 40 дней",
    "obsolete 21-day streak": r"21 день подряд",
    "translationese paradigm surfing": r"парадигмальн(?:ый|ого|ом) с[её]рфинг",
}

regression_targets = {
    "canonical course": text,
    "course shell": (REPO / "site" / "_servitors.jsx").read_text(encoding="utf-8"),
    "home course callout": (REPO / "site" / "_home-mid.jsx").read_text(encoding="utf-8"),
}
for target_name, target_text in regression_targets.items():
    for label, pattern in FORBIDDEN.items():
        if re.search(pattern, target_text, flags=re.IGNORECASE):
            errors.append(f"{label} in {target_name}: /{pattern}/")

modules = re.findall(r"^# МОДУЛЬ (\d+)\.", text, flags=re.MULTILINE)
if modules != [str(i) for i in range(11)]:
    errors.append(f"module sequence is {modules!r}, expected 0..10")

if "- 9.5. Сервитор как посредник в работе с Тенью" not in text:
    errors.append("TOC is missing module 9.5")
if "- 9.6. Когда пора к специалисту по психическому здоровью" not in text:
    errors.append("TOC is missing module 9.6")

appendix_c = text.split("# ПРИЛОЖЕНИЕ C.", 1)[1].split("# ПРИЛОЖЕНИЕ D.", 1)[0]
appendix_d = text.split("# ПРИЛОЖЕНИЕ D.", 1)[1].split("# ПРИЛОЖЕНИЕ E.", 1)[0]
if len(re.findall(r"^## C\.\d+\.", appendix_c, flags=re.MULTILINE)) != 5:
    errors.append("appendix C must contain exactly five checklists")
if len(re.findall(r"^## D\.\d+\.", appendix_d, flags=re.MULTILINE)) != 5:
    errors.append("appendix D must contain exactly five forms")

appendix_f = text.split("# ПРИЛОЖЕНИЕ F.", 1)[1].split("# ПРИЛОЖЕНИЕ G.", 1)[0]
faq_count = len(re.findall(r"^\*\*\d+\. ", appendix_f, flags=re.MULTILINE))
if faq_count != 50:
    errors.append(f"FAQ has {faq_count} questions, expected 50")

duration_heading = re.compile(
    r"^#{1,6} .*\((?:≈\s*)?\d+(?:[–-]\d+)?\s*(?:мин|час)",
    flags=re.MULTILINE | re.IGNORECASE,
)
if duration_heading.search(text):
    errors.append("a reading-duration estimate remains in a heading")

public = REPO / "public"
if public.exists():
    forbidden_public = []
    for path in public.rglob("*"):
        rel = path.relative_to(public)
        parts = rel.parts
        if (
            ".git" in parts
            or "node_modules" in parts
            or path.suffix == ".jsx"
            or (parts and parts[0] in {"tools", "frames", "screenshots", "content", "reference"})
            or path.name == "servitors.txt"
            # PRINTS media: only hashed web copies, never masters, briefs or archives.
            or (parts[:1] == ("media",) and path.is_file() and path.suffix not in {".webp", ".png", ".mp4"})
        ):
            forbidden_public.append(str(rel))
    if forbidden_public:
        errors.append("forbidden files in public/: " + ", ".join(forbidden_public))

# PRINTS copy rule from the brief: new Russian text uses е, plain quotes and no long dash.
def prints_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from prints_strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from prints_strings(item)

prints_copy = [
    (path.name, text)
    for path in sorted((REPO / "content" / "prints").glob("*.json"))
    for text in prints_strings(json.loads(path.read_text(encoding="utf-8")))
]
prints_copy += [("_prints.jsx", (REPO / "site" / "_prints.jsx").read_text(encoding="utf-8"))]
for name, text in prints_copy:
    found = sorted(set(re.findall(r"[ёЁ«»—]", text)))
    if found:
        errors.append(f"PRINTS copy in {name} uses {''.join(found)}: {text[:60]}")

if errors:
    print("Content audit failed:")
    for error in errors:
        print(f"  - {error}")
    sys.exit(1)

print("Content audit passed: structure, safety regressions and public artifact checked")
