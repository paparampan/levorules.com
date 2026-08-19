"""
Квадратная обложка «Паспорта сервитора» 1024×1024 — для страницы товара
и для карточки Tribute. Собирается из того же брендового набора, что и сам
гайд: void/bone/blood, Oswald + IBM Plex Mono + Spectral.

Запуск:  python3 tools/pdf/passport/build_cover.py
Выход:   passport-servitora/assets/cover.png
         passport-servitora/assets/cover.webp
         tools/pdf/passport/out/tribute-cover.png (то же изображение для Tribute)
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
FONTS = HERE / "fonts"
OSWALD = REPO / "brand" / "fonts" / "Oswald-VariableFont_wght.ttf"

ASSETS = REPO / "passport-servitora" / "assets"
TRIBUTE = HERE / "out" / "tribute-cover.png"

PAGES = 49
PRICE = "299 ₽"


def html() -> str:
    def face(family: str, filename: str, weight: str) -> str:
        return ("@font-face{font-family:'%s';src:url('%s') format('truetype');"
                "font-weight:%s;font-style:normal;font-display:block;}"
                % (family, (FONTS / filename).as_uri(), weight))

    fonts = (
        "@font-face{font-family:'Oswald';src:url('%s') format('truetype');"
        "font-weight:200 700;font-style:normal;font-display:block;}" % OSWALD.as_uri()
        + face("IBM Plex Mono", "IBMPlexMono-400.ttf", "400")
        + face("IBM Plex Mono", "IBMPlexMono-600.ttf", "600")
        + face("Spectral", "Spectral-300.ttf", "300")
        + face("Spectral", "Spectral-400.ttf", "400")
    )

    return f"""<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
{fonts}
*{{box-sizing:border-box;margin:0;padding:0;}}
html,body{{width:1024px;height:1024px;background:#0C0B0A;}}
.cover{{
  width:1024px;height:1024px;padding:64px 66px 58px;background:#0C0B0A;color:#E8E2D3;
  display:flex;flex-direction:column;justify-content:space-between;
  border:1px solid #241F1B;
}}
.top{{display:flex;justify-content:space-between;align-items:baseline;
  font-family:'IBM Plex Mono';font-size:13px;letter-spacing:.2em;text-transform:uppercase;
  color:#8C8578;}}
.top b{{color:#D64545;font-weight:400;border-bottom:1px solid #D64545;padding-bottom:2px;}}
.mark{{display:flex;align-items:center;gap:22px;margin:56px 0 34px;}}
.mark span{{width:46px;height:46px;border:2px solid #B32020;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:'IBM Plex Mono';font-size:19px;color:#E05252;}}
.mark i{{flex:1;height:2px;background:#B32020;display:block;}}
.kicker{{font-family:'IBM Plex Mono';font-size:14.5px;letter-spacing:.22em;
  text-transform:uppercase;color:#8C8578;line-height:2.1;}}
h1{{font-family:'Oswald';font-weight:700;font-size:112px;line-height:.96;
  letter-spacing:-.02em;text-transform:uppercase;margin:26px 0 0;color:#F0EADB;}}
.lede{{font-family:'Spectral';font-weight:300;font-size:25px;line-height:1.5;
  color:#B9B2A3;margin:34px 0 0;max-width:760px;}}
.parts{{display:flex;gap:26px;margin:44px 0 0;}}
.parts>div{{flex:1;border-top:2px solid #B32020;padding-top:14px;}}
.parts span{{font-family:'IBM Plex Mono';font-size:12px;letter-spacing:.16em;
  text-transform:uppercase;color:#E05252;}}
.parts p{{font-family:'Spectral';font-size:17px;line-height:1.4;color:#9A9385;margin-top:9px;}}
.bottom{{display:flex;justify-content:space-between;align-items:flex-end;
  border-top:1px solid #241F1B;padding-top:22px;}}
.motto{{font-family:'IBM Plex Mono';font-size:17px;letter-spacing:.16em;
  text-transform:uppercase;color:#E05252;line-height:1.8;}}
.meta{{font-family:'IBM Plex Mono';font-size:14px;letter-spacing:.18em;
  text-transform:uppercase;color:#8C8578;text-align:right;line-height:1.9;}}
.meta u{{color:#E8E2D3;text-decoration:none;}}
</style></head><body>
<div class="cover">
  <div>
    <div class="top"><span>Лево Руля · антидогматический оккультизм</span><b>@levorules</b></div>
    <div class="mark"><span>I</span><i></i></div>
    <div class="kicker">практический гайд · pdf · {PAGES} страниц</div>
    <h1>Паспорт<br>сервитора</h1>
    <p class="lede">Последовательный маршрут от исходной проблемы до завершения
      работы: что решать, в каком порядке и по каким признакам проверять результат.</p>
    <div class="parts">
      <div><span>Часть I · черновик</span><p>14 шагов: разбор решения и страница полей.</p></div>
      <div><span>Часть II · чистовой</span><p>12 страниц окончательных формулировок.</p></div>
    </div>
  </div>
  <div class="bottom">
    <div class="motto">Ничто не истинно.<br>Всё дозволено.</div>
    <div class="meta"><u>{PRICE}</u><br>магия хаоса · 2026</div>
  </div>
</div></body></html>"""


def main() -> None:
    tmp = HERE / "_cover.html"
    tmp.write_text(html(), encoding="utf-8")
    ASSETS.mkdir(parents=True, exist_ok=True)
    png = ASSETS / "cover.png"

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1024, "height": 1024},
                                device_scale_factor=1)
        page.goto(tmp.as_uri(), wait_until="networkidle")
        page.wait_for_timeout(700)
        page.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": 1024, "height": 1024})
        browser.close()

    img = Image.open(png).convert("RGB")
    assert img.size == (1024, 1024), img.size
    img.save(ASSETS / "cover.webp", "WEBP", quality=92, method=6)
    TRIBUTE.parent.mkdir(parents=True, exist_ok=True)
    img.save(TRIBUTE, "PNG")
    tmp.unlink()
    print(f"обложка: {png} и {ASSETS / 'cover.webp'}")
    print(f"для Tribute: {TRIBUTE}")


if __name__ == "__main__":
    main()
