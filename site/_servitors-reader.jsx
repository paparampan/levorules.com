// Servitors course — reading view with sticky TOC + block renderer.
// Content is injected via window.SERVITORS_MODULES (see _servitors-content-*.jsx)

function ServitorsReader({ setRoute, initialModule = 0 }) {
  const purple = 'var(--purple)';
  const modules = window.SERVITORS_MODULES || [];
  const clampModule = (idx) => Math.max(0, Math.min(Math.max(0, modules.length - 1), Number.isFinite(idx) ? idx : 0));
  const [activeIdx, setActiveIdx] = React.useState(() => clampModule(initialModule));
  const [activeSection, setActiveSection] = React.useState(null);
  const [courseCompleted, setCourseCompleted] = React.useState(() => (
    window.lrCourseProgress?.read(modules.length).completed || false
  ));
  const contentRef = React.useRef(null);
  const didMountReader = React.useRef(false);

  React.useEffect(() => {
    const next = clampModule(initialModule);
    setActiveIdx(next);
    if (next !== initialModule) {
      setRoute('servitors-reader', null, null, { moduleIndex: next, historyMode: 'replace' });
    }
  }, [initialModule, modules.length]);

  const goToModule = React.useCallback((nextIdx) => {
    const next = clampModule(nextIdx);
    setActiveIdx(next);
    setRoute('servitors-reader', null, null, { moduleIndex: next, historyMode: 'replace' });
  }, [modules.length, setRoute]);

  // scroll to top of article when module changes
  React.useEffect(() => {
    if (didMountReader.current && contentRef.current) {
      const offset = document.documentElement.clientWidth <= 720 ? 124 : 20;
      window.scrollTo({
        top: Math.max(0, contentRef.current.offsetTop - offset),
        behavior: lrReaderScrollBehavior(),
      });
    }
    didMountReader.current = true;
    if (!modules.length) return;
    const result = window.lrCourseProgress?.visit(activeIdx, modules.length);
    const module = modules[activeIdx];
    if (!result || !module) return;

    setCourseCompleted(result.progress.completed);
    const eventDetails = {
      module_index: activeIdx,
      module_number: module.n,
      module_title: module.title,
      modules_total: modules.length,
      progress_percent: result.progressPercent,
    };
    if (result.startedNow) {
      window.lrAnalytics?.course('course_start', eventDetails);
    }
    window.lrAnalytics?.course('course_module_view', {
      ...eventDetails,
      is_returning: result.previous.visitedModules.includes(activeIdx) ? 1 : 0,
      visited_modules: result.progress.visitedModules.length,
    });
    result.newMilestones.forEach((milestone) => {
      window.lrAnalytics?.course('course_progress', {
        ...eventDetails,
        progress_percent: milestone,
      });
    });
  }, [activeIdx, modules.length]);

  // scroll-spy for sections within current module
  React.useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const hs = contentRef.current?.querySelectorAll('[data-section-id]');
      if (!hs) return;
      const scrollY = window.scrollY + 120;
      let current = null;
      hs.forEach(h => {
        if (h.offsetTop <= scrollY) current = h.dataset.sectionId;
      });
      setActiveSection((previous) => previous === current ? previous : current);
    };
    const handler = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', handler, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', handler);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [activeIdx]);

  if (!modules.length) {
    return <div style={{ padding: 80, textAlign: 'center', color: 'var(--bone-dim)' }}>загрузка курса…</div>;
  }

  const mod = modules[activeIdx];
  const finishCourse = () => {
    const result = window.lrCourseProgress?.complete(modules.length);
    if (!result) return;
    setCourseCompleted(true);
    if (!result.completedNow) return;
    const eventDetails = {
      module_index: activeIdx,
      module_number: mod.n,
      module_title: mod.title,
      modules_total: modules.length,
      progress_percent: 100,
    };
    window.lrAnalytics?.course('course_progress', eventDetails);
    window.lrAnalytics?.course('course_complete', eventDetails);
  };
  const openAppendices = () => {
    window.lrAnalytics?.course('course_cta_click', {
      creative_slot: 'course_complete_appendices',
      module_index: activeIdx,
      module_number: mod.n,
      progress_percent: courseCompleted ? 100 : undefined,
    });
    setRoute('servitors', 'appendices');
  };

  return (
    <div>
      {/* READER HEADER — compact, shows current module + breadcrumbs */}
      <section className="sv-reader-toolbar" style={{
        borderBottom: `1px solid var(--border)`,
        background: 'var(--ash-2)',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <div className="sv-reader-toolbar-inner" style={{ maxWidth: 1440, margin: '0 auto', padding: '16px 32px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <a className="sv-reader-home-link" href="#home" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
            ← ЛЕВО РУЛЯ
          </a>
          <span className="sv-reader-separator" style={{ color: 'var(--border-strong)' }}>/</span>
          <a className="sv-reader-course-link" href="#servitors" onClick={(e) => { e.preventDefault(); setRoute('servitors'); }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
            сервиторы
          </a>
          <span className="sv-reader-separator" style={{ color: 'var(--border-strong)' }}>/</span>
          <CourseProgressSigil
            activeIdx={activeIdx}
            total={modules.length}
            moduleNum={mod.n}
            accent={purple}
          />
          <span className="sv-reader-module-label" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: purple }}>
            <span className="sv-reader-module-label-full">МОДУЛЬ {mod.n}</span>
            <span className="sv-reader-module-label-compact" aria-hidden="true">М{mod.n}</span>
          </span>
          <span className="sv-reader-discuss" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--bone-dim)', marginLeft: 16 }}>
            задать вопрос или обсудить можно{' '}
            <a href="https://telegram.me/levorules_chat" target="_blank" rel="noopener"
               style={{ color: purple, textDecoration: 'underline', textUnderlineOffset: 2 }}>ТУТ</a>
          </span>
          <div className="sv-reader-controls" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <ShareLinkButton moduleNum={mod.n} />
            <button
              className="sv-reader-control"
              disabled={activeIdx === 0}
              onClick={() => goToModule(activeIdx - 1)}
              style={navBtnStyle(activeIdx === 0)}>
              ← ПРЕД
            </button>
            <button
              className="sv-reader-control"
              disabled={activeIdx === modules.length - 1}
              onClick={() => goToModule(activeIdx + 1)}
              style={navBtnStyle(activeIdx === modules.length - 1)}>
              СЛЕД →
            </button>
          </div>
        </div>
        {/* progress bar */}
        <div
          className="sv-reader-progress"
          role="progressbar"
          aria-label="Позиция в курсе"
          aria-valuemin={1}
          aria-valuemax={modules.length}
          aria-valuenow={activeIdx + 1}
          aria-valuetext={`Модуль ${mod.n}: позиция ${activeIdx + 1} из ${modules.length}`}
          style={{ height: 2, background: 'var(--border)' }}
        >
          <div className="sv-reader-progress-fill" style={{
            height: '100%',
            background: purple,
            transform: `scaleX(${(activeIdx + 1) / modules.length})`,
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
          <CourseSearch modules={modules} setActiveIdx={goToModule} accent={purple} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--bone-dim)', margin: '20px 0 14px' }}>
            ▸ оглавление курса
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {modules.map((m, i) => (
              <div key={m.n}>
                <button
                  aria-current={i === activeIdx ? 'step' : undefined}
                  onClick={() => goToModule(i)}
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
                        aria-current={activeSection === s.id ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(`s-${s.id}`);
                          if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: lrReaderScrollBehavior() });
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
            редакция 2026-07-10 · @levorules
          </div>
        </aside>

        {/* ARTICLE */}
        <article ref={contentRef} style={{ maxWidth: 760, minWidth: 0 }}>
          <ModuleRenderer mod={mod} accent={purple} />

          {activeIdx === modules.length - 1 && courseCompleted ? (
            <div role="status" aria-live="polite" style={{
              marginTop: 64, padding: '20px 24px',
              border: '1px solid var(--acid-green)', borderLeftWidth: 3,
              background: 'var(--ash-2)', color: 'var(--bone)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--acid-green)' }}>
                ✓ Курс завершён
              </div>
              <p style={{ margin: '10px 0 0', color: 'var(--bone-dim)', lineHeight: 1.55 }}>
                Прогресс сохранён в этом браузере. Теперь можно перейти к справочникам и рабочим шаблонам.
              </p>
            </div>
          ) : null}

          {/* prev/next at end */}
          <div style={{
            marginTop: activeIdx === modules.length - 1 && courseCompleted ? 24 : 80,
            paddingTop: 32, borderTop: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }}>
            {activeIdx > 0 ? (
              <button className="lr-reactive-card" onClick={() => goToModule(activeIdx - 1)} style={articleNavStyle('prev')}>
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
              <button className="lr-reactive-card" onClick={() => goToModule(activeIdx + 1)} style={articleNavStyle('next')}>
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
              <button className="lr-reactive-card" onClick={() => {
                if (courseCompleted) openAppendices();
                else finishCourse();
              }} style={articleNavStyle('next')}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
                  letterSpacing: '0.12em', marginBottom: 8, textAlign: 'right' }}>
                  {courseCompleted ? 'К ПРИЛОЖЕНИЯМ →' : 'ЗАВЕРШИТЬ КУРС →'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: purple, marginBottom: 4, textAlign: 'right' }}>
                  {courseCompleted ? '8 PDF' : `${modules.length} / ${modules.length}`}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                  textAlign: 'right', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {courseCompleted ? <React.Fragment>Справочники<br/>и шаблоны</React.Fragment> : <React.Fragment>Зафиксировать<br/>прохождение</React.Fragment>}
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

function lrReaderScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function CourseProgressSigil({ activeIdx, total, moduleNum, accent }) {
  const count = Math.max(1, total);
  const rotation = (activeIdx / count) * 360;
  const rays = Array.from({ length: count }, (_, index) => index);

  return (
    <span
      className="sv-progress-sigil"
      style={{ '--sv-sigil-accent': accent }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 44 44" focusable="false">
        <circle className="sv-progress-sigil__orbit" cx="22" cy="22" r="12" />
        {rays.map((ray) => (
          <line
            key={ray}
            className={`sv-progress-sigil__ray${ray <= activeIdx ? ' is-lit' : ''}${ray === activeIdx ? ' is-current' : ''}`}
            x1="22" y1="2.5" x2="22" y2="7.5"
            transform={`rotate(${(ray / count) * 360} 22 22)`}
          />
        ))}
        <g
          className="sv-progress-sigil__pointer"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '22px 22px' }}
        >
          <path d="M22 9.5 L19.6 14.8 L24.4 14.8 Z" />
        </g>
        <text className="sv-progress-sigil__number" x="22" y="24.3" textAnchor="middle">
          {String(moduleNum).padStart(2, '0')}
        </text>
      </svg>
    </span>
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
    background: 'var(--ash)', position: 'relative', overflow: 'hidden',
    transition: 'border-color .15s ease, background .15s ease, transform .18s ease',
    '--lr-interaction-accent': 'var(--purple)',
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
  const color = kind === 'danger' ? 'var(--blood-text)'
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
                    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: lrReaderScrollBehavior() });
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
    <button className="sv-share-link" data-copied={copied ? 'true' : 'false'} onClick={copy} title="Скопировать ссылку на этот модуль"
      aria-label={copied ? '✓ СКОПИРОВАНО — ссылка на модуль' : 'ССЫЛКА — скопировать ссылку на этот модуль'}
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
      <span className="sv-share-label">{copied ? '✓ СКОПИРОВАНО' : 'ССЫЛКА'}</span>
    </button>
  );
}

Object.assign(window, { ServitorsReader, RichText });
