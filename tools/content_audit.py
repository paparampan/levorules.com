#!/usr/bin/env python3
"""Fast regression checks for course content and the production artifact."""

from pathlib import Path
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
}

for label, pattern in FORBIDDEN.items():
    if re.search(pattern, text, flags=re.IGNORECASE):
        errors.append(f"{label}: /{pattern}/")

modules = re.findall(r"^# МОДУЛЬ (\d+)\.", text, flags=re.MULTILINE)
if modules != [str(i) for i in range(11)]:
    errors.append(f"module sequence is {modules!r}, expected 0..10")

if "- 9.5. Сервитор как интерфейс к Тени" not in text:
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
            or (parts and parts[0] in {"tools", "frames", "screenshots"})
            or path.name == "servitors.txt"
        ):
            forbidden_public.append(str(rel))
    if forbidden_public:
        errors.append("forbidden files in public/: " + ", ".join(forbidden_public))

if errors:
    print("Content audit failed:")
    for error in errors:
        print(f"  - {error}")
    sys.exit(1)

print("Content audit passed: structure, safety regressions and public artifact checked")
