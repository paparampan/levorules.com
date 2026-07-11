#!/usr/bin/env python3
"""Full port Servitors_Course_Report.md → _servitors-content-{1,2}.jsx.

Preserves:
  - All module sections 1-to-1 (no truncation).
  - Block-level markdown: headings (h3/h4), paragraphs, em-dash bullet lists,
    numbered lists, pipe tables, blockquotes.
  - Inline markup (**bold**, *italic*, `code`) passed through to RichText.
  - Per-module "Практика" and "Вопросы для самопроверки" blocks.
"""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
MD = Path.home() / "Desktop" / "___Другое" / "СЕРВ" / "Servitors_Course_Report.md"
OUT1 = REPO / "site" / "_servitors-content-1.jsx"
OUT2 = REPO / "site" / "_servitors-content-2.jsx"

# ---------- parse ----------

MODULE_RE = re.compile(
    r"^# МОДУЛЬ (\d+)\. ([^\n]+)\n(.*?)(?=\n# (?:МОДУЛЬ \d+|ПРИЛОЖЕНИЕ ))",
    re.DOTALL | re.MULTILINE,
)


def sentence_case(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    # Лово руля: keep abbreviations/parenthesized acronyms as-is. Simplest:
    # lower all, then upper-case the very first character.
    return s[0].upper() + s[1:].lower()


HEADING_DURATION_RE = re.compile(
    r"\s*\((?:≈\s*)?(?:"
    r"\d+(?:[.,]\d+)?(?:[–-]\d+(?:[.,]\d+)?)?\s*(?:мин(?:ут(?:а|ы)?)?|час(?:а|ов)?)"
    r"(?:,\s*[^)]*)?|\d+\s*вечер[^)]*)\)",
    re.IGNORECASE,
)


def strip_display_duration(s: str) -> str:
    """Remove duration estimates from headings and standalone bold labels."""
    s = re.sub(
        r"\(еженедельно,\s*\d+\s*минут(?:а|ы)?\)",
        "(еженедельно)",
        s,
        flags=re.IGNORECASE,
    )
    return HEADING_DURATION_RE.sub("", s)


def parse_blocks(md: str):
    """Convert markdown block-level content into JSX block objects."""
    lines = md.split("\n")
    blocks = []
    i = 0
    n = len(lines)

    def is_list_continuation(s: str) -> bool:
        s = s.strip()
        if not s:
            return False
        if s.startswith(("— ", "- ", "|", ">", "#")):
            return False
        if re.match(r"^\d+\. ", s):
            return False
        return True

    while i < n:
        prev = i
        raw = lines[i]
        s = raw.strip()

        # Skip blanks
        if not s:
            i += 1
            continue

        # Horizontal rule — skip (module-internal separators)
        if s == "---":
            i += 1
            continue

        # Fenced code block
        if s.startswith("```"):
            i += 1
            code_lines = []
            while i < n and lines[i].strip() != "```":
                code_lines.append(lines[i])
                i += 1
            if i < n:
                i += 1  # skip closing fence
            blocks.append({"type": "code", "text": "\n".join(code_lines)})
            continue

        # Headings (inside-section). ## Title (no N.M.) also promotes to h.
        if s.startswith("#### "):
            blocks.append({"type": "h4", "text": strip_display_duration(s[5:].strip())})
            i += 1
            continue
        if s.startswith("### "):
            blocks.append({"type": "h", "text": strip_display_duration(s[4:].strip())})
            i += 1
            continue
        if s.startswith("## "):
            # Inside-section ## heading (not a N.M. section — those are caught
            # by SECTION_RE at the parent level).
            blocks.append({"type": "h", "text": strip_display_duration(s[3:].strip())})
            i += 1
            continue

        # Table (pipe syntax)
        if s.startswith("|") and s.count("|") >= 2:
            tbl = []
            while i < n and lines[i].strip().startswith("|"):
                tbl.append(lines[i].strip())
                i += 1
            rows = []
            for t in tbl:
                cells = [c.strip() for c in t.strip("|").split("|")]
                # skip "|---|---|" separator
                if all(re.fullmatch(r":?-+:?", c or "") for c in cells):
                    continue
                rows.append(cells)
            if rows:
                block = {"type": "table", "header": True, "rows": rows}
                if len(rows[0]) == 3:
                    block["cols"] = "minmax(140px, 1fr) 1fr 1fr"
                blocks.append(block)
            continue

        # Blockquote → quote
        if s.startswith("> "):
            qlines = []
            while i < n and lines[i].strip().startswith(">"):
                qlines.append(lines[i].strip().lstrip(">").strip())
                i += 1
            text = " ".join(q for q in qlines if q)
            blocks.append({"type": "quote", "text": text})
            continue

        # Em-dash bullet list: lines starting with "— "
        if s.startswith("— "):
            items = []
            while i < n and lines[i].strip().startswith("— "):
                item = lines[i].strip()[2:].strip()
                i += 1
                # wrapped continuation lines
                while i < n and is_list_continuation(lines[i]):
                    item += " " + lines[i].strip()
                    i += 1
                items.append(item)
            blocks.append({"type": "list", "items": items})
            continue

        # ASCII-hyphen bullets "- " (rare in this MD, support anyway)
        if s.startswith("- "):
            items = []
            while i < n and lines[i].strip().startswith("- "):
                item = lines[i].strip()[2:].strip()
                i += 1
                while i < n and is_list_continuation(lines[i]):
                    item += " " + lines[i].strip()
                    i += 1
                items.append(item)
            blocks.append({"type": "list", "items": items})
            continue

        # Numbered list
        if re.match(r"^\d+\. ", s):
            items = []
            while i < n and re.match(r"^\d+\. ", lines[i].strip()):
                item = re.sub(r"^\d+\. ", "", lines[i].strip())
                i += 1
                while i < n and is_list_continuation(lines[i]):
                    item += " " + lines[i].strip()
                    i += 1
                items.append(item)
            blocks.append({"type": "olist", "items": items})
            continue

        # Regular paragraph (single logical paragraph; blank line ends it)
        para = []
        while i < n and lines[i].strip() and not lines[i].strip().startswith(("— ", "- ", "#", "|", ">")) and not re.match(r"^\d+\. ", lines[i].strip()) and lines[i].strip() != "---":
            para.append(lines[i].strip())
            i += 1
        if para:
            text = " ".join(para)
            if re.fullmatch(r"\*\*.+\*\*", text):
                text = strip_display_duration(text)
            blocks.append({"type": "p", "text": text})
        if i == prev:
            # Defensive: never loop on same line
            print(f"  STUCK line {i}: {lines[i][:100]!r}", flush=True)
            i += 1

    return blocks


SECTION_RE = re.compile(
    r"^## (\d+\.\d+\.) ([^\n]+)\n(.*?)(?=\n## \d+\.\d+\.|\n---\n\n### Практика Модуля|\n### Практика Модуля|\Z)",
    re.DOTALL | re.MULTILINE,
)


def parse_module(num: int, title: str, body: str) -> dict:
    # sub: text between module header and first "## N.M."
    sub_match = re.match(
        r"\s*(.*?)(?=^## \d+\.\d+\.)",
        body,
        re.DOTALL | re.MULTILINE,
    )
    sub_text = (sub_match.group(1).strip() if sub_match else "").strip()
    # take first paragraph only
    if sub_text:
        first_para = sub_text.split("\n\n")[0].strip()
        sub_text = first_para

    # sections
    sections = []
    for sm in SECTION_RE.finditer(body):
        sid = sm.group(1).rstrip(".")
        stitle = strip_display_duration(sm.group(2).strip())
        sbody = sm.group(3)
        blocks = parse_blocks(sbody)
        sections.append({"id": sid, "title": stitle, "blocks": blocks})

    # practice
    practice = []
    practice_intro = None
    pm = re.search(r"### Практика Модуля \d+\n\n?(.*?)(?=\n### |\Z)", body, re.DOTALL)
    if pm:
        pbody = pm.group(1).strip()
        # 1) numbered list items
        items = re.findall(r"^\d+\. (.+?)(?=\n\d+\. |\Z)", pbody, re.DOTALL | re.MULTILINE)
        if items:
            first_item = re.search(r"^\d+\. ", pbody, re.MULTILINE)
            if first_item and pbody[:first_item.start()].strip():
                practice_intro = " ".join(pbody[:first_item.start()].split())
            practice = [" ".join(it.split()) for it in items if it.strip()]
        else:
            # 2) em-dash bullets
            items = re.findall(r"^— (.+?)(?=\n— |\Z)", pbody, re.DOTALL | re.MULTILINE)
            if items:
                first_item = re.search(r"^— ", pbody, re.MULTILINE)
                if first_item and pbody[:first_item.start()].strip():
                    practice_intro = " ".join(pbody[:first_item.start()].split())
                practice = [" ".join(it.split()) for it in items if it.strip()]
            else:
                # 3) fallback — split by blank lines, each paragraph = one item
                paras = re.split(r"\n\s*\n", pbody)
                clean_paras = [
                    " ".join(p.split())
                    for p in paras
                    if p.strip() and not p.strip().startswith("```")
                ]
                if len(clean_paras) > 1 and clean_paras[0].endswith(":"):
                    practice_intro = clean_paras.pop(0)
                practice = clean_paras

    # selfcheck
    selfcheck = []
    sm = re.search(r"### Вопросы для самопроверки\n\n?(.*?)(?=\n---|\Z)", body, re.DOTALL)
    if sm:
        sbody = sm.group(1).strip()
        items = re.findall(r"^— (.+?)(?=\n— |\Z)", sbody, re.DOTALL | re.MULTILINE)
        selfcheck = [" ".join(it.split()) for it in items if it.strip()]

    return {
        "n": f"{num:02d}",
        "title": sentence_case(title),
        "sub": sub_text or None,
        "sections": sections,
        "practice": practice,
        "practiceIntro": practice_intro,
        "selfcheck": selfcheck,
    }


# ---------- serialize ----------

def js_string(s):
    # Encode as JSON-like double-quoted string. JS accepts JSON.
    return json.dumps(s, ensure_ascii=False)


def emit_block(b, indent=10):
    pad = " " * indent
    t = b["type"]
    if t in ("p", "h", "h4", "quote", "code"):
        parts = [f'type: {js_string(t)}', f'text: {js_string(b["text"])}']
        if t == "quote" and b.get("cite"):
            parts.append(f'cite: {js_string(b["cite"])}')
        return pad + "{ " + ", ".join(parts) + " }"
    if t in ("list", "olist"):
        items = b["items"]
        if len(items) <= 3 and sum(len(x) for x in items) < 120:
            # inline
            arr = "[" + ", ".join(js_string(x) for x in items) + "]"
            return pad + "{ " + f'type: {js_string(t)}, items: {arr}' + " }"
        else:
            inner = ",\n".join(" " * (indent + 2) + js_string(x) for x in items)
            return (
                pad + "{ " + f'type: {js_string(t)}, items: [\n'
                + inner + "\n" + " " * indent + "] }"
            )
    if t == "table":
        rows_inner = ",\n".join(
            " " * (indent + 2) + "[" + ", ".join(js_string(c) for c in r) + "]"
            for r in b["rows"]
        )
        cols = f', cols: {js_string(b["cols"])}' if b.get("cols") else ""
        return (
            pad + "{ " + f'type: "table", header: true{cols}, rows: [\n'
            + rows_inner + "\n" + " " * indent + "] }"
        )
    if t == "callout":
        # reserved — not emitted by parser today
        return pad + "{ " + f'type: "callout", kind: {js_string(b.get("kind", "note"))}, title: {js_string(b.get("title", ""))}, body: {js_string(b.get("body", ""))}' + " }"
    return pad + "null"


def emit_section(sec, indent=6):
    pad = " " * indent
    out = [pad + "{"]
    out.append(" " * (indent + 2) + f'id: {js_string(sec["id"])},')
    out.append(" " * (indent + 2) + f'title: {js_string(sec["title"])},')
    out.append(" " * (indent + 2) + "blocks: [")
    for b in sec["blocks"]:
        out.append(emit_block(b, indent + 4) + ",")
    out.append(" " * (indent + 2) + "],")
    out.append(pad + "}")
    return "\n".join(out)


def emit_module(mod, indent=2):
    pad = " " * indent
    out = [pad + f"// === MODULE {mod['n']} ===", pad + "{"]
    out.append(" " * (indent + 2) + f'n: {js_string(mod["n"])},')
    out.append(" " * (indent + 2) + f'title: {js_string(mod["title"])},')
    if mod.get("sub"):
        out.append(" " * (indent + 2) + f'sub: {js_string(mod["sub"])},')
    out.append(" " * (indent + 2) + "sections: [")
    for sec in mod["sections"]:
        out.append(emit_section(sec, indent + 4) + ",")
    out.append(" " * (indent + 2) + "],")
    if mod["practice"]:
        if mod.get("practiceIntro"):
            out.append(" " * (indent + 2) + f'practiceIntro: {js_string(mod["practiceIntro"])},')
        out.append(" " * (indent + 2) + "practice: [")
        for p in mod["practice"]:
            out.append(" " * (indent + 4) + js_string(p) + ",")
        out.append(" " * (indent + 2) + "],")
    if mod["selfcheck"]:
        out.append(" " * (indent + 2) + "selfcheck: [")
        for q in mod["selfcheck"]:
            out.append(" " * (indent + 4) + js_string(q) + ",")
        out.append(" " * (indent + 2) + "],")
    out.append(pad + "}")
    return "\n".join(out)


def main():
    text = MD.read_text(encoding="utf-8")
    mods = []
    for m in MODULE_RE.finditer(text):
        num = int(m.group(1))
        title = strip_display_duration(m.group(2).strip())
        body = m.group(3)
        mods.append(parse_module(num, title, body))

    if len(mods) != 11:
        print(f"WARN: parsed {len(mods)} modules, expected 11")
        for m in mods:
            print(" ", m["n"], m["title"])

    header = (
        "// Servitors course — auto-generated from Servitors_Course_Report.md.\n"
        "// Regenerate via: python3 tools/md_to_jsx.py\n"
        "// Do not edit by hand.\n\n"
    )

    # part 1: modules 0-4
    part1 = header + "window.SERVITORS_CONTENT_1 = [\n"
    part1 += ",\n".join(emit_module(m) for m in mods if int(m["n"]) <= 4)
    part1 += ",\n];\n"

    # part 2: modules 5-10
    part2 = header + "window.SERVITORS_CONTENT_2 = [\n"
    part2 += ",\n".join(emit_module(m) for m in mods if int(m["n"]) >= 5)
    part2 += ",\n];\n"

    OUT1.write_text(part1, encoding="utf-8")
    OUT2.write_text(part2, encoding="utf-8")
    print(f"Wrote {OUT1} ({len(part1):,} chars)")
    print(f"Wrote {OUT2} ({len(part2):,} chars)")
    for m in mods:
        secn = len(m["sections"])
        blk = sum(len(s["blocks"]) for s in m["sections"])
        print(f"  Module {m['n']} «{m['title']}» — {secn} sections, {blk} blocks, practice={len(m['practice'])}, selfcheck={len(m['selfcheck'])}")


if __name__ == "__main__":
    main()
