// Servitors course landing — module index with READ CTAs.
// Click "Читать →" navigates to the Reader (sets app state via setRoute + event).

function ServitorsPage({ setRoute }) {
  const purple = 'var(--purple)';
  const modules = window.SERVITORS_MODULES || [];

  const goToModule = (idx, placement = 'course_program') => {
    const next = Math.max(0, Math.min(modules.length - 1, idx));
    window.lrAnalytics?.course('course_cta_click', {
      creative_slot: placement,
      module_index: next,
      module_number: modules[next]?.n,
      module_title: modules[next]?.title,
    });
    setRoute('servitors-reader', null, null, { moduleIndex: next });
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
                Полный курс: от истории и первоисточников до пошагового создания,
                повседневной работы и безопасного завершения собственного сервитора.
              </p>
              <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Tag accent={purple}>▸ 11 модулей</Tag>
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
                <a href="https://telegram.me/levorules_chat" target="_blank" rel="noopener"
                   style={{ color: purple, textDecoration: 'underline', textUnderlineOffset: 2 }}>ТУТ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)', background: 'var(--ash-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <Eyebrow accent={purple}>для кого</Eyebrow>
            <h3 style={{ marginTop: 14, fontSize: 28 }}>ЕСЛИ ТЫ УЖЕ ПРАКТИКУЕШЬ</h3>
            <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', color: 'var(--bone)' }}>
              {[
                'знаком с базовой рамкой хаос-магии (Кэрролл, Хайн)',
                'хочешь перейти от «знаю» к «делаю» с дневником',
                'готов сначала понаблюдать за собой и вести дневник',
                'можешь остановить практику, если она мешает сну, работе или отношениям',
              ].map((l, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none',
                  display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: purple, fontFamily: 'var(--font-mono)' }}>▸</span>{l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow accent="var(--blood-text)">для кого НЕ</Eyebrow>
            <h3 style={{ marginTop: 14, fontSize: 28 }}>НЕ ЧИТАЙ, ЕСЛИ</h3>
            <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', color: 'var(--bone-dim)' }}>
              {[
                'ищешь «быстрый результат без работы»',
                'тебе нет 18 лет или сейчас ты переживаешь психотический эпизод',
                'хочешь передать наставнику или сущности ответственность за свои решения',
                'веришь, что сигилы сработают вместо действий',
              ].map((l, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none',
                  display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--blood-text)', fontFamily: 'var(--font-mono)' }}>✗</span>{l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 32px' }}>
          <SectionTitle eyebrow="программа" title="ОДИННАДЦАТЬ МОДУЛЕЙ" accent={purple}>
            Модули идут от терминов и истории к созданию, повседневной работе и завершению.
            Лучше читать их по порядку: поздние разделы опираются на правила из ранних.
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
                  display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 24, alignItems: 'center',
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
                  <button
                    onClick={() => goToModule(i, 'course_program')}
                    style={{
                      all: 'unset', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44,
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
      <section data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)', background: 'var(--ash-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
          <SectionTitle eyebrow="формат" title="КАК ЭТО УСТРОЕНО" accent={purple} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {[
              { t: 'ТЕКСТ', b: 'Большие главы с подзаголовками, цитатами и таблицами. Источник и авторское толкование отмечены отдельно.' },
              { t: 'ПОРЯДОК РАБОТЫ', b: 'Пошаговые сценарии ритуалов: подготовка, гнозис, правила, границы и завершение. Время дано только как ориентир.' },
              { t: 'РАЗБОРЫ', b: 'Примеры из Кэрролла, Хайна и Брэнда, мои сопоставления и вымышленные ситуации с типичными ошибками.' },
              { t: 'ПРАКТИКА', b: 'В каждом модуле есть вопросы для самопроверки и задания для дневника. Их можно выполнять в своём темпе.' },
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

      <PassportPromo placement="servitors" />

      {/* APPENDICES — separate PDF downloads */}
      <section id="appendices" data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
          <SectionTitle eyebrow="приложения" title="СПРАВОЧНИКИ И ФОРМЫ" accent={purple}>
            Здесь восемь PDF: глоссарий, библиография, контрольные списки, формы для записей, годовая программа, ответы на частые вопросы, дополнительная литература и полный курс одним файлом. Их можно скачать и распечатать по отдельности.
          </SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1,
            background: 'var(--border)', border: '1px solid var(--border)' }}>
            {[
              { l: 'A', t: 'Глоссарий', d: 'Ключевые термины курса в одном месте: активация, анкер, архетип, гнозис, захват, клипот, сигила, Zos-Kia Cultus и другие.', f: 'prilozhenie-a-glossariy.pdf' },
              { l: 'B', t: 'Аннотированная библиография', d: 'Три уровня чтения — от базы (Кэрролл, Хайн, Брэнд) до специализации (Грант, Карлссон, Форд). С русскоязычными переводами Адрианова.', f: 'prilozhenie-b-bibliografiya.pdf' },
              { l: 'C', t: 'Контрольные списки', d: 'Готовность к Модулю 4, создание, проверка работы, потеря безопасной дистанции и завершение. Пять списков для самостоятельной проверки.', f: 'prilozhenie-c-chek-listy.pdf' },
              { l: 'D', t: 'Формы для записей', d: 'Полное описание сервитора, короткая активация, еженедельное подведение итогов, квартальная проверка и журнал деактивации. Заполняются от руки.', f: 'prilozhenie-d-shablony-protokolov.pdf' },
              { l: 'E', t: '52-недельная программа', d: 'Год прохождения курса с нуля — по неделям. Основа, первый сервитор, углубление и самостоятельная работа. Это ориентир, а не жёсткое расписание.', f: 'prilozhenie-e-52-nedelnaya-programma.pdf' },
              { l: 'F', t: 'FAQ — 50 вопросов', d: 'От «сколько сервиторов одновременно» до «что делать, если сервитор начал сниться каждую ночь». Сжатые ответы по семи темам.', f: 'prilozhenie-f-faq.pdf' },
              { l: 'G', t: 'Дополнительная литература', d: 'Академические исследования, первичные тексты практиков, популярные руководства и отдельный блок источников по безопасности. Уровень доказательности явно различается.', f: 'prilozhenie-g-dopolnitelnaya-literatura.pdf' },
              { l: '✱', t: 'Курс одним PDF', d: 'Актуальная редакция 2026-07-22: все 11 модулей в одном файле для чтения без интернета и печати. Приложения скачиваются отдельными файлами выше.', f: 'servitors.pdf', isFull: true },
            ].map((a, i) => (
              <a key={a.l} className="lr-reactive-card" href={`uploads/${a.isFull ? '' : 'appendices/'}${a.f}`} download
                style={{
                  '--lr-interaction-accent': purple,
                  background: 'var(--ash)', padding: 28, minHeight: 160,
                  textDecoration: 'none', color: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  position: 'relative', overflow: 'hidden',
                  transition: 'background .15s ease, transform .18s ease',
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
      <section data-lr-reveal="section" style={{ background: purple, color: 'var(--void)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '56px 32px', textAlign: 'center' }}>
          <Btn href="https://telegram.me/levorules" style={{
            background: 'var(--void)', color: 'var(--bone)',
            borderColor: 'var(--void)',
          }}>@levorules →</Btn>
        </div>
      </section>
    </div>
  );
}

// Primary CTA: adapts to whether user has reading progress.
// - no progress / module 0 → «Начать с модуля 00 →»
// - progress > 0         → «Продолжить с модуля NN →» + subtitle with section title
function ContinueOrStartButton({ goToModule, modules, purple }) {
  const [progress, setProgress] = React.useState(() => (
    window.lrCourseProgress?.read(modules.length) || {
      started: false,
      currentModule: 0,
      highestModule: 0,
      completed: false,
    }
  ));
  const saved = Math.max(0, Math.min(modules.length - 1, progress.currentModule || 0));

  if (!progress.started || !modules[saved]) {
    return (
      <Btn variant="accent" accent={purple} onClick={() => goToModule(0, 'course_hero_start')}>
        Начать с модуля 00 →
      </Btn>
    );
  }

  const m = modules[saved];
  const position = progress.completed
    ? modules.length
    : Math.min(modules.length, progress.visitedModules?.length || 1);
  const percent = progress.completed
    ? 100
    : Math.round((position / Math.max(modules.length, 1)) * 100);
  const label = progress.completed
    ? `Вернуться к модулю ${m.n} →`
    : `Продолжить с модуля ${m.n} →`;
  const resetProgress = (event) => {
    event.preventDefault();
    window.lrAnalytics?.course('course_reset', {
      module_index: saved,
      module_number: m.n,
      progress_percent: percent,
    });
    const next = window.lrCourseProgress?.reset() || {
      started: false,
      currentModule: 0,
      highestModule: 0,
      completed: false,
    };
    setProgress(next);
  };

  return (
    <div style={{ width: 'min(100%, 360px)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: progress.completed ? 'var(--acid-green)' : 'var(--bone-dim)' }}>
        <span>{progress.completed ? '✓ курс завершён' : 'открыто модулей'}</span>
        <span>{position} / {modules.length} · {percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Открытые модули курса"
        aria-valuemin={0}
        aria-valuemax={modules.length}
        aria-valuenow={position}
        aria-valuetext={`Открыто ${position} из ${modules.length} модулей`}
        style={{ height: 4, background: 'var(--border)', overflow: 'hidden' }}
      >
        <div style={{ width: `${percent}%`, height: '100%', background: progress.completed ? 'var(--acid-green)' : purple }} />
      </div>
      <Btn variant="accent" accent={purple} block onClick={() => {
        window.lrAnalytics?.course(progress.completed ? 'course_revisit' : 'course_resume', {
          creative_slot: 'course_hero_resume',
          module_index: saved,
          module_number: m.n,
          module_title: m.title,
          progress_percent: percent,
        });
        goToModule(saved, 'course_hero_resume');
      }}>{label}</Btn>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)',
        letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>
        точка возврата · {m.title}
      </div>
      <button onClick={resetProgress}
        style={{ all: 'unset', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: 44,
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)',
          letterSpacing: '0.06em', textDecoration: 'underline' }}>
        сбросить прогресс
      </button>
    </div>
  );
}

window.ServitorsPage = ServitorsPage;
