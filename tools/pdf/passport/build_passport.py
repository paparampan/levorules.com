"""
Сборка PDF «Паспорт сервитора» из свёрстанного HTML-исходника.

Зачем скрипт: исходник — это выгрузка артефакта, где страницы лежат
внутри веб-компонента <doc-page> в shadow DOM. При обычной печати
браузер применяет служебные правила компонента (@page с полем 0.5 cm,
паддинги «листа», aspect-ratio у .page) — из-за них тёмный блок страницы
занимает не весь A4, а примерно две трети, и файл открывается «криво».

Скрипт выносит 49 секций .page из компонента в обычный DOM, задаёт им
жёсткие 210×297 мм и печатает без полей. На выходе — честный A4 с
выделяемым текстом.

Запуск:  python3 tools/pdf/passport/build_passport.py
Выход:   tools/pdf/passport/out/passport-servitora.pdf
"""

from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SOURCE = HERE / "passport-source.html"
# Платный продукт не выкладывается в публичную папку uploads/ —
# сборка кладётся в out/, которая исключена из git.
OUT = HERE / "out" / "passport-servitora.pdf"

TITLE = "Паспорт сервитора — практический гайд"
AUTHOR = "Лево Руля / @levorules"
SUBJECT = ("Последовательный маршрут от исходной проблемы до завершения "
           "работы: 14 решений, поля для заполнения и чистовой паспорт.")

# Вынести страницы из shadow-компонента в обычный поток документа.
FLATTEN = """() => {
  const host = document.querySelector('doc-page');
  if (!host) throw new Error('doc-page не найден: исходник изменился');
  const pages = [...host.querySelectorAll(':scope > section.page')];
  if (!pages.length) throw new Error('страницы .page не найдены');
  document.body.replaceChildren(...pages);
  host.remove();
  const rs = document.documentElement.style;
  rs.setProperty('--doc-page-w', '210mm');
  rs.setProperty('--doc-page-h', '297mm');
  rs.setProperty('--doc-page-margin', '0');
  rs.setProperty('--doc-page-ar', 'auto');
  return pages.length;
}"""

# display у .page не трогаем: обложка и часть страниц собраны на flex.
PRINT_CSS = """
@page { size: 210mm 297mm; margin: 0; }
html, body {
  margin: 0 !important; padding: 0 !important; background: #fff !important;
  width: 210mm !important; height: auto !important; min-height: 0 !important;
  display: block !important; overflow: visible !important; position: static !important;
}
section.page {
  position: relative !important;
  width: 210mm !important; height: 297mm !important; margin: 0 !important;
  border-radius: 0 !important; box-shadow: none !important;
  overflow: hidden !important; box-sizing: border-box !important;
  container-type: size !important;
}
section.page:not(:first-child) { break-before: page !important; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
"""


def render(source: Path = SOURCE, out: Path = OUT) -> int:
    out.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 794, "height": 1123})
        page.goto(source.as_uri(), wait_until="networkidle")
        page.wait_for_timeout(3000)          # шрифты и клиентский рендер
        count = page.evaluate(FLATTEN)
        page.add_style_tag(content=PRINT_CSS)
        page.wait_for_timeout(900)
        page.pdf(
            path=str(out),
            print_background=True,
            prefer_css_page_size=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        browser.close()
    return count


def stamp_metadata(path: Path) -> None:
    reader = PdfReader(str(path))
    writer = PdfWriter()
    for p in reader.pages:
        writer.add_page(p)
    writer.add_metadata({
        "/Title": TITLE,
        "/Author": AUTHOR,
        "/Subject": SUBJECT,
        "/Keywords": "сервитор, магия хаоса, паспорт сервитора, levorules",
    })
    with open(path, "wb") as fh:
        writer.write(fh)


def verify(path: Path, expected_pages: int) -> None:
    reader = PdfReader(str(path))
    assert len(reader.pages) == expected_pages, (
        f"страниц в PDF {len(reader.pages)}, ожидалось {expected_pages}")
    sizes = {(round(float(p.mediabox.width)), round(float(p.mediabox.height)))
             for p in reader.pages}
    assert sizes == {(595, 842)}, f"не A4: {sizes}"
    text = reader.pages[len(reader.pages) // 2].extract_text()
    assert len(text) > 500, "текст не извлекается — страница отрисована картинкой"
    print(f"проверено: {len(reader.pages)} страниц, все 210×297 мм, текст выделяется")


if __name__ == "__main__":
    n = render()
    stamp_metadata(OUT)
    verify(OUT, n)
    print(f"файл: {OUT} ({OUT.stat().st_size / 1024 / 1024:.1f} МБ)")
