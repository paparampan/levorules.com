"""Build full course PDF: cover + modules 0–10 (appendices are separate PDFs)."""
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).parent))
from render_common import (
    load_md, split_front_modules_appendices, build_html, render_pdf, PALETTE
)

REPO = Path(__file__).resolve().parents[2]
OUTPUT_DIR = REPO / "uploads"


def main():
    md = load_md()
    front, modules, _ = split_front_modules_appendices(md)

    # Extract the "Редакция" string from front matter for cover meta
    m_ed = re.search(r"\*Редакция:\s*([^.*]+)\.?\*", front)
    edition = m_ed.group(1).strip() if m_ed else ""

    # Strip the "# СЕРВИТОРЫ: ПОЛНЫЙ КУРС" heading and "*Редакция:...*" from front
    front_body = re.sub(r"^# СЕРВИТОРЫ: ПОЛНЫЙ КУРС\s*\n", "", front, count=1)
    front_body = re.sub(r"^\*Редакция:[^*]*\*\s*\n\s*---\s*\n", "",
                        front_body, count=1, flags=re.MULTILINE)

    cover = {
        "title": "СЕРВИТОРЫ",
        "subtitle": "Полный курс",
        "eyebrow": "ОТКРЫТЫЙ КУРС",
        "meta": "11 МОДУЛЕЙ",
        "lede": ("Авторский модульный курс по сервиторной практике: история, "
                 "проектирование, критическая проверка и безопасное завершение."),
        "edition": f"РЕДАКЦИЯ {edition.upper()}" if edition else "",
    }

    body_md = front_body + "\n\n" + modules

    html = build_html(
        title="СЕРВИТОРЫ: ПОЛНЫЙ КУРС",
        body_md=body_md,
        accent=PALETTE["purple"],
        cover=cover,
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUTPUT_DIR / "servitors.pdf"
    render_pdf(html, out)

if __name__ == "__main__":
    main()
