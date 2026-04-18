// Course Callout Band — purple invitation to servitor course
function CourseCallout({ setRoute }) {
  // Pull real course modules from the global injected by _servitors-content-loader.
  // Fallback list is used only if the loader hasn't merged yet.
  const live = (typeof window !== 'undefined' ? window.SERVITORS_MODULES : null) || [];
  const modules = live.length
    ? live.map(m => ({ n: m.n, title: (m.title || '').toLowerCase() }))
    : [
        { n: '00', title: 'введение и карта курса' },
        { n: '01', title: 'теоретические основания и история' },
        { n: '02', title: 'типология сервиторов' },
        { n: '03', title: 'подготовка практика' },
        { n: '04', title: 'создание сервитора' },
        { n: '05', title: 'жизнь сервитора' },
        { n: '06', title: 'продвинутые техники' },
        { n: '07', title: 'завершение: уничтожение, отпуск' },
        { n: '08', title: 'кейсы и типичные ошибки' },
        { n: '09', title: 'психологическая и онтологическая рамка' },
        { n: '10', title: 'мастерство и интеграция' },
      ];
  const total = String(modules.length).padStart(2, '0');
  return (
    <section id="servitors-callout" style={{
      position: 'relative', overflow: 'hidden',
      borderLeft: '4px solid var(--purple)',
      background: 'var(--ash-2)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ position: 'absolute', right: -120, top: -60, pointerEvents: 'none' }}>
        <SigilServitor accent="var(--purple)" opacity={0.22} size={520} />
      </div>
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <Eyebrow accent="var(--purple)">новое · бесплатно · 130 страниц</Eyebrow>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(44px, 6vw, 88px)', lineHeight: 0.9, margin: 0 }}>
              СЕРВИТОРЫ<br/>
              <span style={{ color: 'var(--purple)' }}>ОТКРЫТЫЙ</span><br/>
              КУРС.
            </h2>
            <p style={{ marginTop: 24, color: 'var(--bone)', fontSize: 17, lineHeight: 1.55, maxWidth: 460 }}>
              Курс для самостоятельной практики про работу с автономными сущностями,
              сконструированными под твою волю. Не для полных новичков.
            </p>
            <p style={{ marginTop: 14, color: 'var(--purple)', fontSize: 17, lineHeight: 1.55, maxWidth: 460,
              fontWeight: 700, letterSpacing: '0.01em' }}>
              И под твой страх и риск.
            </p>
            <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn variant="accent" accent="var(--purple)" onClick={() => setRoute('servitors')}>
                Открыть курс →
              </Btn>
              <Btn variant="ghostAccent" accent="var(--purple)" onClick={() => setRoute('servitors')}>
                Программа ↓
              </Btn>
            </div>
            <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-dim)', letterSpacing: '0.08em' }}>
              11 модулей · открытый доступ · без регистрации, оплаты и SMS
            </div>
          </div>
          <div style={{ border: '1px solid var(--purple)', padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--purple)',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em',
              color: 'var(--purple)', textTransform: 'uppercase',
              display: 'flex', justifyContent: 'space-between' }}>
              <span>▸ modules.log</span>
              <span>{total} / {total}</span>
            </div>
            {modules.map((m, i) => (
              <div
                key={m.n}
                onClick={() => setRoute('servitors')}
                style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr 36px',
                  padding: '12px 18px',
                  borderBottom: i < modules.length - 1 ? '1px dashed var(--border)' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--purple)', fontWeight: 700 }}>
                  {m.n}
                </span>
                <span style={{ color: 'var(--bone)', fontSize: 13.5, lineHeight: 1.35 }}>{m.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', textAlign: 'right' }}>
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Video Row — YouTube Shorts, auto-fetched from site/shorts.json
const SHORTS_FALLBACK = [
  { id: null, title: 'Почему 432 Гц — ложь', url: 'https://www.youtube.com/@levorules/shorts', thumb: null, views: '', acc: 'var(--magenta)' },
  { id: null, title: 'Сигилы за 6 шагов', url: 'https://www.youtube.com/@levorules/shorts', thumb: null, views: '', acc: 'var(--acid-green)' },
  { id: null, title: 'К чёрту Гоэтию', url: 'https://www.youtube.com/@levorules/shorts', thumb: null, views: '', acc: 'var(--purple)' },
  { id: null, title: '8 цветов магии', url: 'https://www.youtube.com/@levorules/shorts', thumb: null, views: '', acc: 'var(--amber)' },
  { id: null, title: 'Код Теслы 3·6·9', url: 'https://www.youtube.com/@levorules/shorts', thumb: null, views: '', acc: 'var(--cyber-cyan)' },
];

function VideoRow() {
  const [videos, setVideos] = React.useState(SHORTS_FALLBACK);

  React.useEffect(() => {
    fetch('site/shorts.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length) {
          setVideos(data.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="video" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Eyebrow>последние видео</Eyebrow>
            <h2 style={{ marginTop: 12, fontSize: 'clamp(32px, 4vw, 56px)' }}>ШОРТСЫ</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" href="https://www.youtube.com/@levorules/shorts" style={{ padding: '10px 16px', fontSize: 13 }}>
              YouTube ↗
            </Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {videos.map((v, i) => (
            <a key={v.id || i} href={v.url || '#'} target="_blank" rel="noopener"
               style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{
                aspectRatio: '9/16', background: 'var(--ash)',
                border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
              }}>
                {v.thumb ? (
                  <img src={v.thumb} alt={v.title} loading="lazy"
                       style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: '25%', left: '25%', width: '50%', opacity: 0.5 }} fill="none" stroke={v.acc} strokeWidth="0.8">
                    <circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="28"/>
                    <path d="M50 8 V92 M8 50 H92"/>
                  </svg>
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: v.thumb
                    ? 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0) 75%)'
                    : `radial-gradient(ellipse at 50% 40%, ${v.acc}22, transparent 60%)`,
                }} />
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                  color: v.acc, padding: '2px 6px', border: `1px solid ${v.acc}`,
                  background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(4px)',
                }}>YT</div>
                {v.views ? (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone)',
                    background: 'rgba(10,10,10,0.6)', padding: '2px 6px',
                  }}>{v.views}</div>
                ) : null}
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14,
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                  textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.05,
                  textShadow: v.thumb ? '0 2px 8px rgba(0,0,0,0.9)' : 'none',
                  display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3,
                  overflow: 'hidden',
                }}>{v.title}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Telegram Posts Row — auto-fetched from site/telegram.json
const TELEGRAM_FALLBACK = [
  { id: 0, url: 'https://t.me/levorules', title: '8 ЦВЕТОВ МАГИИ', body: 'Таксономия, которую используют практики. Как определить свой доминантный и не закиснуть в одном канале на десятилетие.', photo: null, date: '', views: '', acc: 'var(--cyber-cyan)' },
  { id: 0, url: 'https://t.me/levorules', title: 'ПОЧЕМУ 432 ГЦ — ЛОЖЬ', body: 'Откуда взялась цифра, кто на ней заработал, и что на самом деле слышит ухо. Без эзотерического душа.', photo: null, date: '', views: '', acc: 'var(--magenta)' },
];

function formatTelegramDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function TelegramPosts() {
  const [posts, setPosts] = React.useState(TELEGRAM_FALLBACK);

  React.useEffect(() => {
    fetch('site/telegram.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length) {
          setPosts(data.items.slice(0, 2));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="content" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <SectionTitle eyebrow="на канале" title="ПОСЛЕДНИЕ ПОСТЫ" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {posts.map((p, i) => (
            <a key={p.id || i} href={p.url || 'https://t.me/levorules'} target="_blank" rel="noopener"
               style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <article style={{ border: '1px solid var(--border)', background: 'var(--ash)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                <div style={{ height: 180, position: 'relative', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                  {p.photo ? (
                    <img src={p.photo} alt="" loading="lazy"
                         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                  <div style={{ position: 'absolute', inset: 0, background: p.photo
                    ? `linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.75) 100%)`
                    : `radial-gradient(ellipse at 70% 40%, ${p.acc}33, transparent 60%)` }} />
                  {!p.photo && (
                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', right: -20, top: '10%', width: 260, opacity: 0.5 }} fill="none" stroke={p.acc} strokeWidth="0.6">
                      <circle cx="50" cy="50" r="48"/><circle cx="50" cy="50" r="34"/>
                      <path d="M50 2 V98 M15 15 L85 85 M85 15 L15 85"/>
                    </svg>
                  )}
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: p.acc, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>▸ Telegram</span>
                    {p.views ? <span style={{ color: 'var(--bone-dim)' }}>{p.views}</span> : null}
                  </div>
                  <h3 style={{ marginTop: 16, fontSize: 26, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{p.title}</h3>
                  {p.body ? (
                    <p style={{ marginTop: 14, color: 'var(--bone-dim)', lineHeight: 1.55 }}>{p.body}</p>
                  ) : null}
                  <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)' }}>{formatTelegramDate(p.date)}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone)',
                      textTransform: 'uppercase', letterSpacing: '0.1em' }}>читать →</span>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Btn href="https://t.me/levorules">Читать всё на канале →</Btn>
        </div>
      </div>
    </section>
  );
}

// Manifesto Band — blood full-bleed
function ManifestoBand() {
  return (
    <section style={{ background: 'var(--blood)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em', opacity: 0.7, textTransform: 'uppercase' }}>
          ▸ манифест
        </div>
        <div className="lr-glitch-text" style={{ marginTop: 20, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(48px, 8vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          НИЧТО НЕ ИСТИННО.<br/><span style={{ color: 'var(--purple)' }}>ВСЁ ДОЗВОЛЕНО.</span>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer style={{ background: 'var(--ash-2)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LRLogo size={32} color="bone" />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>ЛЕВО РУЛЯ</div>
            </div>
            <p style={{ marginTop: 18, color: 'var(--bone-dim)', maxWidth: 320 }}>
              Здесь разбирают реальность на запчасти и собирают обратно — по своим чертежам.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--bone-dim)', textTransform: 'uppercase', marginBottom: 14 }}>▸ разделы</div>
            {[
              ['Главная', '#'], ['Сервиторы', '#servitors'],
              ['Видео', '#video'], ['Telegram', 'https://t.me/levorules'],
            ].map(([l, h]) => (
              <a key={l} href={h} style={{ display: 'block', padding: '6px 0', color: 'var(--bone)', textDecoration: 'none', fontSize: 14 }}>{l} →</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--bone-dim)', textTransform: 'uppercase', marginBottom: 14 }}>▸ связь</div>
            {[
              ['Telegram', 'https://t.me/levorules'],
              ['YouTube', 'https://www.youtube.com/@levorules'],
              ['TikTok', 'https://www.tiktok.com/@levorules'],
              ].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener" style={{ display: 'block', padding: '6px 0', color: 'var(--bone)', textDecoration: 'none', fontSize: 14 }}>{l} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>
          <span>© ЛЕВО РУЛЯ · MMXXVI · Fac ut ardeat</span>
          <span>ᛏ</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { CourseCallout, VideoRow, TelegramPosts, ManifestoBand, Footer });
