// Servitors course landing — module index with READ CTAs.
// Click "Читать →" navigates to the Reader (sets app state via setRoute + event).

function ServitorsPage({ setRoute }) {
  const purple = 'var(--purple)';
  const modules = window.SERVITORS_MODULES || [];

  const goToModule = (idx) => {
    try { localStorage.setItem('lr_servitor_module', String(idx)); } catch {}
    setRoute('servitors-reader');
  };

  return (
    <div>
      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: `2px solid ${purple}`,
        background: 'linear-gradient(180deg, var(--void) 0%, #120820 100%)',
      }}>
        <div style={{ position: 'absolute', right: -100, top: -40, pointerEvents: 'none' }}>
          {typeof SigilServitor !== 'undefined' && <SigilServitor accent={purple} opacity={0.28} size={640} />}
        </div>
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--bone-dim)', textDecoration: 'none' }}>
              ← ЛЕВО РУЛЯ
            </a>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: purple }}>
              сервиторы
            </span>
          </div>
          <Eyebrow accent={purple}>открытый курс · 11 модулей</Eyebrow>

          <h1 className="lr-glitch-text" style={{ marginTop: 28, fontSize: 'clamp(72px, 11vw, 180px)', lineHeight: 0.85, letterSpacing: '-0.02em' }}>
            СЕРВИ<span style={{ color: purple }}>ТОРЫ.</span>
          </h1>
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56, alignItems: 'end' }}>
            <div>
              <p style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--bone)', maxWidth: 640 }}>
                Полный курс: от теории (Спейр, Кэрролл, Хайн, Уайт) до инженерного протокола
                создания, эксплуатации и завершения собственного сервитора.
                <b> Без ангелов и без кармической пени.</b>
              </p>
              <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Tag accent={purple}>▸ 11 модулей</Tag>
                <Tag accent={purple}>▸ 10+ часов чтения</Tag>
                <Tag accent={purple}>▸ дневник и практика</Tag>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
              <ContinueOrStartButton goToModule={goToModule} modules={modules} purple={purple} />
              <Btn variant="ghostAccent" accent={purple} href="#program">Вся программа ↓</Btn>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.08em' }}>
                без регистрации, оплаты и SMS
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.08em', textAlign: 'right' }}>
                Задать вопрос или обсудить можно{' '}
                <a href="https://t.me/levorules_chat" target="_blank" rel="noopener"
                   style={{ color: purple, textDecoration: 'underline', textUnderlineOffset: 2 }}>ТУТ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--ash-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <Eyebrow accent={purple}>для кого</Eyebrow>
            <h3 style={{ marginTop: 14, fontSize: 28 }}>ЕСЛИ ТЫ УЖЕ ПРАКТИКУЕШЬ</h3>
            <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', color: 'var(--bone)' }}>
              {[
                'знаком с базовой рамкой хаос-магии (Кэрролл, Хайн)',
                'хочешь перейти от «знаю» к «делаю» с дневником',
                'готов к 3 неделям подготовки перед первым ритуалом',
                'зрелая психика, готовность брать ответственность',
              ].map((l, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none',
                  display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: purple, fontFamily: 'var(--font-mono)' }}>▸</span>{l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow accent="var(--blood)">для кого НЕ</Eyebrow>
            <h3 style={{ marginTop: 14, fontSize: 28 }}>НЕ ЧИТАЙ, ЕСЛИ</h3>
            <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', color: 'var(--bone-dim)' }}>
              {[
                'ищешь «быстрый результат без работы»',
                'несовершеннолетний или в активной психотической фазе',
                'ждёшь наставника, гуру, инициации',
                'веришь, что сигилы сработают вместо действий',
              ].map((l, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none',
                  display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--blood)', fontFamily: 'var(--font-mono)' }}>✗</span>{l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
          <SectionTitle eyebrow="программа" title="ОДИННАДЦАТЬ МОДУЛЕЙ" accent={purple}>
            Курс построен по принципу восхождения. Каждый модуль предполагает освоение
            предыдущего, и прыжок через уровни даёт ожидаемо плохие результаты.
          </SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)' }}>
            {modules.map((m, i) => (
              <div key={m.n} style={{
                borderBottom: i < modules.length - 1 ? '1px solid var(--border)' : 'none',
                background: 'var(--ash)',
                transition: 'background .15s ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ash-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--ash)'}
              >
                <div style={{
                  padding: '28px 32px',
                  display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: 24, alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: purple, fontWeight: 700 }}>
                    {m.n}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
                      letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.1 }}>
                      {m.title}
                    </div>
                    <div style={{ marginTop: 6, color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.45, maxWidth: 720 }}>
                      <RichText text={m.sub} />
                    </div>
                    {m.sections && (
                      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
                        {m.sections.map(s => (
                          <span key={s.id} style={{
                            fontFamily: 'var(--font-mono)', fontSize: 11,
                            color: 'var(--bone-dim)', letterSpacing: '0.02em',
                          }}>
                            <span style={{ color: purple, opacity: 0.7, marginRight: 4 }}>{s.id}</span>
                            {s.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
                    letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                    {m.time || ''}
                  </span>
                  <button
                    onClick={() => goToModule(i)}
                    style={{
                      all: 'unset', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '10px 16px',
                      color: purple, border: `1px solid ${purple}`,
                      transition: 'background .15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = purple; e.currentTarget.style.color = 'var(--void)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = purple; }}
                  >
                    Читать →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAT */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--ash-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
          <SectionTitle eyebrow="формат" title="КАК ЭТО УСТРОЕНО" accent={purple} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {[
              { t: 'ТЕКСТ', b: 'Лонгриды с подзаголовками, цитатами, таблицами соответствий. Без инфографики ради инфографики.' },
              { t: 'ПРОТОКОЛЫ', b: 'Пошаговые инструкции ритуалов: подготовка, гнозис, декларация, закрытие. С указанием времени.' },
              { t: 'КЕЙСЫ', b: 'Разборы канонических сервиторов Кэрролла, Хайна, Брэнда, Харта. Плюс типичные ошибки.' },
              { t: 'ПРАКТИКА', b: 'В каждом модуле — вопросы для самопроверки и задания для дневника. Курс читается годами.' },
            ].map((c, i) => (
              <div key={i} style={{ background: 'var(--ash)', padding: 28, minHeight: 200 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: purple, letterSpacing: '0.12em' }}>0{i+1}</div>
                <h4 style={{ marginTop: 16, fontSize: 22 }}>{c.t}</h4>
                <p style={{ marginTop: 12, color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.55 }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPENDICES — separate PDF downloads */}
      <section id="appendices" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
          <SectionTitle eyebrow="приложения" title="СПРАВОЧНИКИ И ШАБЛОНЫ" accent={purple}>
            Восемь отдельных PDF — глоссарий, библиография, чек-листы, шаблоны протоколов, годовая программа, FAQ, расширенная литература и полный курс одним файлом. Скачиваются по одному, печатаются отдельно, читаются по мере надобности.
          </SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1,
            background: 'var(--border)', border: '1px solid var(--border)' }}>
            {[
              { l: 'A', t: 'Глоссарий', d: 'Сорок ключевых терминов курса в одном месте: активация, анкер, архетип, гнозис, захват, клипот, сигила, Zos-Kia Cultus и другие.', f: 'prilozhenie-a-glossariy.pdf' },
              { l: 'B', t: 'Аннотированная библиография', d: 'Три уровня чтения — от базы (Кэрролл, Хайн, Брэнд) до специализации (Грант, Карлссон, Форд). С русскоязычными переводами Адрианова.', f: 'prilozhenie-b-bibliografiya.pdf' },
              { l: 'C', t: 'Чек-листы', d: 'Готовность к Модулю 4, ритуал зачатия, диагностика работоспособности, маркеры захвата, протокол завершения. Пять выверенных списков.', f: 'prilozhenie-c-chek-listy.pdf' },
              { l: 'D', t: 'Шаблоны протоколов', d: 'Полная спецификация сервитора, короткая активация, еженедельное ревю, квартальная диагностика, журнал деактивации. Заполняется от руки.', f: 'prilozhenie-d-shablony-protokolov.pdf' },
              { l: 'E', t: '52-недельная программа', d: 'Год прохождения курса с нуля — по неделям. Фундамент, первый сервитор, углубление, мастерство. Ориентир, не жёсткое расписание.', f: 'prilozhenie-e-52-nedelnaya-programma.pdf' },
              { l: 'F', t: 'FAQ — 50 вопросов', d: 'От «сколько сервиторов одновременно» до «что делать, если сервитор начал сниться каждую ночь». Сжатые ответы по семи темам.', f: 'prilozhenie-f-faq.pdf' },
              { l: 'G', t: 'Дополнительная литература', d: 'Авторитетные работы за пределами основной библиографии: Stavish, Veissière, Schwartz, Stratton-Kent, Lachman, Kripal, Ellwood, Moore. Двенадцать тематических блоков.', f: 'prilozhenie-g-dopolnitelnaya-literatura.pdf' },
              { l: '✱', t: 'Курс одним PDF', d: 'Полная редакция 2026-04-18 в одном файле на 141 страницу. Все модули и приложения вместе — для оффлайн-чтения и печати.', f: 'servitors.pdf', isFull: true },
            ].map((a, i) => (
              <a key={a.l} href={`uploads/${a.isFull ? '' : 'appendices/'}${a.f}`} download
                style={{
                  background: 'var(--ash)', padding: 28, minHeight: 160,
                  textDecoration: 'none', color: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'background .15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ash-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--ash)'}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: purple, fontWeight: 700, minWidth: 28 }}>
                    {a.l}
                  </span>
                  <h4 style={{ fontSize: 20, margin: 0, flex: 1 }}>{a.t}</h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.12em' }}>
                    PDF ↓
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--bone-dim)', fontSize: 14, lineHeight: 1.5 }}>
                  {a.d}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: purple, color: 'var(--void)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            ПОДПИШИСЬ, КОГДА<br/>БУДЕШЬ ГОТОВ.
          </div>
          <div style={{ marginTop: 32 }}>
            <Btn href="https://t.me/levorules" style={{
              background: 'var(--void)', color: 'var(--bone)',
              borderColor: 'var(--void)',
            }}>@levorules →</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

// Primary CTA: adapts to whether user has reading progress.
// - no progress / module 0 → «Начать с модуля 00 →»
// - progress > 0         → «Продолжить с модуля NN →» + subtitle with section title
function ContinueOrStartButton({ goToModule, modules, purple }) {
  const [saved, setSaved] = React.useState(() => {
    const n = parseInt(localStorage.getItem('lr_servitor_module') || '0', 10);
    return isNaN(n) ? 0 : n;
  });
  if (saved <= 0 || !modules[saved]) {
    return (
      <Btn variant="accent" accent={purple} onClick={() => goToModule(0)}>
        Начать с модуля 00 →
      </Btn>
    );
  }
  const m = modules[saved];
  const label = `Продолжить с модуля ${String(saved).padStart(2, '0')} →`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
      <Btn variant="accent" accent={purple} onClick={() => goToModule(saved)}>{label}</Btn>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
        letterSpacing: '0.08em', textTransform: 'uppercase', maxWidth: 260, textAlign: 'right' }}>
        {m.title}
      </div>
      <button onClick={(e) => { e.preventDefault(); localStorage.removeItem('lr_servitor_module'); setSaved(0); }}
        style={{ all: 'unset', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)',
          letterSpacing: '0.06em', textDecoration: 'underline' }}>
        сбросить прогресс
      </button>
    </div>
  );
}

window.ServitorsPage = ServitorsPage;
