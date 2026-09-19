// Header — sticky top nav with Ritual mode toggle
function Header({ ritual, setRitual, route, setRoute }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const mobileNavToggleRef = React.useRef(null);
  React.useEffect(() => setMobileNavOpen(false), [route]);
  React.useEffect(() => {
    if (!mobileNavOpen) return;
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMobileNavOpen(false);
      requestAnimationFrame(() => mobileNavToggleRef.current?.focus());
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavOpen]);

  const items = [
    { id: 'home', label: 'Главная' },
    { id: 'servitors', label: 'Сервиторы', accent: 'var(--purple)' },
    { id: 'guides', label: 'Гайды', accent: 'var(--acid-green)' },
    { id: 'who', label: 'Кто я', accent: 'var(--blood-text)' },
    { id: 'tg', label: 'Telegram', href: 'https://telegram.me/levorules', external: true },
  ];
  return (
    <header className={`lr-site-header${route === 'servitors-reader' ? ' lr-site-header--reader' : ''}`} style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="lr-header-inner" style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <a className="lr-brand-link" href="/" onClick={(e) => { if (!lrPlainClick(e)) return; e.preventDefault(); setRoute('home'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--bone)' }}>
          <LRLogo size={30} color="blood" alt="" />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.005em', lineHeight: 1 }}>
            ЛЕВО&nbsp;РУЛЯ
          </div>
        </a>
        <button
          ref={mobileNavToggleRef}
          type="button"
          className="lr-nav-toggle"
          aria-expanded={mobileNavOpen}
          aria-controls="lr-primary-navigation"
          aria-label={mobileNavOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span aria-hidden="true">{mobileNavOpen ? '×' : '☰'}</span>
          <span>Меню</span>
        </button>
        <nav
          id="lr-primary-navigation"
          aria-label="Основная навигация"
          className={`lr-main-nav${mobileNavOpen ? ' is-open' : ''}`}
          style={{ display: 'flex', gap: 4 }}
        >
          {items.map(i => {
            const isActive = route === i.id
              || (i.id === 'servitors' && route === 'servitors-reader')
              || (i.id === 'guides' && route === 'guide');
            const accent = i.accent || 'var(--bone)';
            return i.external ? (
              <a key={i.id} href={i.href} target="_blank" rel="noopener"
                className="lr-nav-link"
                onClick={() => setMobileNavOpen(false)}
                style={navLinkStyle(false, accent)}>
                <span style={{ color: 'var(--blood-text)' }}>▸</span> {i.label} ↗
              </a>
            ) : (
              <a key={i.id} href={i.id === 'servitors' ? '/servitors/' : i.id === 'guides' ? '/guides/' : i.id === 'who' ? '/who/' : '/#' + i.id}
                className="lr-nav-link"
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  if (i.hash || !lrPlainClick(e)) return;
                  e.preventDefault();
                  setMobileNavOpen(false);
                  setRoute(i.id);
                }}
                style={navLinkStyle(isActive, accent)}>
                <span style={{ color: accent }}>▸</span> {i.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function navLinkStyle(active, accent) {
  return {
    display: 'inline-flex', gap: 6, alignItems: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: active ? 'var(--bone)' : 'var(--bone-dim)',
    padding: '8px 12px',
    textDecoration: 'none',
    borderBottom: active ? `1px solid ${accent}` : '1px solid transparent',
    transition: 'color .15s ease',
  };
}

// Kinetic word: letters rise in one by one; hover changes Oswald weight (variable font).
function KineticWord({ text, tone, delay = 0, ghost }) {
  return (
    <span className={`lr-kinetic lr-kinetic--${tone}`}>
      {Array.from(text).map((ch, i) => (
        <span key={i} style={{ animationDelay: `${delay + i * 0.06}s` }}>{ch}</span>
      ))}
      {ghost && <span className="lr-kinetic__ghost" aria-hidden="true">{text}</span>}
    </span>
  );
}

const HERO_MARQUEE = [
  { text: 'ничто не истинно', accent: 'var(--blood-text)' },
  { text: 'всё дозволено', accent: 'var(--purple)' },
  { text: 'сигилы · сервиторы · гнозис', accent: 'var(--amber)' },
  { text: 'азазель · люцифер · белиал', accent: 'var(--acid-green)' },
  { text: 'fac ut ardeat', accent: 'var(--cyber-cyan)' },
  { text: 'технология воли', accent: 'var(--magenta)' },
];

// Hero
function Hero({ ritual }) {
  const sigilRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const el = sigilRef.current; if (!el) return;
      const dx = (e.clientX / window.innerWidth - .5) * 30, dy = (e.clientY / window.innerHeight - .5) * 30;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
      <div ref={sigilRef} className="lr-hero-sigil" style={{ position: 'absolute', right: -80, top: -60, pointerEvents: 'none' }}>
        {typeof ChaosStar !== 'undefined'
          ? <ChaosStar accent="var(--blood)" opacity={0.42} size={600} />
          : <SigilTriad accent="var(--blood)" opacity={0.28} size={560} />}
      </div>
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 80px' }}>
        <h1 aria-label="ЛЕВО РУЛЯ" style={{
          fontSize: 'clamp(80px, 12vw, 180px)',
          margin: 0, lineHeight: 0.85, letterSpacing: '-0.02em',
          cursor: 'default', userSelect: 'none',
        }}>
          <KineticWord text="ЛЕВО" tone="bone" delay={0.1} />
          <span style={{ color: 'var(--blood-display)', display: 'block' }}>
            <KineticWord text="РУЛЯ" tone="blood" delay={0.38} ghost />
          </span>
        </h1>

        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'end' }}>
          <div className="lr-hero-fade">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.1em', color: 'var(--bone)', textTransform: 'uppercase' }}>
              магия хаоса · демонология · путь левой руки
            </div>
            <p style={{ marginTop: 20, fontSize: 19, lineHeight: 1.5, color: 'var(--bone)', maxWidth: 520 }}>
              <b>Антидогматический оккультизм.</b> Без пыли и ванили.
              Практика. Осознанность. Технология Воли.
            </p>
            <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Tag>▸ личный опыт</Tag>
              <Tag>▸ ритуалы с контекстом</Tag>
              <Tag>▸ в ногу со временем</Tag>
            </div>
          </div>
          <div className="lr-hero-fade" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', minWidth: 260, animationDelay: '1s' }}>
            <Btn variant="blood" href="https://telegram.me/levorules">Читать канал →</Btn>
            <Btn variant="ghostAccent" accent="var(--purple)" href="/servitors/" onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('lr:route', { detail: 'servitors' }));
            }}>
              Бесплатный курс
            </Btn>
          </div>
        </div>
      </div>
      {typeof Marquee !== 'undefined' && <Marquee items={HERO_MARQUEE} />}
    </section>
  );
}

// Territories (three directions)
function Territories() {
  const items = [
    { n: '01', title: 'МАГИЯ ХАОСА', body: 'Сигилы, ритуалы, деконструкция догм. Вера как инструмент, не костыль.', accent: 'var(--blood-text)' },
    { n: '02', title: 'ДЕМОНОЛОГИЯ', body: 'Работа с инфернальными сущностями. Азазель, Люцифер, Белиал. Без страха и поклонения.', accent: 'var(--purple)' },
    { n: '03', title: 'ПУТЬ ЛЕВОЙ РУКИ', body: 'Самообожествление, Чёрное Пламя, индивидуация. Ты и есть бог.', accent: 'var(--amber)' },
  ];
  return (
    <section id="territories" data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <SectionTitle eyebrow="три направления практики" title="ТЕРРИТОРИИ" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', perspective: 1200 }}>
          {items.map(c => (
            <div
              key={c.n}
              className="lr-reactive-card"
              style={{
                '--lr-interaction-accent': c.accent,
                background: 'var(--ash)', padding: 32, minHeight: 240, position: 'relative', overflow: 'hidden',
              }}
            >
              <div aria-hidden="true" style={{
                position: 'absolute', right: -30, top: -30,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 180, lineHeight: 1,
                color: c.accent, opacity: 0.06, pointerEvents: 'none',
              }}>{c.n}</div>
              <div style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 11, color: c.accent, letterSpacing: '0.15em' }}>
                {c.n} / 03
              </div>
              <h3 style={{ position: 'relative', marginTop: 20, fontSize: 28 }}>{c.title}</h3>
              <p style={{ position: 'relative', marginTop: 16, color: 'var(--bone-dim)', lineHeight: 1.55 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Header, Hero, Territories });
