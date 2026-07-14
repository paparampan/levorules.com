// Header — sticky top nav with Ritual mode toggle
function Header({ ritual, setRitual, route, setRoute }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  React.useEffect(() => setMobileNavOpen(false), [route]);

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
      background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="lr-header-inner" style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <a className="lr-brand-link" href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--bone)' }}>
          <LRLogo size={30} color="blood" alt="" />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.005em', lineHeight: 1 }}>
            ЛЕВО&nbsp;РУЛЯ
          </div>
        </a>
        <button
          type="button"
          className="lr-nav-toggle"
          aria-expanded={mobileNavOpen}
          aria-controls="lr-primary-navigation"
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
              <a key={i.id} href={'#' + i.id}
                className="lr-nav-link"
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  if (i.hash) return;
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

// Hero
function Hero({ ritual }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
      <div style={{ position: 'absolute', right: -80, top: -60, pointerEvents: 'none' }}>
        <SigilTriad accent="var(--blood)" opacity={0.28} size={560} />
      </div>
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 80px' }}>
        <Eyebrow>канал · MMXXVI · ch. 2026-04</Eyebrow>
        <h1 className="lr-glitch-text" style={{
          fontSize: 'clamp(80px, 12vw, 180px)',
          margin: '28px 0 0', lineHeight: 0.85, letterSpacing: '-0.02em',
        }}>
          <span className={ritual ? 'glitch-rgb' : ''} data-text="ЛЕВО">ЛЕВО</span><br/>
          <span style={{ color: 'var(--blood-display)' }} className={ritual ? 'glitch-rgb' : ''} data-text="РУЛЯ">РУЛЯ</span>
        </h1>

        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'end' }}>
          <div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', minWidth: 260 }}>
            <Btn variant="blood" href="https://telegram.me/levorules">Читать канал →</Btn>
            <Btn variant="ghostAccent" accent="var(--purple)" href="#" onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('lr:route', { detail: 'servitors' }));
            }}>
              Сервиторы
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

// Territories (three directions)
function Territories() {
  const items = [
    { n: '01', title: 'МАГИЯ ХАОСА', body: 'Сигилы, ритуалы, деконструкция догм. Вера как инструмент, не костыль.' },
    { n: '02', title: 'ДЕМОНОЛОГИЯ', body: 'Работа с инфернальными сущностями. Азазель, Люцифер, Белиал. Без страха и поклонения.' },
    { n: '03', title: 'ПУТЬ ЛЕВОЙ РУКИ', body: 'Самообожествление, Чёрное Пламя, индивидуация. Ты и есть бог.' },
  ];
  return (
    <section id="territories" data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <SectionTitle eyebrow="три направления практики" title="ТЕРРИТОРИИ" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          {items.map(c => (
            <div
              key={c.n}
              className="lr-reactive-card"
              style={{
                '--lr-interaction-accent': 'var(--blood-text)',
                background: 'var(--ash)', padding: 32, minHeight: 240, position: 'relative',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blood-text)', letterSpacing: '0.15em' }}>
                {c.n} / 03
              </div>
              <h3 style={{ marginTop: 20, fontSize: 28 }}>{c.title}</h3>
              <p style={{ marginTop: 16, color: 'var(--bone-dim)', lineHeight: 1.55 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Header, Hero, Territories });
