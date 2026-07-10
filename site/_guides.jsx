// Guides — landing + individual guide pages.
// First guide: «Базовые техники защиты». Hash routes:
//   #guides                       → landing
//   #guides/defense-basics        → guide

const GUIDES_ACCENT = 'var(--acid-green)';

const GUIDES_INDEX = [
  {
    slug: 'defense-basics',
    eyebrow: 'Протокол',
    title: 'Базовые техники защиты',
    titleAccent: 'защиты',
    intro: 'Защита — не стена и не амулет. Режим работы сознания: индексация входящего потока, удержание оси, разрыв связей, заземление в материи.',
    tags: ['База', 'Теория', 'Практика', 'ПЛР'],
    date: '02.05.2026',
    version: 'v.1',
    available: true,
  },
];

// ----------- LANDING ----------
function GuidesLanding({ setRoute }) {
  return (
    <div>
      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: `2px solid ${GUIDES_ACCENT}`,
        background: 'linear-gradient(180deg, var(--void) 0%, #061205 100%)',
      }}>
        <div style={{ position: 'absolute', right: -100, top: -40, pointerEvents: 'none' }}>
          <SigilTriad accent={GUIDES_ACCENT} opacity={0.18} size={580} />
        </div>
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
              ← ЛЕВО РУЛЯ
            </a>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: GUIDES_ACCENT }}>
              гайды
            </span>
          </div>
          <Eyebrow accent={GUIDES_ACCENT}>протоколы и разборы · растущая библиотека</Eyebrow>

          <h1 className="lr-glitch-text" style={{ marginTop: 28, fontSize: 'clamp(72px, 11vw, 180px)', lineHeight: 0.85, letterSpacing: '-0.02em' }}>
            ГАЙ<span style={{ color: GUIDES_ACCENT }}>ДЫ.</span>
          </h1>
          <p style={{ marginTop: 28, fontSize: 20, lineHeight: 1.5, color: 'var(--bone)', maxWidth: 720 }}>
            Конспекты, протоколы и техники для практиков. Без воды, без догм,
            с источниками. Каждый текст — самодостаточный фрагмент дисциплины.
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Tag accent={GUIDES_ACCENT}>▸ практика</Tag>
            <Tag accent={GUIDES_ACCENT}>▸ короткие протоколы</Tag>
            <Tag accent={GUIDES_ACCENT}>▸ открытый доступ</Tag>
          </div>
        </div>
      </section>

      {/* INDEX */}
      <section data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
            <SectionTitle eyebrow="индекс" title="БИБЛИОТЕКА" accent={GUIDES_ACCENT} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>
              {String(GUIDES_INDEX.length).padStart(2, '0')} / ∞
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {GUIDES_INDEX.map((g, i) => (
              <GuideCard key={g.slug} guide={g} idx={i} setRoute={setRoute} />
            ))}
          </div>

          <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-dim)', letterSpacing: '0.08em' }}>
            ▸ Новые гайды добавляются по мере появления. Подписка на канал —{' '}
            <a href="https://t.me/levorules" target="_blank" rel="noopener" style={{ color: GUIDES_ACCENT, textUnderlineOffset: 2 }}>
              t.me/levorules
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuideCard({ guide, idx, setRoute }) {
  const [hover, setHover] = React.useState(false);
  const open = () => {
    try { localStorage.setItem('lr_guide_slug', guide.slug); } catch {}
    setRoute('guide', null, guide.slug);
  };
  return (
    <a
      className="lr-reactive-row"
      href={guide.available ? `#guides/${guide.slug}` : undefined}
      aria-disabled={!guide.available ? 'true' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        if (!guide.available) return;
        e.preventDefault();
        open();
      }}
      style={{
        '--lr-interaction-accent': GUIDES_ACCENT,
        all: 'unset', boxSizing: 'border-box', width: '100%', textAlign: 'left',
        background: hover && guide.available ? 'var(--ash-2)' : 'var(--void)',
        padding: '32px 32px',
        cursor: guide.available ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 28, alignItems: 'center',
        transition: 'background .15s ease, transform .18s ease',
      }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: GUIDES_ACCENT, letterSpacing: '0.1em' }}>
        [{String(idx + 1).padStart(2, '0')}]
      </div>
      <div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--bone-dim)' }}>
          <span style={{ color: GUIDES_ACCENT }}>▸ {guide.eyebrow}</span>
          <span>·</span>
          <span>{guide.date}</span>
          <span>·</span>
          <span>{guide.version}</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.005em',
          fontSize: 28, lineHeight: 1.05, color: 'var(--bone)', marginBottom: 12,
        }}>
          {guide.title}
        </div>
        <div style={{ color: 'var(--bone-dim)', fontSize: 15, lineHeight: 1.55, maxWidth: 720, marginBottom: 14 }}>
          {guide.intro}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {guide.tags.map(t => <Tag key={t} accent={GUIDES_ACCENT}>▸ {t}</Tag>)}
        </div>
      </div>
      <span
        className="lr-reactive-arrow"
        aria-hidden="true"
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: guide.available ? GUIDES_ACCENT : 'var(--bone-dim)',
          border: `1px solid ${guide.available ? GUIDES_ACCENT : 'var(--border-strong)'}`,
          padding: '10px 16px', cursor: guide.available ? 'pointer' : 'not-allowed',
          background: hover && guide.available ? GUIDES_ACCENT : 'transparent',
          transition: 'background .15s ease, color .15s ease, transform .18s ease',
        }}
      >
        <span style={{ color: hover && guide.available ? 'var(--void)' : undefined }}>
          {guide.available ? 'Читать →' : 'Скоро'}
        </span>
      </span>
    </a>
  );
}

// ----------- GUIDE ROUTER ----------
function GuidePage({ slug, setRoute }) {
  if (slug === 'defense-basics') return <GuideDefenseBasics setRoute={setRoute} />;
  // Unknown slug — fall back to landing.
  return <GuidesLanding setRoute={setRoute} />;
}

// ----------- GUIDE: BASIC DEFENCE ----------
function GuideDefenseBasics({ setRoute }) {
  return (
    <article>
      <GuideBreadcrumb setRoute={setRoute} title="базовые техники защиты" />
      <DefenceHero />
      <DefenceTLDR />
      <DefenceShattering />
      <DefenceIndications />
      <DefenceParadigmBlock />
      <DefenceVibration />
      <DefenceDeathPosture />
      <DefenceSigilPractice />
      <DefenceRitualFragment />
      <DefenceChecklist />
      <DefenceFalseDefence />
      <DefenceClosing />
      <GuideFooterNav setRoute={setRoute} />
    </article>
  );
}

function GuideBreadcrumb({ setRoute, title }) {
  const linkStyle = { color: 'var(--bone-dim)', textDecoration: 'none' };
  return (
    <div style={{
      maxWidth: 1280, margin: '0 auto',
      padding: '24px 32px 0',
      fontFamily: 'var(--font-mono)', fontSize: 12,
      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--bone-dim)',
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }} style={linkStyle}>главная</a>
      <span style={{ margin: '0 10px', color: GUIDES_ACCENT }}>▸</span>
      <a href="#guides" onClick={(e) => { e.preventDefault(); setRoute('guides'); }} style={linkStyle}>гайды</a>
      <span style={{ margin: '0 10px', color: GUIDES_ACCENT }}>▸</span>
      <span style={{ color: 'var(--bone)' }}>{title}</span>
    </div>
  );
}

function GuideFooterNav({ setRoute }) {
  return (
    <section style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Btn variant="ghost" onClick={() => setRoute('guides')}>← К списку гайдов</Btn>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>
          guide · defense-basics · v.1
        </div>
      </div>
    </section>
  );
}

function GuideTag({ kind = 'neutral', children }) {
  const colors = {
    blood: 'var(--blood-text)', acid: 'var(--acid-green)', cyan: 'var(--cyber-cyan)',
    magenta: 'var(--magenta)', amber: 'var(--amber)', purple: 'var(--purple)',
    neutral: 'var(--bone-dim)',
  };
  return <Tag accent={colors[kind]}>{children}</Tag>;
}

// ----------- HERO ----------
function DefenceHero() {
  return (
    <section className="scanlines" style={{
      position: 'relative', overflow: 'hidden',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 72px' }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--blood-text)' }}>▸ Протокол</span>
          <span style={{ color: 'var(--bone-dim)' }}>·</span>
          <span style={{ color: 'var(--bone-dim)' }}>02.05.2026</span>
          <span style={{ color: 'var(--bone-dim)' }}>·</span>
          <span style={{ color: 'var(--bone-dim)' }}>v.1</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          lineHeight: 0.88, fontSize: 'clamp(56px, 8vw, 120px)',
          margin: 0, color: 'var(--bone)',
        }}>
          Базовые<br/>техники <span style={{ color: 'var(--blood-display)' }}>защиты</span>
        </h1>
        <p style={{
          marginTop: 36, fontSize: 20, lineHeight: 1.5, color: 'var(--bone)', maxWidth: 760,
        }}>
          Защита — не стена и не амулет. Это <em style={{ fontStyle: 'italic', color: 'var(--bone)' }}>режим работы сознания</em>:
          индексация входящего потока, удержание оси, разрыв связей, заземление в материи.
          Ниже — две рабочие парадигмы и протоколы, которые ими пользуются.
        </p>
        <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <GuideTag kind="blood">▸ База</GuideTag>
          <GuideTag kind="cyan">▸ Теория</GuideTag>
          <GuideTag kind="acid">▸ Практика</GuideTag>
          <GuideTag kind="purple">▸ ПЛР</GuideTag>
        </div>
      </div>
    </section>
  );
}

// ----------- TL;DR ----------
function DefenceTLDR() {
  const items = [
    { n: '01', t: 'Защита — это структура, а не щит',
      d: 'Хаотичный поток превращается в осмысленный сигнал, когда сознание имеет «картотеку» — Древо, систему координат, мета-веру. Без неё любой опыт будет разрушительным.' },
    { n: '02', t: 'Один акцент на ситуацию',
      d: 'Не намазывай все техники сразу. Каббалистическая ось — для работы со Сефирот и психоделическим опытом. Хаос-инструменты — против атак, эгрегоров и петель сомнения.' },
    { n: '03', t: 'Заземление обязательно',
      d: 'Если после практики ты не способен решить мирские дела, защита была фиктивной. Пища, движение, секулярные задачи — это не «выход из магии», это её половина.' },
    { n: '04', t: 'Магическая паранойя — это атака на самого себя',
      d: 'Вера в нападение создает нападение. Чрезмерное экранирование плодит связи, которые перегружают «Я». Минимум техник, максимум осознанности.' },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Tl;dr · 4 тезиса</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 48 }}>
          Если читать нечего — <span style={{ color: 'var(--blood-display)' }}>читай это</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          {items.map(it => (
            <div key={it.n} style={{ background: 'var(--void)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--blood-text)', letterSpacing: '0.1em', marginBottom: 16 }}>
                [{it.n}]
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '-0.01em',
                fontSize: 22, lineHeight: 1.05, color: 'var(--bone)', marginBottom: 14,
              }}>{it.t}</div>
              <div style={{ color: 'var(--bone-dim)', fontSize: 15, lineHeight: 1.55 }}>{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------- WHAT BREAKS WITHOUT DEFENCE ----------
function DefenceShattering() {
  const anchors = [
    { n: '01', t: 'Высшая Энергия', q: 'Какова сила, движущая вселенной? (Айн Соф / квантовая основа)' },
    { n: '02', t: 'Жизнь', q: 'Что такое жизнь, где её начало и цель?' },
    { n: '03', t: 'Судьба человека', q: 'Откуда пришёл человек и куда он идёт?' },
    { n: '04', t: 'Эго', q: 'Кто я и каково моё место в Плане?' },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: 'var(--cyber-cyan)', marginBottom: 18 }}>Контекст · до того, как начать</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 24 }}>
          Что ломается <span style={{ color: 'var(--cyber-cyan)' }}>без защиты</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 56 }}>
          Защита — не паранойя, а ответ на конкретные механизмы распада. Если ты не знаешь, ЧТО именно угрожает структуре «Я», техники превращаются в ритуальный театр.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--cyber-cyan)', background: 'var(--ash-2)', padding: '32px 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyber-cyan)', marginBottom: 16 }}>
              ▸ Цари Эдома
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '-0.005em',
              fontSize: 22, lineHeight: 1.05, color: 'var(--bone)', marginBottom: 14,
            }}>Эго-шаттеринг</div>
            <p style={{ color: 'var(--bone)', fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>
              В моменты прорыва (Тиферет, психоделик, плотный ритуал) нервная система наводняется данными быстрее, чем мозг успевает их интерпретировать. Это столкновение с <span style={{ color: 'var(--cyber-cyan)' }}>Царями Эдома</span> — досимволическими импульсами клеточного уровня, существовавшими до установления Равновесия.
            </p>
            <p style={{ color: 'var(--bone-dim)', fontSize: 14.5, lineHeight: 1.55, marginBottom: 14 }}>
              Без жёсткой структуры (Древо, мета-вера, картотека) Цари захватывают сознание. Возникает <em style={{ fontStyle: 'italic', color: 'var(--bone)' }}>эго-шаттеринг</em> — разрушение «Я». Без защиты опыт превращается в психотический эпизод. С защитой — то же разрушение воспринимается как освобождение, точка сборки удерживается в Срединном Столпе.
            </p>
            <div style={{ marginTop: 18, padding: '14px 18px', border: '1px solid var(--border)', background: 'var(--void)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-dim)', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              ▸ <span style={{ color: 'var(--cyber-cyan)' }}>Маркер</span>: чем сильнее опыт, тем нужнее предзаданная классификация. Хаос ≠ разрушение, если есть рамка.
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--amber)', background: 'var(--ash-2)', padding: '32px 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 16 }}>
              ▸ Якоря Лири
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '-0.005em',
              fontSize: 22, lineHeight: 1.05, color: 'var(--bone)', marginBottom: 14,
            }}>Четыре ментальных опоры</div>
            <p style={{ color: 'var(--bone-dim)', fontSize: 14.5, lineHeight: 1.55, marginBottom: 22 }}>
              Тимоти Лири постулировал: устойчивость при встрече с Непроявленным держится на ответах на четыре вопроса. Без них — онтологический шок.
              Ответ должен быть <span style={{ color: 'var(--bone)' }}>твоим</span>, а не цитатой. Записать до начала любой плотной практики.
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {anchors.map((a) => (
                <li key={a.n} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: '0.1em', flexShrink: 0 }}>[{a.n}]</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 700, fontSize: 15, color: 'var(--bone)', marginBottom: 4 }}>{a.t}</div>
                    <div style={{ color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.5 }}>{a.q}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------- WHEN / WHEN NOT ----------
function DefenceIndications() {
  const yes = [
    { t: 'Работа с архетипами Сефирот', d: 'Предотвращает захват сознания односторонней силой.' },
    { t: 'Психоделический опыт', d: 'Формирует структуру для лавины сигналов.' },
    { t: 'Ритуалы и направленная воля', d: 'Концентрация жизненной силы требует центрирования.' },
    { t: 'Психические атаки и вампиризм', d: 'Прерывает несанкционированный отток.' },
    { t: 'Деструктивные эгрегоры', d: 'Фильтрует давление крупных информационных полей.' },
    { t: 'Внутренние петли (сомнение/страх)', d: 'Без работы с ними внешние щиты бесполезны.' },
  ];
  const no = [
    { t: 'Уход от мирских проблем', d: 'Магия не заменяет психотерапию, врачей и переговоры. Это дилетантизм.' },
    { t: 'Физические угрозы', d: 'Требуются рациональные малкутианские действия. Магия только введёт в заблуждение.' },
    { t: 'Эпатаж и демонстрация', d: 'Истинная сила не нуждается в рекламе. Это признак Клипот.' },
    { t: 'Материальные ошибки', d: 'Магия не заменяет компетентность. Учись делу, а не заклинаниям.' },
    { t: 'Постоянное «фоновое» экранирование', d: 'Магическая паранойя — самосбывающееся пророчество.' },
    { t: 'Кормление чужого внимания', d: 'Каждое вмешательство — связь. Связи = поверхность для атаки.' },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Сфера применения</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 48 }}>
          Когда защита <span style={{ color: 'var(--acid-green)' }}>работает</span>,
          <br/>а когда <span style={{ color: 'var(--magenta)' }}>вредна</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <IndicationsColumn label="Применять" accent="var(--acid-green)" items={yes} />
          <IndicationsColumn label="Не применять" accent="var(--magenta)" items={no} />
        </div>
      </div>
    </section>
  );
}

function IndicationsColumn({ label, accent, items }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`, background: 'var(--ash-2)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>
          ▸ {label}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.08em' }}>
          {String(items.length).padStart(2, '0')} случаев
        </div>
      </div>
      {items.map((x, i) => (
        <div key={i} style={{ padding: '18px 24px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{String(i+1).padStart(2,'0')}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 700, fontSize: 17, letterSpacing: '-0.005em', color: 'var(--bone)', marginBottom: 4 }}>{x.t}</div>
              <div style={{ color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.5 }}>{x.d}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------- PARADIGM BLOCK ----------
function DefenceParadigmBlock() {
  const [active, setActive] = React.useState('pillar');
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px 72px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Две парадигмы · одна задача</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1200, marginBottom: 28 }}>
          Выбери <span style={{ color: 'var(--blood-display)' }}>систему координат</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 48 }}>
          Не «Каббала vs Хаос» — это разные инструменты под разные задачи. Структурный путь Сефирот даёт ось, на которой можно стоять. Хаос даёт способ исчезнуть из-под удара. Оба работают. Не комбинируй в одном сеансе.
        </p>

        <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '1px solid var(--border)' }}>
          <ParadigmTab
            active={active === 'pillar'} accent="var(--cyber-cyan)"
            n="01" title="Срединный Столп" subtitle="Структура · Каббала · Нейропсихология"
            onClick={() => setActive('pillar')}
          />
          <ParadigmTab
            active={active === 'kia'} accent="var(--purple)"
            n="02" title="Kia & Поза Смерти" subtitle="Растворение · Магия Хаоса"
            onClick={() => setActive('kia')}
          />
        </div>

        {active === 'pillar' ? <PillarPath /> : <KiaPath />}
      </div>
    </section>
  );
}

function ParadigmTab({ active, accent, n, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '24px 28px', textAlign: 'left', cursor: 'pointer',
      background: active ? 'var(--ash-2)' : 'transparent',
      border: 'none',
      borderTop: active ? `2px solid ${accent}` : '2px solid transparent',
      borderLeft: '1px solid var(--border)',
      borderRight: '1px solid var(--border)',
      color: 'inherit', fontFamily: 'inherit',
      transition: 'background .15s ease',
      position: 'relative', marginBottom: -1,
    }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', color: active ? accent : 'var(--bone-dim)' }}>[{n}]</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-0.01em',
            fontSize: 24, lineHeight: 1, color: active ? 'var(--bone)' : 'var(--bone-dim)',
            marginBottom: 6,
          }}>{title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? accent : 'var(--bone-dim)' }}>
            {subtitle}
          </div>
        </div>
      </div>
    </button>
  );
}

function PillarPath() {
  return (
    <div style={{ background: 'var(--ash-2)', border: '1px solid var(--border)', borderTop: 'none', padding: '48px 32px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }}>
        <PillarDiagram />
        <div>
          <div className="eyebrow" style={{ color: 'var(--cyber-cyan)', marginBottom: 14 }}>
            <span style={{ color: 'var(--cyber-cyan)' }}>Принцип</span>
          </div>
          <h3 style={{ fontSize: 32, marginBottom: 18, color: 'var(--bone)' }}>
            Защита как <span style={{ color: 'var(--cyber-cyan)' }}>индексация</span>
          </h3>
          <p style={{ color: 'var(--bone)', fontSize: 17, lineHeight: 1.6, marginBottom: 16, maxWidth: 760 }}>
            Когда сознание структурировано по сефирам, любой входящий сигнал автоматически индексируется. «Небалансированная сила» классифицируется и фильтруется, не превращаясь в деструктивный шум. Стабильность держится на оси <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>Кетер → Тиферет → Малкут</span>.
          </p>
          <p style={{ color: 'var(--bone-dim)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            Источники: Дион Форчун — «Мистическая Каббала», Тимоти Лири — теория биохимического ритуала.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GuideTag kind="cyan">▸ Хесед / Гебура</GuideTag>
            <GuideTag kind="cyan">▸ Срединный Столп</GuideTag>
            <GuideTag kind="cyan">▸ Цари Эдома</GuideTag>
            <GuideTag kind="cyan">▸ Парокет</GuideTag>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '56px 0 40px' }}></div>

      <PhaseRow accent="var(--cyber-cyan)" phases={[
        {
          n: '01', label: 'До', title: 'Set & Setting',
          body: 'Установка — отсутствие Клипот: страх и гнев это шум в цепях. Окружение — символически консистентное: внешняя опора держит внутреннюю структуру.',
          steps: [
            'Зафиксировать ментальное состояние: что несбалансировано прямо сейчас.',
            'Очистить пространство: один свет, один объект внимания, тишина.',
            'Сформулировать намерение одной строкой. Без эпитетов.',
          ],
        },
        {
          n: '02', label: 'Во время', title: 'Удержание оси',
          body: 'Управление «скоростью света» в нейронном компьютере. Наблюдение за Вспышкой Молнии без панического торможения и без перегорания. Отпускать тормоза ровно настолько, насколько картотека успевает индексировать поток.',
          steps: [
            'Активировать Срединный Столп',
            'На уровне Тиферет установить Парокет — фильтр между обыденным и высшей Триадой.',
            'Не цепляться за переживание; пропускать через ось, не через эго.',
          ],
        },
        {
          n: '03', label: 'После', title: 'Заземление в Малкут',
          body: 'Опыт интегрируется через возвращение в плотную материю. Критерий успешной защиты — способность вернуться к секулярным играм без потери инсайта.',
          steps: [
            'Записать опыт нейтральным языком, без поэзии.',
            'Сделать что-то ручное: еда, вода, прогулка, физическая работа.',
            'Через 24 часа перечитать запись и проверить: применимо ли к жизни.',
          ],
        },
      ]} />
    </div>
  );
}

function PillarDiagram() {
  const cyan = 'var(--cyber-cyan)';
  return (
    <div style={{ position: 'relative', aspectRatio: '3/4', border: '1px solid var(--border)', background: 'var(--void)', padding: 24 }}>
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)', textTransform: 'uppercase' }}>fig. 01 — срединный столп</div>
      <div style={{ position: 'absolute', top: 14, right: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: cyan }}>▸ active</div>
      <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%' }} fill="none">
        <defs>
          <filter id="g1-pillar" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>
        <line x1="50" y1="40" x2="50" y2="240" stroke="#2A2A2A" strokeWidth="0.5"/>
        <line x1="150" y1="40" x2="150" y2="240" stroke="#2A2A2A" strokeWidth="0.5"/>
        {[
          [50, 70], [150, 70], [50, 130], [150, 130], [50, 195], [150, 195],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="11" stroke="#3D3D3D" strokeWidth="0.7" fill="var(--void)"/>
        ))}
        <line x1="100" y1="40" x2="100" y2="260" stroke={cyan} strokeWidth="0.8" opacity="0.6"/>
        <circle cx="100" cy="40" r="12" stroke={cyan} fill="var(--void)" strokeWidth="1.2" filter="url(#g1-pillar)" opacity="0.6"/>
        <circle cx="100" cy="40" r="12" stroke={cyan} fill="var(--void)" strokeWidth="1.2"/>
        <circle cx="100" cy="98" r="8"  stroke={cyan} fill="var(--void)" strokeWidth="0.8" strokeDasharray="2 2"/>
        <circle cx="100" cy="155" r="14" stroke={cyan} fill="var(--void)" strokeWidth="1.2" filter="url(#g1-pillar)" opacity="0.6"/>
        <circle cx="100" cy="155" r="14" stroke={cyan} fill="var(--void)" strokeWidth="1.2"/>
        <circle cx="100" cy="215" r="10" stroke={cyan} fill="var(--void)" strokeWidth="1"/>
        <circle cx="100" cy="260" r="12" stroke={cyan} fill="var(--void)" strokeWidth="1.2" filter="url(#g1-pillar)" opacity="0.6"/>
        <circle cx="100" cy="260" r="12" stroke={cyan} fill="var(--void)" strokeWidth="1.2"/>
        <text x="118" y="44" fill={cyan} fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="0.5">КЕТЕР</text>
        <text x="115" y="100" fill="var(--bone-dim)" fontFamily="Space Mono, monospace" fontSize="6.5">даат</text>
        <text x="120" y="159" fill={cyan} fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="0.5">ТИФЕРЕТ</text>
        <text x="116" y="219" fill="var(--bone-dim)" fontFamily="Space Mono, monospace" fontSize="6.5">йесод</text>
        <text x="118" y="264" fill={cyan} fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="0.5">МАЛКУТ</text>
      </svg>
      <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)' }}>
        <span>parokhet @ tiferet</span>
        <span>↓ malkut</span>
      </div>
    </div>
  );
}

function KiaPath() {
  return (
    <div style={{ background: 'var(--ash-2)', border: '1px solid var(--border)', borderTop: 'none', padding: '48px 32px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }}>
        <KiaDiagram />
        <div>
          <div className="eyebrow" style={{ color: 'var(--purple)', marginBottom: 14 }}>
            <span style={{ color: 'var(--purple)' }}>Принцип</span>
          </div>
          <h3 style={{ fontSize: 32, marginBottom: 18, color: 'var(--bone)' }}>
            Защита как <span style={{ color: 'var(--purple)' }}>прозрачность</span>
          </h3>
          <p style={{ color: 'var(--bone)', fontSize: 17, lineHeight: 1.6, marginBottom: 16, maxWidth: 760 }}>
            Любая магическая агрессия направлена на Эго: на твои страхи, привычки, самоидентификацию. Маг Хаоса защищается, делая Эго прозрачным — растворяя его в Kia. Состояние, у которого нет характеристик, не имеет точек захвата. Атака проходит сквозь.
          </p>
          <p style={{ color: 'var(--bone-dim)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            Источники: Остин Осман Спейр — «Книга Удовольствий», Питер Кэрролл — Liber Null & Psychonaut, IOT.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GuideTag kind="purple">▸ Kia / Ego</GuideTag>
            <GuideTag kind="purple">▸ Neither-Neither</GuideTag>
            <GuideTag kind="purple">▸ Поза Смерти</GuideTag>
            <GuideTag kind="purple">▸ Mass H</GuideTag>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '56px 0 40px' }}></div>

      <PhaseRow accent="var(--purple)" phases={[
        {
          n: '01', label: 'До', title: 'Глаз / Silent Watcher',
          body: 'Защита начинается с позиции беспристрастного наблюдателя. Эго неподвижно, разум осуществляет молниеносную ассимиляцию реальности и ловит аномалии в поле вероятностей раньше, чем они станут событием.',
          steps: [
            'Заметить сигнал: внезапный «вакуум», истощение, чужой эмоциональный фон.',
            'Не реагировать сразу. Перейти в позицию наблюдателя — отделить «я» от ощущения.',
            'Идентифицировать: внешний источник или внутренняя петля сомнения.',
          ],
        },
        {
          n: '02', label: 'Во время', title: 'Гнозис как фильтр',
          body: 'Гнозис намеренно перегружает рассудочные функции — пока ratio занят однонаправленным импульсом (ярость, экстаз, смех, поза смерти), внешний деструктивный сигнал не интерпретируется внутренним цензором и не закрепляется в подсознании.',
          steps: [
            'Войти в гнозис: сильный однонаправленный импульс или поза смерти.',
            'Удерживать состояние «ни то, ни это» — отказ от роли «жертвы» и «нападающего».',
            'Не отвечать атакой. Аннигилировать дуальность — связь обрывается сама.',
          ],
        },
        {
          n: '03', label: 'После', title: 'Изгнание смехом',
          body: 'После нейтрализации связь надо разорвать физически. Смех — это акт самолюбования, разрывающий гравитацию ситуации. Атака обесценивается.',
          steps: [
            'Отсмеяться над ситуацией. Это технический приём, а не настроение.',
            'Сжечь избыток: еда, физическая нагрузка, секулярная задача с дедлайном.',
            'Не возвращаться мыслью. Каждый возврат — повторное создание связи.',
          ],
        },
      ]} />
    </div>
  );
}

function KiaDiagram() {
  const purple = 'var(--purple)';
  return (
    <div style={{ position: 'relative', aspectRatio: '3/4', border: '1px solid var(--border)', background: 'var(--void)', padding: 24 }}>
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)', textTransform: 'uppercase' }}>fig. 02 — kia / ego</div>
      <div style={{ position: 'absolute', top: 14, right: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: purple }}>▸ dissolve</div>
      <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%' }} fill="none">
        <circle cx="100" cy="140" r="115" stroke={purple} strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="2 4"/>
        <circle cx="100" cy="140" r="95"  stroke={purple} strokeOpacity="0.3" strokeWidth="0.6"/>
        <circle cx="100" cy="140" r="75"  stroke={purple} strokeOpacity="0.45" strokeWidth="0.7"/>
        <rect x="78" y="118" width="44" height="44" stroke={purple} strokeWidth="1.2" fill="var(--void)"/>
        <text x="100" y="143" textAnchor="middle" fill={purple} fontFamily="Oswald, sans-serif" fontSize="10" letterSpacing="0.5" fontWeight="700">EGO</text>
        <g stroke="var(--blood)" strokeWidth="0.7" opacity="0.8">
          <line x1="20" y1="60" x2="65" y2="115" markerEnd="url(#arr-kia)"/>
          <line x1="180" y1="80" x2="135" y2="120"/>
          <line x1="30" y1="220" x2="70" y2="170"/>
        </g>
        <defs>
          <marker id="arr-kia" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--blood)"/>
          </marker>
        </defs>
        <text x="100" y="40"  textAnchor="middle" fill={purple} fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="1">KIA</text>
        <text x="100" y="252" textAnchor="middle" fill="var(--bone-dim)" fontFamily="Space Mono, monospace" fontSize="6.5" letterSpacing="0.8">virgin quantum</text>
        <text x="100" y="103" textAnchor="middle" fill="var(--bone-dim)" fontFamily="Space Mono, monospace" fontSize="6.5">milk state</text>
      </svg>
      <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)' }}>
        <span>neither / nor</span>
        <span>↯ ego dissolve</span>
      </div>
    </div>
  );
}

function PhaseRow({ accent, phases }) {
  return (
    <div>
      <div className="eyebrow" style={{ color: accent, marginBottom: 28 }}>Протокол · ДО / ВО ВРЕМЯ / ПОСЛЕ</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
        {phases.map((p, i) => (
          <div key={i} style={{ background: 'var(--void)', padding: '32px 28px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', color: accent }}>[{p.n}]</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--bone-dim)', textTransform: 'uppercase' }}>{p.label}</div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '-0.01em',
              fontSize: 24, lineHeight: 1.05, color: 'var(--bone)', marginBottom: 14,
            }}>{p.title}</div>
            <div style={{ color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.55, marginBottom: 20 }}>{p.body}</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.steps.map((s, j) => (
                <li key={j} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: accent, letterSpacing: '0.05em', flexShrink: 0, paddingTop: 1 }}>
                    {String(j+1).padStart(2,'0')}
                  </span>
                  <span style={{ color: 'var(--bone)', fontSize: 14.5, lineHeight: 1.5 }}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------- VIBRATION (Pillar activation) ----------
// Структурный протокол активации Срединного Столпа — без обращения к авраамическим
// именам. Сферы используются как позиционные опоры, звук — как нейтральный тон,
// а не вызов сущности. Принцип: фокус внимания + резонанс, а не теургия.
function DefenceVibration() {
  const cyan = 'var(--cyber-cyan)';
  const phases = [
    {
      n: '01', label: 'Кетер', title: 'Высшая точка',
      body: 'Точка над макушкой. Сфера белого света размером с грейпфрут. Это корневая позиция наблюдателя — место, из которого ты смотришь, а не объект, к которому обращаешься.',
      steps: [
        'Закрыть глаза. Ровное дыхание носом, 4 счёта вдох / 4 выдох.',
        'Удерживать сферу над макушкой 5-7 дыханий. Не визуализируй усилием — просто отмечай её присутствие.',
        'Низкий тональный гул на «А» в нижнем регистре, 3-5 раз. Чувствуй вибрацию в черепе. Звук — носитель внимания, без слов.',
      ],
    },
    {
      n: '02', label: 'Тиферет + Парокет', title: 'Сердце · фильтр',
      body: 'Центр груди. Жёлто-золотая сфера. Здесь ставится Парокет — горизонтальная мембрана, отделяющая обыденное сознание от высшей Триады. Не блок — предохранитель: пропускает свет, гасит шум.',
      steps: [
        'Свет из Кетер опускается лучом по центральной оси в грудь.',
        'Тональный гул на «О», вибрация в грудине, 3 повтора. Если не один — вибрируй мысленно, эффект сохраняется на ~70%.',
        'Визуализируй горизонтальную мембрану на уровне сердца. Это Парокет: мысленно «закрепи» её одним выдохом.',
      ],
    },
    {
      n: '03', label: 'Малкут', title: 'Земля · заземление',
      body: 'Точка под стопами. Чёрно-зелёная сфера. Это возврат в плотную материю — критерий, по которому проверяется, что ты не «застрял в верхах».',
      steps: [
        'Луч света опускается через таз и ноги в землю под стопами.',
        'Глубокий гул на «У», вибрация в нижней челюсти и тазу, 3 повтора.',
        'Открыть глаза. Несколько секунд осмотреть комнату — ты вернулся. Записать одно предложение в дневник: что изменилось в теле / голове.',
      ],
    },
  ];
  return (
    <section style={{ background: 'var(--ash-2)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: cyan, marginBottom: 18 }}>Практика · столп</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 24 }}>
          Активация оси · <span style={{ color: cyan }}>тон и фокус</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 32 }}>
          Структурный протокол Срединного Столпа без апелляции к авраамическому эгрегору. Сферы — это позиционные опоры, звук — нейтральный носитель внимания, а не вызов сущности. Делай 1 раз в день в первые две недели, дальше — перед любой плотной работой и после неё.
        </p>

        <PhaseRow accent={cyan} phases={phases} />

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--void)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: cyan, textTransform: 'uppercase', marginBottom: 10 }}>▸ Звук</div>
            <div style={{ color: 'var(--bone)', fontSize: 14.5, lineHeight: 1.6 }}>
              Гул — не пение. Тяни гласную на одной ноте в нижнем регистре, грудью. Это инструмент удержания внимания через резонанс, а не «слово силы». Если шумно — вибрируй мысленно с тем же ощущением, эффект сохраняется на ~70%.
            </div>
          </div>
          <div style={{ padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--void)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--blood-text)', textTransform: 'uppercase', marginBottom: 10 }}>▸ Стоп-сигнал</div>
            <div style={{ color: 'var(--bone)', fontSize: 14.5, lineHeight: 1.6 }}>
              Если на любом этапе появилась тошнота, страх или ощущение «я растворяюсь без возврата» — немедленно открой глаза, выпей воды, выйди на улицу. Это перебор по интенсивности, а не «прорыв». Возвращайся к практике на следующий день в более лёгкой версии.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------- DEATH POSTURE ----------
function DefenceDeathPosture() {
  return (
    <section style={{ background: 'var(--ash-2)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: 'var(--magenta)', marginBottom: 18 }}>Техника · Поза Смерти</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 12 }}>
          Аннигиляция связи <span style={{ color: 'var(--magenta)' }}>через коллапс</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 56 }}>
          Фундаментальный метод Спейра. В момент физического коллапса или предельного расслабления сознание срывается в Бездну — внешние связи сгорают, вера в угрозу аннигилируется.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          <DeathStep n="01" title="Натяжение" body="Встать на цыпочки. Руки жёстко сцеплены за спиной. Тело максимально напряжено. Шея вытянута до предела." accent="var(--magenta)" />
          <DeathStep n="02" title="Дыхание" body="Глубокое спазматическое дыхание. Удерживать до отчётливого головокружения. Не блокировать тошноту — пропустить сквозь." accent="var(--magenta)" />
          <DeathStep n="03" title="Коллапс" body="В точке предельного напряжения — отпустить. Тело падает, сознание срывается в вакуум. Любая внешняя привязка обрывается." accent="var(--magenta)" />
        </div>

        <div style={{ marginTop: 32, padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--void)', display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--magenta)', textTransform: 'uppercase', flexShrink: 0 }}>▸ Альтернатива</div>
          <div style={{ color: 'var(--bone)', fontSize: 15, lineHeight: 1.6, minWidth: 0, flex: 1 }}>
            <span className="caps" style={{ color: 'var(--bone)', fontWeight: 700 }}>Зевота / улыбка.</span>{' '}
            <span style={{ color: 'var(--bone-dim)' }}>Спейр также рекомендовал состояние зевания или улыбки — путь к расслабленной пустоте без физического экстрима. Эффект тот же: вакуум, в котором атаки не за что зацепиться.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeathStep({ n, title, body, accent }) {
  return (
    <div style={{ background: 'var(--void)', padding: '36px 32px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: accent, letterSpacing: '0.1em', marginBottom: 20 }}>[{n}]</div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '-0.01em',
        fontSize: 28, lineHeight: 1, color: 'var(--bone)', marginBottom: 14,
      }}>{title}</div>
      <div style={{ color: 'var(--bone-dim)', fontSize: 15, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

// ----------- SIGIL PRACTICE ----------
function DefenceSigilPractice() {
  const purple = 'var(--purple)';
  const phases = [
    {
      n: '01', label: 'Намерение', title: 'Формула воли',
      body: 'Сформулируй защитное намерение одной фразой в настоящем времени. Без «хочу», без «пусть», без условий. Проверь: можно ли её прочитать вслух без неловкости — если да, формулировка чистая.',
      steps: [
        'Записать одну строку. Пример: «Моя воля — неуязвимость для влияния N».',
        'Выкинуть гласные и повторяющиеся согласные. Останется костяк букв.',
        'Прочесть оставшийся буквенный ряд. Это сырьё для знака.',
      ],
    },
    {
      n: '02', label: 'Упрощение', title: 'Абстрактная монограмма',
      body: 'Сплети оставшиеся буквы в единый знак. Цель — графическая форма, в которой исходные буквы уже не читаются. Ассоциация со словом должна быть утрачена. Только так знак минует Цензор.',
      steps: [
        'Наложи буквы друг на друга, поворачивай, отзеркаливай. Рисуй на бумаге, не в голове.',
        'Упрощай линии, убирай лишнее. Финальный знак — 5-12 штрихов.',
        'Проверка: посмотри через сутки, не читая контекст. Если буквы узнаются — упрощай дальше.',
      ],
    },
    {
      n: '03', label: 'Активация и забвение', title: 'Передача в подсознание',
      body: 'Сознательное желание не работает — оно «непривлекательно» (non-attractive). Сигилу нужно зарядить в момент гнозиса, а потом забыть. Каждое возвращение мыслью разряжает её обратно.',
      steps: [
        'Войти в гнозис: поза смерти, секс-магия, физическое истощение, смех — что подходит. В пиковый момент удерживай знак перед внутренним взором 3-5 секунд.',
        'Сразу после — уничтожить носитель. Сжечь бумагу, стереть файл, смыть с кожи. Знак ушёл в подсознание.',
        'Не вспоминать. Если поймал себя на мысли — мягко переключиться. Через 7-30 дней знак сработает или растворится.',
      ],
    },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: purple, marginBottom: 18 }}>Практика · хаос · защитный знак</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 24 }}>
          Защитная сигила · <span style={{ color: purple }}>код подсознанию</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 32 }}>
          Базовая хаос-техника. Сигила — это сжатое до графики намерение, переданное в подсознание в обход рассудочного цензора. Работает не магия знака, а механика обхода.
          Применяется против повторяющихся информационных атак, навязчивых мыслей, петель сомнения.
        </p>

        <PhaseRow accent={purple} phases={phases} />

        <div style={{ marginTop: 32, padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--ash-2)', display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: purple, textTransform: 'uppercase', flexShrink: 0 }}>▸ Парадокс работы</div>
          <div style={{ color: 'var(--bone)', fontSize: 14.5, lineHeight: 1.6, minWidth: 0, flex: 1 }}>
            Чем сильнее ты хочешь, чтобы сигила сработала, тем меньше она работает.{' '}
            <span style={{ color: 'var(--bone-dim)' }}>
              Спейр: «сомнение — это задержка, страх — это предчувствие». Поэтому правильное отношение — как к выкинутой записке. Сделал, забыл, живёшь дальше. Если через месяц вспомнил и удивился результату — сработало.
            </span>
          </div>
        </div>

        <SigilVideoCard accent={purple} />
      </div>
    </section>
  );
}

function SigilVideoCard({ accent }) {
  const [hover, setHover] = React.useState(false);
  const url = 'https://youtu.be/ZXLbfdTQTEo';
  const thumb = 'https://img.youtube.com/vi/ZXLbfdTQTEo/hqdefault.jpg';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        marginTop: 24,
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0,
        textDecoration: 'none', color: 'inherit',
        border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`,
        background: hover ? 'var(--ash-2)' : 'var(--void)',
        transition: 'background .15s ease',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--void)' }}>
        <img src={thumb} alt="" loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.04)' : 'scale(1)', transition: 'transform .25s ease' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 50%, rgba(176,38,255,0.18) 100%)' }} />
        <div style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: accent, padding: '3px 8px', border: `1px solid ${accent}`,
          background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(4px)', textTransform: 'uppercase',
        }}>YT · Видео</div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 56, height: 56, borderRadius: '50%',
          border: `2px solid ${accent}`, background: 'rgba(10,10,10,0.55)',
          display: 'grid', placeItems: 'center', backdropFilter: 'blur(2px)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill={accent} aria-hidden>
            <polygon points="5,3 17,10 5,17" />
          </svg>
        </div>
      </div>
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>
          ▸ Та же тема в видео
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.005em',
          fontSize: 22, lineHeight: 1.1, color: 'var(--bone)',
        }}>
          Сигилы в магии хаоса · пошаговое руководство для практика
        </div>
        <div style={{ color: 'var(--bone-dim)', fontSize: 14.5, lineHeight: 1.55 }}>
          Десятиминутный разбор техники с визуальными примерами и нюансами, которые сложно дать текстом. Дополнение к этой секции, не замена.
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: hover ? 'var(--bone)' : accent, textTransform: 'uppercase' }}>
          Смотреть на YouTube ↗
        </div>
      </div>
    </a>
  );
}

// ----------- RITUAL FRAGMENT ----------
function DefenceRitualFragment() {
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--amber)', marginBottom: 18 }}>Сценарий · Корпоративный эгрегор</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 700, marginBottom: 24 }}>
              Связывание на языке <span style={{ color: 'var(--amber)' }}>Legalese</span>
            </h2>
            <p style={{ color: 'var(--bone)', fontSize: 17, lineHeight: 1.6, marginBottom: 18 }}>
              Корпорации — современные бездушные эгрегоры. Они оперируют юридическими и финансовыми алгоритмами. Чтобы нейтрализовать такого, говори на его родном языке: канцелярит. Логотип — готовая сигила, заряженная верой миллионов; она же — точка входа.
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Изъять логотип из контекста — вырезать из документа, договора, упаковки.',
                'Сформулировать намерение в форме контракта: стороны, предмет, срок, ограничения.',
                'Произнести вслух или записать — каждый термин с дефиницией в скобках.',
                'Подписать собственным магическим именем. Дата по локальному времени.',
              ].map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--amber)', letterSpacing: '0.08em' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ color: 'var(--bone)', fontSize: 15, lineHeight: 1.55 }}>{s}</span>
                </li>
              ))}
            </ol>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <GuideTag kind="amber">▸ Bind</GuideTag>
              <GuideTag kind="amber">▸ Sigil</GuideTag>
              <GuideTag kind="amber">▸ Egregore</GuideTag>
            </div>
          </div>

          <div style={{
            background: 'var(--ash-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--amber)',
            padding: '32px 36px', position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase' }}>▸ contractus magicus</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--bone-dim)' }}>фрагмент · стр. 1 / 1</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.7, color: 'var(--bone)' }}>
              <p style={{ margin: '0 0 14px' }}>
                Властью изверженной плазмы (далее — <span style={{ color: 'var(--amber)' }}>«ОГОНЬ»</span>),
                состава атмосферы (далее — <span style={{ color: 'var(--amber)' }}>«ВОЗДУХ»</span>) и твердой материи
                (далее — <span style={{ color: 'var(--amber)' }}>«ЗЕМЛЯ»</span>),
              </p>
              <p style={{ margin: '0 0 14px' }}>
                я, <span style={{ borderBottom: '1px dashed var(--bone-dim)', padding: '0 2px' }}>[Имя]</span>,
                именуемый далее <span style={{ color: 'var(--amber)' }}>МАГ</span>, настоящим ограничиваю
                (<em style={{ fontStyle: 'italic' }}>bind</em>) любые действия юридического лица, именуемого далее
                <span style={{ color: 'var(--amber)' }}> КОРПОРАЦИЯ ABC</span>.
              </p>
              <p style={{ margin: '0 0 14px' }}>
                Сим я запрещаю наносить вред (включая эмоциональный, ментальный и фискальный ущерб) кому бы то ни было на весь срок действия настоящего контракта,
              </p>
              <p style={{ margin: '0 0 24px' }}>
                каковой <span style={{ color: 'var(--amber)' }}>равен вечности</span>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 8, gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>подпись мага</div>
                  <div style={{ fontSize: 11, color: 'var(--bone-dim)' }}>____________________</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>дата · место</div>
                  <div style={{ fontSize: 11, color: 'var(--bone-dim)' }}>[__.__.____]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------- DAILY CHECKLIST ----------
function DefenceChecklist() {
  const items = [
    { t: 'Спал ≥ 6 часов', d: 'Без сна нет нейронной устойчивости. Любая практика — расход ресурса; на пустую систему лучше не запускать.', kind: 'green' },
    { t: 'Поел и пил воду', d: 'Гипогликемия маскируется под «откровение». Проверь уровень сахара до того, как интерпретировать опыт.', kind: 'green' },
    { t: 'Решил/распланировал хотя бы одну мирскую задачу', d: 'Если день начинается с «эзотерики», Малкут проседает. Сначала — Земля.', kind: 'green' },
    { t: 'Записал в дневник вчерашний день одной строкой', d: 'Дневник — внешний Срединный Столп. Без него ты теряешь след собственных состояний.', kind: 'green' },
    { t: 'Появилось желание «запустить ритуал просто на всякий случай»', d: 'Это сигнал тревоги, не сигнал к действию. Минимизируй число активных связей.', kind: 'red' },
    { t: 'Поймал себя на повторяющейся мысли об угрозе ≥ 3 раз', d: 'Ты кормишь связь вниманием. Применить смех или разрыв через сигилу, не наращивать защиту.', kind: 'red' },
    { t: 'Хочется кому-то рассказать про свою практику', d: 'Сила утекает в зрителя. Молчание — часть техники. Рассказывать можно только тому, кто практикует на твоём уровне.', kind: 'red' },
    { t: 'После вчерашней практики не получается выполнить рабочие задачи', d: 'Опыт был разрушительным, не очищающим. Сегодня — только заземление: еда, движение, рутина. Никаких новых техник.', kind: 'red' },
  ];
  const greens = items.filter(i => i.kind === 'green');
  const reds = items.filter(i => i.kind === 'red');
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: 'var(--amber)', marginBottom: 18 }}>Диагностика · ежедневный осмотр</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1100, marginBottom: 24 }}>
          Где я <span style={{ color: 'var(--amber)' }}>сейчас</span>
        </h2>
        <p className="lead" style={{ color: 'var(--bone-dim)', maxWidth: 820, marginBottom: 48 }}>
          Чек-лист на каждое утро или перед практикой. Зелёные пункты — должны быть «да». Красные — должны быть «нет». Если хотя бы один не на месте — день тренировки, а не работы.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <ChecklistColumn title="Должно быть · да" accent="var(--acid-green)" items={greens} />
          <ChecklistColumn title="Должно быть · нет" accent="var(--blood-text)" items={reds} />
        </div>
      </div>
    </section>
  );
}

function ChecklistColumn({ title, accent, items }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`, background: 'var(--ash-2)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>
          ▸ {title}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.08em' }}>
          {String(items.length).padStart(2, '0')} пунктов
        </div>
      </div>
      {items.map((x, i) => (
        <div key={i} style={{ padding: '18px 24px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', gap: 14, alignItems: 'baseline' }}>
          <div style={{
            width: 16, height: 16, border: `1px solid ${accent}`, flexShrink: 0,
            position: 'relative', top: 2,
          }} aria-hidden />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 700, fontSize: 16, letterSpacing: '-0.005em', color: 'var(--bone)', marginBottom: 4, lineHeight: 1.15 }}>{x.t}</div>
            <div style={{ color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.5 }}>{x.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------- FALSE DEFENCE ----------
function DefenceFalseDefence() {
  const items = [
    { t: 'Постоянный фоновый страх', d: 'Если защиту приходится «держать», она не работает. Истинная защита — побочный продукт.' },
    { t: 'Эпатаж и демонстрация силы', d: 'Реклама духовности дискредитирует саму духовность. Сила, которую показывают, тут же утекает в зрителя/слушателя/читателя.' },
    { t: 'Невозможность вернуться к мирским задачам', d: 'Если после сеанса ты не можешь делать привычные бытовые вещи — опыт был разрушительным.' },
    { t: 'Накопление магических связей', d: 'Каждый ритуал «просто на всякий случай» — новая поверхность для атаки. Минимизируй площадь воздействия на самого себя.' },
    { t: 'Изменение варварских имён', d: 'Точное числовое значение — суть формулы. Любое искажение создаёт неуравновешенную силу.' },
    { t: 'Самостоятельная работа без зеркала', d: 'Когда сознание ускоряется, нужен внешний Срединный Столп — наставник или фиксированный текст.' },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
        <div className="eyebrow" style={{ color: 'var(--blood-text)', marginBottom: 18 }}>Критерии · Признаки фиктивной защиты</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', maxWidth: 1200, marginBottom: 48 }}>
          Если узнал себя — <span style={{ color: 'var(--blood-display)' }}>защиты нет</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid var(--border)' }}>
          {items.map((x, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const isLastRow = row === Math.floor((items.length - 1) / 2);
            return (
              <div key={i} style={{
                padding: '28px 32px',
                borderRight: col === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: !isLastRow ? '1px solid var(--border)' : 'none',
                background: 'var(--void)',
                display: 'flex', gap: 20, alignItems: 'baseline',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--blood-text)', letterSpacing: '0.1em', flexShrink: 0 }}>×</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '-0.005em',
                    fontSize: 19, lineHeight: 1.1, color: 'var(--bone)', marginBottom: 8,
                  }}>{x.t}</div>
                  <div style={{ color: 'var(--bone-dim)', fontSize: 14.5, lineHeight: 1.55 }}>{x.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ----------- CLOSING THESIS ----------
function DefenceClosing() {
  return (
    <section style={{
      background: 'var(--blood)', position: 'relative', overflow: 'hidden',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 14, left: 32, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--bone)', textTransform: 'uppercase' }}>
          ▸ финальный тезис
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          lineHeight: 0.92, fontSize: 'clamp(40px, 5.5vw, 72px)', color: 'var(--bone)', maxWidth: 1300,
          marginTop: 24,
        }}>
          Высшая защита — это не<br/>заклинание, а обретение<br/><span style={{ opacity: 0.7 }}>знания (Даат).</span>
        </div>
        <div style={{ marginTop: 32, fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.1em', color: 'var(--bone)', maxWidth: 700, lineHeight: 1.6 }}>
          Безопасность — побочный продукт правильной эволюции сознания. Не цель, не результат и не статус. Это состояние.
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  GUIDES_INDEX,
  GuidesLanding,
  GuidePage,
  GuideDefenseBasics,
});
