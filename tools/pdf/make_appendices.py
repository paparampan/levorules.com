"""Build 7 separate appendix PDFs (A–G)."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))
from render_common import (
    load_md, split_front_modules_appendices, split_appendices,
    build_html, render_pdf, PALETTE
)

REPO = Path(__file__).resolve().parents[2]
OUTPUT_DIR = REPO / "uploads" / "appendices"

APP_META = {
    "A": ("ГЛОССАРИЙ",
          "prilozhenie-a-glossariy.pdf",
          "Ключевые термины курса."),
    "B": ("АННОТИРОВАННАЯ БИБЛИОГРАФИЯ",
          "prilozhenie-b-bibliografiya.pdf",
          "Полный список источников с короткой аннотацией к каждому."),
    "C": ("ЧЕК-ЛИСТЫ",
          "prilozhenie-c-chek-listy.pdf",
          "Пять рабочих чек-листов: готовность, ритуал, диагностика, маркеры потери дистанции и завершение."),
    "D": ("ШАБЛОНЫ ПРОТОКОЛОВ",
          "prilozhenie-d-shablony-protokolov.pdf",
          "Протокол-листы, контракты, шаблоны ритуалов, отчётов и диагностики."),
    "E": ("52-НЕДЕЛЬНАЯ ПРОГРАММА",
          "prilozhenie-e-52-nedelnaya-programma.pdf",
          "Год самостоятельной практики по неделям."),
    "F": ("FAQ",
          "prilozhenie-f-faq.pdf",
          "Частые вопросы по работе с сервиторами."),
    "G": ("ДОПОЛНИТЕЛЬНАЯ ЛИТЕРАТУРА",
          "prilozhenie-g-dopolnitelnaya-literatura.pdf",
          "Источники для ещё более полного погружения."),
}


def main():
    md = load_md()
    _, _, appendices_md = split_front_modules_appendices(md)
    apps = split_appendices(appendices_md)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for letter, (display_title, filename, lede) in APP_META.items():
        if letter not in apps:
            print(f"  ! appendix {letter} not found in MD, skipping")
            continue

        cover = {
            "title": display_title,
            "subtitle": "",
            "eyebrow": f"СЕРВИТОРЫ · ПРИЛОЖЕНИЕ {letter}",
            "meta": "К ОТКРЫТОМУ КУРСУ",
            "lede": lede,
            "edition": "",
        }
        html = build_html(
            title=f"Приложение {letter}. {display_title}",
            body_md=apps[letter],
            accent=PALETTE["purple"],
            cover=cover,
        )

        out = OUTPUT_DIR / filename
        render_pdf(html, out)

if __name__ == "__main__":
    main()
