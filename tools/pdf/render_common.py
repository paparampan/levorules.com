"""
Shared HTML/CSS template + Playwright PDF renderer for Лево Руля course PDFs.

Design system per brand/colors_and_type.css:
  Palette D — void/ash/bone/blood + purple accent (LHP/demonology)
  Oswald (display) + IBM Plex Sans (body) + Space Mono (mono)
  Dark bg, UPPERCASE display, no pastel
"""

from pathlib import Path
import markdown as md_lib
import os
import re

REPO = Path(__file__).resolve().parents[2]
BRAND_FONTS = REPO / "brand" / "fonts"

# Print-friendly inverted palette — same brand DNA, optimized for paper.
# Dark ink on warm cream paper, brand accents retuned for WCAG on white.
PALETTE = {
    "void":       "#0A0A0A",   # kept for reference
    "ash":        "#1F1F1F",
    "ash2":       "#141414",
    "bone":       "#E8E2D3",
    "bone_dim":   "#8C8879",
    "blood":      "#B30000",   # reads fine on cream
    "blood_deep": "#690101",
    "purple":     "#B026FF",

    # PRINT PALETTE (primary)
    "paper":      "#FAFAF5",   # warm off-white bg (kissing cream)
    "paper_2":    "#F1ECE0",   # secondary cream tint (cards, code bg)
    "ink":        "#1A1A1A",   # primary body ink
    "ink_dim":    "#666159",   # secondary muted ink (warm gray)
    "ink_light":  "#8F897C",   # tertiary for minor metadata
    "rule":       "#D8D3C4",   # warm light rule
    "rule_strong":"#B8B09D",   # stronger divider
    "purple_ink": "#6F1AA8",   # darker purple for legibility on white
}


def _google_fonts_link() -> str:
    """Web fonts: Oswald from local TTF (kyrillic-complete),
    IBM Plex Sans + Space Mono from Google Fonts with cyrillic subset."""
    oswald_ttf = (BRAND_FONTS / "Oswald-VariableFont_wght.ttf").as_uri()
    return (
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2'
        '?family=IBM+Plex+Sans:wght@400;500;700'
        '&family=Space+Mono:wght@400;700'
        '&display=swap&subset=cyrillic,latin" rel="stylesheet">'
        f'<style>'
        f'@font-face {{'
        f'  font-family: "Oswald";'
        f'  src: url("{oswald_ttf}") format("truetype");'
        f'  font-weight: 200 700; font-style: normal; font-display: block;'
        f'}}'
        f'</style>'
    )


def css_for_course(accent: str = None) -> str:
    """Print-friendly stylesheet: dark ink on warm paper."""
    p = PALETTE
    accent = accent or p["purple_ink"]
    return f"""
@page {{
  size: A4;
  margin: 22mm 22mm 20mm 22mm;
  background: {p["paper"]};

  @bottom-left {{
    content: "@levorules";
    font-family: "Space Mono", monospace;
    font-size: 8.5pt;
    color: {p["ink_light"]};
    letter-spacing: 0.12em;
    margin-bottom: 6mm;
  }}
  @bottom-right {{
    content: counter(page);
    font-family: "Space Mono", monospace;
    font-size: 8.5pt;
    color: {p["ink_light"]};
    letter-spacing: 0.05em;
    margin-bottom: 6mm;
  }}
}}

@page :first {{
  margin: 0;
  @bottom-left  {{ content: none; }}
  @bottom-right {{ content: none; }}
}}

* {{ box-sizing: border-box; }}

html {{
  background: {p["paper"]};
}}

html, body {{
  margin: 0;
  padding: 0;
  color: {p["ink"]};
  font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 10.5pt;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}}

/* COVER PAGE — editorial print style: cream paper, black ink, red rule. */
.cover {{
  page-break-after: always;
  width: 210mm;
  min-height: 297mm;
  background: {p["paper"]};
  position: relative;
  padding: 28mm 20mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: {p["ink"]};
  overflow: hidden;
}}

.cover-top {{
  display: flex;
  flex-direction: column;
  gap: 10mm;
  position: relative;
}}

.cover-meta {{
  font-family: "Space Mono", monospace;
  font-size: 10pt;
  letter-spacing: 0.18em;
  color: {p["ink_dim"]};
  text-transform: uppercase;
}}

.cover-meta .blood {{
  color: {p["blood"]};
}}

.cover-title {{
  font-family: "Oswald", Impact, sans-serif;
  font-weight: 700;
  font-size: 82pt;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: {p["ink"]};
  margin: 0;
  max-width: 100%;
  overflow-wrap: normal;
  white-space: normal;
  hyphens: manual;
}}

.cover-title.sm {{
  font-size: 54pt;
  line-height: 0.95;
  letter-spacing: -0.02em;
}}

.cover-title.xs {{
  font-size: 40pt;
  line-height: 1.0;
  letter-spacing: -0.01em;
}}

.cover-subtitle {{
  font-family: "Oswald", sans-serif;
  font-weight: 400;
  font-size: 28pt;
  line-height: 1.05;
  color: {p["blood"]};
  letter-spacing: 0.01em;
  margin-top: 10mm;
}}

.cover-rule {{
  height: 2px;
  background: {p["blood"]};
  margin: 8mm 0 6mm 0;
  width: 40mm;
}}

.cover-lede {{
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 13pt;
  line-height: 1.5;
  color: {p["ink_dim"]};
  max-width: 140mm;
}}

.cover-bottom {{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-family: "Space Mono", monospace;
  font-size: 10pt;
  letter-spacing: 0.14em;
  color: {p["ink_dim"]};
  text-transform: uppercase;
  position: relative;
  padding-top: 6mm;
  border-top: 1px solid {p["rule"]};
}}

.cover-bottom .handle {{
  color: {p["ink"]};
  font-weight: 700;
}}

/* Decorative sigil grid in the negative space, super-subtle */
.cover-sigil {{
  position: absolute;
  right: -30mm;
  bottom: -30mm;
  width: 160mm;
  height: 160mm;
  opacity: 0.08;
  background-image:
    linear-gradient(to right, {p["ink"]} 1px, transparent 1px),
    linear-gradient(to bottom, {p["ink"]} 1px, transparent 1px);
  background-size: 8mm 8mm;
  pointer-events: none;
  mask-image: radial-gradient(circle at 70% 70%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at 70% 70%, black 20%, transparent 70%);
}}

/* Large index block (section marker) above title */
.cover-index {{
  font-family: "Space Mono", monospace;
  font-size: 11pt;
  letter-spacing: 0.3em;
  color: {p["blood"]};
  text-transform: uppercase;
  font-weight: 700;
}}

/* CONTENT */
main {{
  padding: 0;
}}

h1 {{
  font-family: "Oswald", Impact, sans-serif;
  font-weight: 700;
  font-size: 30pt;
  line-height: 1.02;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: {p["ink"]};
  margin: 0 0 5mm 0;
  padding-top: 2mm;
  page-break-before: always;
  page-break-after: avoid;
  break-inside: avoid;
  border-bottom: 2px solid {p["blood"]};
  padding-bottom: 4mm;
}}

h1:first-of-type {{
  page-break-before: avoid;
}}

h1 .mnum {{
  font-family: "Space Mono", monospace;
  font-size: 10pt;
  color: {p["blood"]};
  letter-spacing: 0.24em;
  display: block;
  font-weight: 700;
  margin-bottom: 3mm;
  text-transform: uppercase;
}}

h2 {{
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 17pt;
  line-height: 1.12;
  letter-spacing: 0;
  text-transform: uppercase;
  color: {accent};
  margin: 9mm 0 3mm 0;
  page-break-after: avoid;
  border-top: 1px solid {p["rule_strong"]};
  padding-top: 5mm;
}}

h3 {{
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 13.5pt;
  color: {p["ink"]};
  margin: 6mm 0 2mm 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  page-break-after: avoid;
}}

h4 {{
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;
  font-size: 11pt;
  color: {p["blood"]};
  margin: 4mm 0 1.5mm 0;
  page-break-after: avoid;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}}

p {{
  margin: 0 0 3mm 0;
  text-align: left;
  orphans: 3;
  widows: 3;
  hyphens: auto;
  color: {p["ink"]};
}}

strong {{
  color: {p["ink"]};
  font-weight: 700;
}}

em {{
  color: {p["ink_dim"]};
  font-style: italic;
}}

a {{
  color: {p["blood"]};
  text-decoration: none;
  border-bottom: 1px dotted {p["blood"]};
}}

code {{
  font-family: "Space Mono", monospace;
  font-size: 9.5pt;
  background: {p["paper_2"]};
  color: {p["ink"]};
  padding: 1pt 4pt;
  border-radius: 1pt;
  border: 1px solid {p["rule"]};
}}

pre {{
  font-family: "Space Mono", monospace;
  font-size: 9pt;
  background: {p["paper_2"]};
  color: {p["ink"]};
  padding: 4mm 5mm;
  border-left: 3px solid {accent};
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.55;
  margin: 3mm 0;
  page-break-inside: avoid;
}}

pre code {{
  background: none;
  border: none;
  padding: 0;
  color: inherit;
}}

blockquote {{
  margin: 4mm 0;
  padding: 2mm 6mm;
  border-left: 3px solid {p["blood"]};
  color: {p["ink_dim"]};
  font-style: italic;
  background: {p["paper_2"]};
}}

ul, ol {{
  margin: 2mm 0 3mm 5mm;
  padding-left: 4mm;
}}

li {{
  margin: 0 0 1.2mm 0;
  padding-left: 1mm;
  color: {p["ink"]};
}}

ul li::marker {{
  color: {p["blood"]};
  content: "▸ ";
  font-family: "Space Mono", monospace;
  font-size: 9pt;
}}

ol li::marker {{
  color: {p["blood"]};
  font-family: "Space Mono", monospace;
  font-weight: 700;
}}

hr {{
  border: none;
  border-top: 1px solid {p["rule"]};
  margin: 8mm 0;
}}

table {{
  width: 100%;
  border-collapse: collapse;
  margin: 4mm 0;
  font-size: 9.5pt;
  page-break-inside: avoid;
}}

table th {{
  background: {p["ink"]};
  color: {p["paper"]};
  font-family: "Space Mono", monospace;
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: left;
  padding: 2.5mm 3mm;
  border: 1px solid {p["ink"]};
}}

table td {{
  padding: 2.5mm 3mm;
  border: 1px solid {p["rule"]};
  vertical-align: top;
  color: {p["ink"]};
  background: {p["paper"]};
}}

table tr:nth-child(even) td {{
  background: {p["paper_2"]};
}}

/* Intro paragraph after H1 */
h1 + p,
h1 + p em:only-child {{
  font-size: 11.5pt;
  color: {p["ink_dim"]};
  line-height: 1.55;
}}

/* TOC styling */
.toc h2 {{
  border-top: none;
  padding-top: 0;
}}
.toc ul {{
  list-style: none;
  padding: 0;
  margin: 0 0 4mm 0;
}}
.toc li {{
  margin: 1.2mm 0;
  padding: 0;
}}
.toc li::marker {{ content: none; }}

/* Disclaimer block */
.disclaimer {{
  border: 1px solid {p["blood"]};
  background: rgba(179, 0, 0, 0.04);
  padding: 5mm 6mm;
  margin: 0 0 6mm 0;
}}
.disclaimer h2 {{
  margin-top: 0;
  border-top: none;
  padding-top: 0;
  color: {p["blood"]};
}}
"""


def build_html(title: str, body_md: str, *, accent: str = None,
               cover: dict = None, subtitle_meta: str = None) -> str:
    """Assemble full HTML document from markdown body."""
    html_body = md_lib.markdown(
        body_md,
        extensions=["tables", "fenced_code", "sane_lists", "smarty"],
        output_format="html5",
    )

    # Add .toc class around OGLAVLENIE section
    html_body = re.sub(
        r"(<h2[^>]*>ОГЛАВЛЕНИЕ</h2>.*?)(?=<h1|$)",
        r'<div class="toc">\1</div>',
        html_body,
        count=1,
        flags=re.DOTALL,
    )
    # Wrap disclaimer
    html_body = re.sub(
        r"(<h2[^>]*>ДИСКЛЕЙМЕР</h2>.*?)(?=<h2|<h1|$)",
        r'<div class="disclaimer">\1</div>',
        html_body,
        count=1,
        flags=re.DOTALL,
    )

    # Decorate module H1: split "МОДУЛЬ N. TITLE" into small tag + big title
    def _mod_decor(m):
        full = m.group(1)
        parts = full.split(". ", 1)
        if len(parts) == 2 and parts[0].startswith("МОДУЛЬ"):
            return f'<h1><span class="mnum">{parts[0]}</span>{parts[1]}</h1>'
        if full.startswith("ПРИЛОЖЕНИЕ"):
            parts = full.split(". ", 1)
            if len(parts) == 2:
                return f'<h1><span class="mnum">{parts[0]}</span>{parts[1]}</h1>'
        return f"<h1>{full}</h1>"

    html_body = re.sub(r"<h1[^>]*>(.+?)</h1>", _mod_decor, html_body, flags=re.DOTALL)

    cover_html = ""
    if cover:
        title_len = len(cover["title"])
        title_cls = "cover-title"
        if title_len > 20:
            title_cls += " xs"
        elif title_len > 12:
            title_cls += " sm"
        subtitle_html = (f'<div class="cover-subtitle">{cover["subtitle"]}</div>'
                         if cover.get("subtitle") else "")
        meta_sep = " · " if cover.get("meta") else ""
        cover_html = f"""
<section class="cover">
  <div class="cover-sigil"></div>
  <div class="cover-top">
    <div class="cover-meta"><span class="blood">▸</span> {cover.get("eyebrow", "ОТКРЫТЫЙ КУРС")}{meta_sep}{cover.get("meta", "")}</div>
    <h1 class="{title_cls}">{cover["title"]}</h1>
    {subtitle_html}
    <div class="cover-rule"></div>
    <p class="cover-lede">{cover.get("lede", "")}</p>
  </div>
  <div class="cover-bottom">
    <span>{cover.get("edition", "")}</span>
    <span class="handle">@LEVORULES · levorules.com</span>
  </div>
</section>
"""

    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>{title}</title>
{_google_fonts_link()}
<style>{css_for_course(accent)}</style>
</head>
<body>
{cover_html}
<main class="main-content">
{html_body}
</main>
</body>
</html>
"""


def render_pdf(html: str, output_pdf: Path, *, landscape: bool = False,
               format_: str = "A4") -> None:
    """Render HTML to PDF via headless Chromium, with running footer."""
    from playwright.sync_api import Error as PlaywrightError, sync_playwright
    import tempfile

    output_pdf = Path(output_pdf)
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(
        "w", suffix=".html", delete=False, encoding="utf-8"
    ) as fh:
        fh.write(html)
        tmp_html = fh.name

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except PlaywrightError as exc:
            if "Executable doesn't exist" not in str(exc):
                raise
            browser_paths = [
                Path(os.environ.get("PROGRAMFILES", ""))
                / "Google/Chrome/Application/chrome.exe",
                Path(os.environ.get("PROGRAMFILES(X86)", ""))
                / "Microsoft/Edge/Application/msedge.exe",
                Path(os.environ.get("LOCALAPPDATA", ""))
                / "Google/Chrome/Application/chrome.exe",
            ]
            executable = next((path for path in browser_paths if path.is_file()), None)
            if executable is None:
                raise
            browser = p.chromium.launch(executable_path=str(executable))
        page = browser.new_page()
        page.goto("file://" + tmp_html, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(1500)
        page.pdf(
            path=str(output_pdf),
            format=format_,
            landscape=landscape,
            print_background=True,
            prefer_css_page_size=True,
            tagged=True,
            outline=True,
        )
        browser.close()

    Path(tmp_html).unlink(missing_ok=True)
    print(f"  - wrote {output_pdf.name} ({output_pdf.stat().st_size // 1024} KB)")


# MD parsing helpers ---------------------------------------------------

MD_PATH = REPO / "content" / "servitors-course.md"


def load_md() -> str:
    """Load canonical source MD."""
    return MD_PATH.read_text(encoding="utf-8")


def split_front_modules_appendices(md: str):
    """Split MD into (front_matter, modules_text, appendices_text)."""
    # front matter = until first "# МОДУЛЬ 0"
    m_first_mod = re.search(r"^# МОДУЛЬ 0\.", md, flags=re.MULTILINE)
    m_first_app = re.search(r"^# ПРИЛОЖЕНИЕ A\.", md, flags=re.MULTILINE)
    if not m_first_mod or not m_first_app:
        raise RuntimeError("Cannot locate module/appendix boundaries")
    front = md[: m_first_mod.start()].strip()
    modules = md[m_first_mod.start(): m_first_app.start()].strip()
    appendices = md[m_first_app.start():].strip()
    return front, modules, appendices


def split_appendices(app_md: str) -> dict:
    """Split appendix MD into {letter: markdown}."""
    # Split on "# ПРИЛОЖЕНИЕ X. ..."
    parts = re.split(r"^(# ПРИЛОЖЕНИЕ [A-G]\. [^\n]+)$",
                     app_md, flags=re.MULTILINE)
    result = {}
    # parts = ['', heading1, body1, heading2, body2, ...]
    for i in range(1, len(parts), 2):
        heading = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        m = re.match(r"# ПРИЛОЖЕНИЕ ([A-G])\.", heading)
        if m:
            letter = m.group(1)
            result[letter] = heading + body
    return result
