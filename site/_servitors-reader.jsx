// Servitors course — reading view with sticky TOC + block renderer.
// Content is injected via window.SERVITORS_MODULES (see _servitors-content-*.jsx)

function ServitorsReader({ setRoute, initialModule = 0 }) {
  const purple = 'var(--purple)';
  const modules = window.SERVITORS_MODULES || [];
  const [activeIdx, setActiveIdx] = React.useState(initialModule);
  const [activeSection, setActiveSection] = React.useState(null);
  const contentRef = React.useRef(null);

  // scroll to top of article when module changes
  React.useEffect(() => {
    if (contentRef.current) {
      window.scrollTo({ top: contentRef.current.offsetTop - 20, behavior: 'smooth' });
    }
    // persist
    try { localStorage.setItem('lr_servitor_module', String(activeIdx)); } catch {}
  }, [activeIdx]);

  // scroll-spy for sections within current module
  React.useEffect(() => {
    const handler = () => {
      const hs = contentRef.current?.querySelectorAll('[data-section-id]');
      if (!hs) return;
      const scrollY = window.scrollY + 120;
      let current = null;
      hs.forEach(h => {
        if (h.offsetTop <= scrollY) current = h.dataset.sectionId;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [activeIdx]);

  if (!modules.length) {
    return <div style={{ padding: 80, textAlign: 'center', color: 'var(--bone-dim)' }}>загрузка курса…</div>;
  }

  const mod = modules[activeIdx];

  return (
    <div>
      {/* READER HEADER — compact, shows current module + breadcrumbs */}
      <section style={{
        borderBottom: `1px solid var(--border)`,
        background: 'var(--ash-2)',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '16px 32px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
            ← ЛЕВО РУЛЯ
          </a>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); setRoute('servitors'); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
            сервиторы
          </a>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: purple }}>
            МОДУЛЬ {mod.n}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--bone-dim)', marginLeft: 16 }}>
            задать вопрос или обсудить можно{' '}
            <a href="https://t.me/levorules_chat" target="_blank" rel="noopener"
               style={{ color: purple, textDecoration: 'underline', textUnderlineOffset: 2 }}>ТУТ</a>
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <ShareLinkButton moduleNum={mod.n} />
            <button
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              style={navBtnStyle(activeIdx === 0)}>
              ← ПРЕД
            </button>
            <button
              disabled={activeIdx === modules.length - 1}
              onClick={() => setActiveIdx(Math.min(modules.length - 1, activeIdx + 1))}
              style={navBtnStyle(activeIdx === modules.length - 1)}>
              СЛЕД →
            </button>
          </div>
        </div>
        {/* progress bar */}
        <div style={{ height: 2, background: 'var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${((activeIdx + 1) / modules.length) * 100}%`,
            background: purple,
            transition: 'width .3s ease',
          }} />
        </div>
      </section>

      {/* 2-COLUMN LAYOUT */}
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '48px 32px 96px',
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 56, alignItems: 'start',
      }} className="sv-reader-grid">
        {/* SIDEBAR: SEARCH + TOC */}
        <aside style={{
          position: 'sticky', top: 90,
          maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
          paddingRight: 8,
        }}>
          <CourseSearch modules={modules} setActiveIdx={setActiveIdx} accent={purple} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--bone-dim)', margin: '20px 0 14px' }}>
            ▸ оглавление курса
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {modules.map((m, i) => (
              <div key={m.n}>
                <button
                  onClick={() => setActiveIdx(i)}
                  style={{
                    all: 'unset', cursor: 'pointer',
                    display: 'grid', gridTemplateColumns: '32px 1fr', gap: 10,
                    padding: '10px 10px', width: '100%',
                    alignItems: 'baseline',
                    borderLeft: `2px solid ${i === activeIdx ? purple : 'transparent'}`,
                    background: i === activeIdx ? 'var(--ash)' : 'transparent',
                    color: i === activeIdx ? 'var(--bone)' : 'var(--bone-dim)',
                    transition: 'all .15s ease',
                  }}
                  onMouseEnter={(e) => { if (i !== activeIdx) e.currentTarget.style.color = 'var(--bone)'; }}
                  onMouseLeave={(e) => { if (i !== activeIdx) e.currentTarget.style.color = 'var(--bone-dim)'; }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: purple, fontWeight: 700 }}>
                    {m.n}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                    letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                    {m.title}
                  </span>
                </button>
                {/* inline subsections for active module */}
                {i === activeIdx && m.sections && (
                  <div style={{ display: 'flex', flexDirection: 'column',
                    borderLeft: `1px solid var(--border)`, marginLeft: 15, marginTop: 4, marginBottom: 10 }}>
                    {m.sections.map(s => (
                      <a key={s.id} href={`#s-${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(`s-${s.id}`);
                          if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                        }}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: 11,
                          padding: '5px 12px',
                          color: activeSection === s.id ? purple : 'var(--bone-dim)',
                          textDecoration: 'none',
                          borderLeft: `2px solid ${activeSection === s.id ? purple : 'transparent'}`,
                          marginLeft: -1,
                          letterSpacing: '0.02em',
                        }}>
                        <span style={{ color: 'var(--bone-dim)', opacity: 0.6, marginRight: 6 }}>{s.id}</span>
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
            color: 'var(--bone-dim)', lineHeight: 1.5 }}>
            редакция 2026-04-18 · @levorules
          </div>
        </aside>

        {/* ARTICLE */}
        <article ref={contentRef} style={{ maxWidth: 760, minWidth: 0 }}>
          <ModuleRenderer mod={mod} accent={purple} />

          {/* prev/next at end */}
          <div style={{
            marginTop: 80, paddingTop: 32, borderTop: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }}>
            {activeIdx > 0 ? (
              <button onClick={() => setActiveIdx(activeIdx - 1)} style={articleNavStyle('prev')}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
                  letterSpacing: '0.12em', marginBottom: 8 }}>← ПРЕДЫДУЩИЙ</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: purple, marginBottom: 4 }}>
                  МОДУЛЬ {modules[activeIdx - 1].n}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                  {modules[activeIdx - 1].title}
                </div>
              </button>
            ) : <div />}
            {activeIdx < modules.length - 1 ? (
              <button onClick={() => setActiveIdx(activeIdx + 1)} style={articleNavStyle('next')}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
                  letterSpacing: '0.12em', marginBottom: 8, textAlign: 'right' }}>СЛЕДУЮЩИЙ →</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: purple, marginBottom: 4, textAlign: 'right' }}>
                  МОДУЛЬ {modules[activeIdx + 1].n}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textAlign: 'right' }}>
                  {modules[activeIdx + 1].title}
                </div>
              </button>
            ) : (
              <button onClick={() => {
                setRoute('servitors');
                setTimeout(() => {
                  document.getElementById('appendices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }} style={articleNavStyle('next')}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
                  letterSpacing: '0.12em', marginBottom: 8, textAlign: 'right' }}>К ПРИЛОЖЕНИЯМ →</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: purple, marginBottom: 4, textAlign: 'right' }}>
                  8 PDF
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                  textAlign: 'right', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  Справочники<br/>и шаблоны
                </div>
              </button>
            )}
          </div>
        </article>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .sv-reader-grid { grid-template-columns: 1fr !important; }
          .sv-reader-grid > aside { position: static !important; max-height: none !important; }
        }
      `}</style>
    </div>
  );
}

function navBtnStyle(disabled) {
  return {
    all: 'unset',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: 11,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '6px 12px',
    border: '1px solid var(--border-strong)',
    color: disabled ? 'var(--border-strong)' : 'var(--bone-dim)',
    opacity: disabled ? 0.5 : 1,
  };
}
function articleNavStyle(which) {
  return {
    all: 'unset', cursor: 'pointer',
    padding: 24, border: '1px solid var(--border)',
    background: 'var(--ash)', transition: 'border-color .15s ease, background .15s ease',
    textAlign: which === 'next' ? 'right' : 'left',
  };
}

// ---------- RENDERER ----------
function ModuleRenderer({ mod, accent }) {
  return (
    <div>
      {/* module hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
          color: accent, textTransform: 'uppercase', marginBottom: 12 }}>
          ▸ МОДУЛЬ {mod.n}
          {mod.time && <span style={{ color: 'var(--bone-dim)', marginLeft: 14 }}>{mod.time}</span>}
        </div>
        <h1 style={{
          fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 0.92, letterSpacing: '-0.02em',
          margin: 0,
        }}>{mod.title}</h1>
        {mod.sub && (
          <p style={{ marginTop: 20, fontSize: 20, lineHeight: 1.45,
            color: 'var(--bone)', maxWidth: 640 }}>
            <RichText text={mod.sub} />
          </p>
        )}
        <div style={{ height: 2, width: 72, background: accent, marginTop: 32 }} />
      </div>

      {mod.sections && mod.sections.map(s => (
        <section key={s.id} id={`s-${s.id}`} data-section-id={s.id} style={{ marginBottom: 56, scrollMarginTop: 80 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3vw, 38px)',
            letterSpacing: '-0.01em', lineHeight: 1.05,
            marginBottom: 20, paddingBottom: 12,
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: accent,
              letterSpacing: '0.05em', marginRight: 14, display: 'inline-block', minWidth: 38 }}>
              {s.id}
            </span>
            {s.title}
          </h2>
          {s.blocks && s.blocks.map((b, i) => <Block key={i} b={b} accent={accent} />)}
        </section>
      ))}

      {mod.practice && (
        <Callout kind="practice" accent={accent} title="ПРАКТИКА МОДУЛЯ">
          {mod.practiceIntro && (
            <div style={{ marginBottom: 18, lineHeight: 1.6 }}>
              <RichText text={mod.practiceIntro} />
            </div>
          )}
          {mod.practice.map((p, i) => (
            <div key={i} style={{ marginBottom: i < mod.practice.length - 1 ? 14 : 0 }}>
              <b style={{ color: accent, fontFamily: 'var(--font-mono)', fontSize: 13, marginRight: 8 }}>
                {String(i + 1).padStart(2, '0')}
              </b>
              {typeof p === 'string' ? <RichText text={p} /> : p}
            </div>
          ))}
        </Callout>
      )}

      {mod.selfcheck && (
        <Callout kind="check" accent={accent} title="ВОПРОСЫ ДЛЯ САМОПРОВЕРКИ">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {mod.selfcheck.map((q, i) => (
              <li key={i} style={{ padding: '10px 0',
                borderBottom: i < mod.selfcheck.length - 1 ? '1px dashed var(--border)' : 'none',
                display: 'grid', gridTemplateColumns: '24px 1fr', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-dim)' }}>—</span>
                <span><RichText text={q} /></span>
              </li>
            ))}
          </ul>
        </Callout>
      )}
    </div>
  );
}

function Block({ b, accent }) {
  if (b.type === 'p')
    return <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--bone)', margin: '0 0 20px' }}>
      <RichText text={b.text} />
    </p>;

  if (b.type === 'h')
    return <h3 style={{
      fontSize: 22, margin: '36px 0 14px',
      letterSpacing: '-0.005em', lineHeight: 1.2,
      color: 'var(--bone)',
    }}><RichText text={b.text} /></h3>;

  if (b.type === 'h4')
    return <h4 style={{
      fontSize: 16, margin: '24px 0 10px',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: accent, fontFamily: 'var(--font-mono)', fontWeight: 700,
    }}><RichText text={b.text} /></h4>;

  if (b.type === 'quote')
    return <blockquote style={{
      margin: '28px 0', padding: '20px 24px',
      borderLeft: `3px solid ${accent}`,
      background: 'var(--ash-2)',
      fontFamily: 'var(--font-display)', fontWeight: 500,
      fontSize: 22, lineHeight: 1.35, letterSpacing: '-0.005em',
      color: 'var(--bone)', fontStyle: 'italic',
    }}>
      <RichText text={b.text} />
      {b.cite && <div style={{
        marginTop: 12, fontFamily: 'var(--font-mono)',
        fontSize: 12, letterSpacing: '0.1em', color: 'var(--bone-dim)',
        fontStyle: 'normal', textTransform: 'uppercase',
      }}>— {b.cite}</div>}
    </blockquote>;

  if (b.type === 'list')
    return <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none' }}>
      {b.items.map((it, i) => (
        <li key={i} style={{ padding: '6px 0', paddingLeft: 24, position: 'relative',
          fontSize: 16, lineHeight: 1.55, color: 'var(--bone)' }}>
          <span style={{ position: 'absolute', left: 0, color: accent,
            fontFamily: 'var(--font-mono)', fontSize: 13 }}>▸</span>
          <RichText text={it} />
        </li>
      ))}
    </ul>;

  if (b.type === 'olist')
    return <ol style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', counterReset: 'li' }}>
      {b.items.map((it, i) => (
        <li key={i} style={{
          padding: '10px 0', paddingLeft: 44, position: 'relative',
          fontSize: 16, lineHeight: 1.6, color: 'var(--bone)',
          borderBottom: i < b.items.length - 1 ? '1px dashed var(--border)' : 'none',
        }}>
          <span style={{ position: 'absolute', left: 0, top: 10,
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            color: accent, letterSpacing: '0.05em' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <RichText text={it} />
        </li>
      ))}
    </ol>;

  if (b.type === 'table')
    return <div style={{ margin: '0 0 28px', border: '1px solid var(--border)' }}>
      {b.rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: b.cols || '200px 1fr',
          borderBottom: i < b.rows.length - 1 ? '1px solid var(--border)' : 'none',
          background: i === 0 && b.header ? 'var(--ash)' : 'transparent',
        }}>
          {r.map((c, j) => (
            <div key={j} style={{
              padding: '12px 16px', lineHeight: 1.5,
              borderRight: j < r.length - 1 ? '1px solid var(--border)' : 'none',
              color: i === 0 && b.header ? accent : 'var(--bone)',
              fontFamily: i === 0 && b.header ? 'var(--font-mono)' : 'var(--font-body)',
              fontWeight: i === 0 && b.header ? 700 : (j === 0 && !b.header ? 600 : 400),
              letterSpacing: i === 0 && b.header ? '0.08em' : 'normal',
              textTransform: i === 0 && b.header ? 'uppercase' : 'none',
              fontSize: i === 0 && b.header ? 11 : 14,
            }}>
              <RichText text={c} />
            </div>
          ))}
        </div>
      ))}
    </div>;

  if (b.type === 'callout') return <Callout kind={b.kind} title={b.title} accent={accent}>
    {typeof b.body === 'string' ? <RichText text={b.body} /> : b.body}
  </Callout>;

  if (b.type === 'code')
    return <div style={{
      margin: '0 0 24px', padding: '16px 18px',
      background: 'var(--void)', border: '1px solid var(--border-strong)',
      fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.55,
      color: 'var(--bone)', whiteSpace: 'pre-wrap',
    }}>{b.text}</div>;

  if (b.type === 'hr')
    return <div style={{ height: 1, background: 'var(--border)', margin: '40px 0' }} />;

  return null;
}

// Lightweight inline markup: **bold**, *italic*, `code`
function RichText({ text }) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;
  const patterns = [
    { re: /\*\*([^*]+)\*\*/, render: (m) => <b key={key++} style={{ color: 'var(--bone)' }}>{m[1]}</b> },
    { re: /\*([^*]+)\*/, render: (m) => <i key={key++}>{m[1]}</i> },
    { re: /`([^`]+)`/, render: (m) => <code key={key++} style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.92em',
      padding: '1px 6px', background: 'var(--ash)',
      border: '1px solid var(--border)', color: 'var(--bone)',
    }}>{m[1]}</code> },
  ];
  while (remaining.length) {
    let best = null;
    for (const p of patterns) {
      const m = remaining.match(p.re);
      if (m && (!best || m.index < best.m.index)) best = { m, p };
    }
    if (!best) { parts.push(remaining); break; }
    if (best.m.index > 0) parts.push(remaining.slice(0, best.m.index));
    parts.push(best.p.render(best.m));
    remaining = remaining.slice(best.m.index + best.m[0].length);
  }
  return <>{parts}</>;
}

function Callout({ kind = 'note', title, accent, children }) {
  const color = kind === 'danger' ? 'var(--blood)'
    : kind === 'warning' ? 'var(--amber)'
    : kind === 'practice' ? accent || 'var(--purple)'
    : kind === 'check' ? 'var(--cyber-cyan)'
    : kind === 'note' ? 'var(--bone-dim)'
    : accent;
  const glyph = kind === 'danger' ? '⚠' : kind === 'warning' ? '△' : kind === 'practice' ? '▸' : kind === 'check' ? '?' : '·';
  return (
    <div style={{
      margin: '28px 0',
      border: `1px solid ${color}`,
      background: 'var(--ash-2)',
      padding: 0,
    }}>
      {title && (
        <div style={{
          padding: '10px 18px',
          borderBottom: `1px solid ${color}`,
          background: `color-mix(in oklab, ${color} 12%, transparent)`,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: color, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>{glyph}</span>{title}
        </div>
      )}
      <div style={{
        padding: '18px 22px',
        fontSize: 15, lineHeight: 1.6,
        color: 'var(--bone)',
      }}>{children}</div>
    </div>
  );
}

// ---------- COURSE SEARCH ----------
// Flat, client-side substring search over section titles + block text.
// Builds a lightweight index on first use (memoized). Typing 2+ chars shows
// matches with module index, section id, title, and a highlighted snippet.
function buildIndex(modules) {
  const idx = [];
  modules.forEach((m, mi) => {
    (m.sections || []).forEach((s) => {
      const text = (s.blocks || []).map((b) => {
        if (typeof b.text === 'string') return b.text;
        if (Array.isArray(b.items)) return b.items.join(' ');
        if (Array.isArray(b.rows)) return b.rows.flat().join(' ');
        return '';
      }).join(' ');
      idx.push({
        moduleIdx: mi,
        moduleN: m.n,
        moduleTitle: m.title,
        sectionId: s.id,
        sectionTitle: s.title,
        body: text,
        hay: (s.title + ' ' + text).toLowerCase(),
      });
    });
  });
  return idx;
}

function CourseSearch({ modules, setActiveIdx, accent }) {
  const [q, setQ] = React.useState('');
  const index = React.useMemo(() => buildIndex(modules), [modules]);
  const query = q.trim().toLowerCase();
  const hits = query.length >= 2
    ? index.filter((it) => it.hay.includes(query)).slice(0, 20)
    : [];

  const snippet = (body, query) => {
    const i = body.toLowerCase().indexOf(query);
    if (i < 0) return '';
    const start = Math.max(0, i - 40);
    const end = Math.min(body.length, i + query.length + 80);
    let s = (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
    return s;
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--bone-dim)', marginBottom: 8 }}>
        ▸ поиск по курсу
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="сигила, гнозис, клипот…"
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '8px 10px',
          background: 'var(--ash)', color: 'var(--bone)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 12,
          outline: 'none',
        }}
      />
      {q.trim().length >= 2 && (
        <div style={{ marginTop: 10, border: '1px solid var(--border)',
          maxHeight: 400, overflowY: 'auto', background: 'var(--ash-2)' }}>
          {hits.length === 0 ? (
            <div style={{ padding: '14px 12px', fontSize: 12, color: 'var(--bone-dim)' }}>
              ничего не найдено
            </div>
          ) : (
            hits.map((h, i) => (
              <button key={i}
                onClick={() => {
                  setActiveIdx(h.moduleIdx);
                  setQ('');
                  setTimeout(() => {
                    const el = document.getElementById('s-' + h.sectionId);
                    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                  }, 50);
                }}
                style={{
                  all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
                  padding: '10px 12px',
                  borderBottom: i < hits.length - 1 ? '1px dashed var(--border)' : 'none',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ash)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: accent, letterSpacing: '0.08em' }}>
                  МОДУЛЬ {h.moduleN} · § {h.sectionId}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                  marginTop: 2, lineHeight: 1.25, color: 'var(--bone)' }}>
                  {h.sectionTitle}
                </div>
                {snippet(h.body, query) && (
                  <div style={{ marginTop: 4, fontSize: 11, lineHeight: 1.4, color: 'var(--bone-dim)' }}>
                    {snippet(h.body, query)}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ---------- SHARE LINK BUTTON ----------
function ShareLinkButton({ moduleNum }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    const n = parseInt(moduleNum, 10);
    const url = `${location.origin}${location.pathname}#servitors-reader/${n}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // fallback
      prompt('Ссылка:', url);
    }
  };
  return (
    <button onClick={copy} title="Скопировать ссылку на этот модуль"
      style={{
        all: 'unset', cursor: 'pointer',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '6px 10px',
        border: '1px solid var(--border)',
        color: copied ? 'var(--acid-green)' : 'var(--bone-dim)',
        borderColor: copied ? 'var(--acid-green)' : 'var(--border)',
        transition: 'all .15s ease',
      }}>
      {copied ? '✓ СКОПИРОВАНО' : 'ССЫЛКА'}
    </button>
  );
}

Object.assign(window, { ServitorsReader });
