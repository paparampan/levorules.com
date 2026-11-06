// A self-contained companion to the film. Inputs stay in this page's memory only.
const MAGIC_DEFAULTS = { P: '50', G: '0,5', L: '0,5', A: '0,5', R: '0,5' };
const MAGIC_FACTORS = [
  { key: 'G', title: 'Гнозис', hint: 'Глубина измененного состояния сознания в момент ритуала.', low: '0 · обычное состояние', high: '1 · полное погружение' },
  { key: 'L', title: 'Магическая связь', hint: 'Насколько тесно налажена твоя связь с объектом воздействия.', low: '0 · связи нет', high: '1 · полная связь' },
  { key: 'A', title: 'Фиксация на результате', hint: 'Насколько сильно цепляешься за желаемое: ждешь подтверждений, проверяешь, получилось ли.', low: '0 · отпустил результат', high: '1 · полная фиксация', inverse: true },
  { key: 'R', title: 'Внутреннее сопротивление', hint: 'Насколько твой внутренний цензор отвергает возможность успешного результата.', low: '0 · сопротивления нет', high: '1 · полное отторжение', inverse: true },
];

function magicNumber(value, digits = 2) {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: digits });
}
function magicProbability(value) {
  const percent = value * 100;
  if (percent > 0 && percent < 0.01) return '< 0,01';
  if (percent < 100 && percent >= 99.995) return '> 99,99';
  return magicNumber(percent);
}
function magicResultBand(value) {
  // Match the displayed percentage so rounding cannot disagree with its color.
  const percent = Number(magicNumber(value * 100).replace(',', '.'));
  if (percent < 31) return 'red';
  if (percent < 50) return 'orange';
  if (percent < 66) return 'yellow';
  return 'green';
}
function magicStrength(value) {
  return value > 0 && value < 0.000001 ? '< 0,000001' : magicNumber(value, 6);
}
function magicSubstitutionNumber(value) {
  return value > 0 && value < 0.000001 ? value.toExponential(4).replace('.', ',') : magicNumber(value, 10);
}
function MagicEquation({ probability = false }) {
  return <span className="magic-equation" role="math" aria-label={probability
    ? 'P m равно P плюс (1 минус P), умноженное на M в степени (1 делить на P)'
    : 'M равно G умножить на L умножить на (1 минус A) умножить на (1 минус R)'}>
    <span aria-hidden="true">{probability
      ? <><i>P</i><sub>m</sub> = <i>P</i> + (1 − <i>P</i>) · <i>M</i><sup>1/<i>P</i></sup></>
      : <><i>M</i> = <i>G</i> · <i>L</i> · (1 − <i>A</i>) · (1 − <i>R</i>)</>}
    </span>
  </span>;
}

function MagicField({ factor, value, onChange }) {
  const { key, title, hint, low, high, inverse } = factor;
  const isP = key === 'P';
  const max = isP ? 100 : 1;
  const parsed = lrMagicParse(value);
  const invalid = !Number.isFinite(parsed) || parsed < 0 || parsed > max || (isP && parsed === 0);
  const sliderValue = Number.isFinite(parsed) ? Math.max(0, Math.min(max, parsed)) : 0;
  const error = isP && parsed === 0
    ? 'При P = 0 формула не определена: на ноль делить нельзя.'
    : isP ? 'Введи число больше 0 и не больше 100.' : 'Введи число от 0 до 1.';
  return <div className={`magic-field${isP ? ' magic-field-p' : ''}`}>
    <div className="magic-field-heading">
      <span className="magic-letter" aria-hidden="true">{key}</span>
      <label htmlFor={`magic-${key}`}><strong>{title}</strong><span>{isP ? 'В процентах' : inverse ? 'Чем ниже, тем больше M' : 'Чем выше, тем больше M'}</span></label>
      <div className="magic-value-wrap">
        <input id={`magic-${key}`} type="text" inputMode="decimal" autoComplete="off" spellCheck="false"
          value={value} onChange={e => onChange(key, e.target.value)}
          aria-invalid={invalid} aria-describedby={`magic-${key}-hint${invalid ? ` magic-${key}-error` : ''}`} />
        {isP && <span aria-hidden="true">%</span>}
      </div>
    </div>
    <p id={`magic-${key}-hint`} className="magic-field-hint">{hint}</p>
    <input className="magic-slider" type="range" min="0" max={max} step={isP ? '0.1' : '0.01'}
      value={sliderValue} aria-label={`${title}: ползунок`} aria-describedby={`magic-${key}-hint`}
      style={{ '--magic-fill': `${sliderValue / max * 100}%` }}
      onChange={e => onChange(key, e.target.value.replace('.', ','))} />
    <div className="magic-scale"><span>{low}</span><span>{high}</span></div>
    {invalid && <p className="magic-error" id={`magic-${key}-error`}>{error}</p>}
  </div>;
}

function MagicCalculator() {
  const [values, setValues] = React.useState({ ...MAGIC_DEFAULTS });
  const numbers = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, lrMagicParse(value)]));
  const result = lrMagicCalculate({ ...numbers, P: numbers.P / 100 });
  const validationMessage = !Number.isFinite(numbers.P) || numbers.P <= 0 || numbers.P > 100
    ? numbers.P === 0 ? 'При P = 0 формула не определена: в степени стоит 1/P.' : 'Исходная вероятность должна быть числом больше 0 и не больше 100%.'
    : 'Показатели G, L, A и R должны быть числами от 0 до 1.';
  const update = (key, value) => setValues(old => ({ ...old, [key]: value }));
  const hasTinyDelta = result.valid && result.logDelta !== -Infinity && result.delta * 100 < 0.01;
  const deltaText = hasTinyDelta ? '< 0,01' : result.valid ? magicNumber(result.delta * 100) : '';
  return <section id="magic-calculator" className="magic-section guide-anchor" aria-labelledby="magic-calc-title">
    <div className="magic-section-heading"><span className="magic-kicker">01 / Подставь свои значения</span><h2 id="magic-calc-title">ПОСЧИТАЙ СВОЙ РЕЗУЛЬТАТ</h2></div>
    <p className="magic-preflight">Сначала определи конкретное событие и срок, к которому ждешь его наступления. Все пять оценок должны относиться к одной и той же задаче.</p>
    <div className="magic-calculator-grid">
      <div className="magic-inputs">
        <MagicField factor={{ key: 'P', title: 'Исходная вероятность', hint: 'Шанс события без магии. Оцени его по фактам, статистике и уже предпринятым действиям, а не по силе желания.', low: '0% · невозможно', high: '100% · неизбежно' }} value={values.P} onChange={update} />
        <div className="magic-factor-intro"><strong>Четыре составляющие M</strong><span>От 0 до 1. Это твои оценки, готовой измерительной шкалы нет.</span></div>
        {MAGIC_FACTORS.map(factor => <MagicField key={factor.key} factor={factor} value={values[factor.key]} onChange={update} />)}
        <div className="magic-input-footer"><p>Стартовые значения условные. Замени их своими оценками.</p><button type="button" onClick={() => setValues({ ...MAGIC_DEFAULTS })}>Сбросить</button></div>
      </div>
      <div className="magic-results-column">
        <div className="magic-result" data-result-band={result.valid ? magicResultBand(result.Pm) : 'neutral'} aria-live="polite" aria-atomic="true">
          <span className="magic-kicker">Результат по модели</span>
          {result.valid ? <>
            <div className="magic-result-value"><span>{magicProbability(result.Pm)}</span><span className="magic-percent">%</span></div>
            <p className="magic-result-label">P<sub>m</sub> · вероятность с учетом магии</p>
            <div className="magic-bar" role="img" aria-label={`Исходная вероятность ${magicNumber(numbers.P, 4)} процентов, прибавка ${deltaText} процентного пункта`}>
              <span className="magic-bar-base" style={{ width: `${numbers.P}%` }} /><span className="magic-bar-delta" style={{ width: `${result.delta * 100}%` }} />
            </div>
            <dl className="magic-breakdown">
              <div><dt><span className="magic-dot magic-dot-base" />Без магии · P</dt><dd>{magicProbability(numbers.P / 100)}%</dd></div>
              <div><dt><span className="magic-dot" />Прибавка к P</dt><dd>{hasTinyDelta ? '' : '+'}{deltaText} <small>п.п.</small></dd></div>
              <div className="magic-m-row"><dt>Сила магии · M</dt><dd>{magicStrength(result.M)}</dd></div>
            </dl>
            {hasTinyDelta && <p className="magic-result-note">Прибавка меньше 0,01 процентного пункта. После округления итог может совпасть с исходным шансом.</p>}
            {result.M === 1 && <p className="magic-result-note">M = 1 означает идеальный магический акт в этой модели. Полученные 100% не служат гарантией реального события.</p>}
            {numbers.P === 100 && <p className="magic-result-note">При P = 100% событие уже считается неизбежным. Прибавлять к этому нечего.</p>}
            <details className="magic-substitution"><summary>Посмотреть подстановку</summary>
              <p><strong>M</strong> = {magicNumber(numbers.G, 8)} · {magicNumber(numbers.L, 8)} · (1 − {magicNumber(numbers.A, 8)}) · (1 − {magicNumber(numbers.R, 8)})<br />= {magicStrength(result.M)}</p>
              <p><strong>P</strong> = {magicSubstitutionNumber(numbers.P)} / 100 = {magicSubstitutionNumber(numbers.P / 100)}</p>
              <MagicEquation probability />
              <p className="magic-substitution-line">P<sub>m</sub> ≈ {magicSubstitutionNumber(numbers.P / 100)} + (1 − {magicSubstitutionNumber(numbers.P / 100)}) · ({magicSubstitutionNumber(result.M)})<sup>1/({magicSubstitutionNumber(numbers.P / 100)})</sup></p>
              <p>Результат в долях умножаем на 100 и получаем {magicProbability(result.Pm)}%. В расчете используются полные значения, на экране числа округлены.</p>
            </details>
          </> : <div className="magic-empty"><strong>Проверь исходные значения</strong><p>{validationMessage}</p><p>Исправь отмеченные поля, и расчет появится автоматически.</p></div>}
          <p className="magic-model-note">Калькулятор считает по модели Кэрролла. Субъективные оценки на входе не превращаются в измеренную вероятность на выходе.</p>
        </div>
      </div>
    </div>
  </section>;
}

function GuideMagicProbability({ setRoute }) {
  return <article className="magic-guide">
    <GuideBreadcrumb setRoute={setRoute} title="формула магии" />
    <header className="magic-hero">
      <div className="magic-hero-main"><Eyebrow accent="var(--acid-green)">Памятка + калькулятор · 06.11.2026 · v.1</Eyebrow>
        <h1>ФОРМУЛА<br /><span>МАГИИ.</span></h1>
        <p>Как исходный шанс, гнозис, связь с целью и внутренние помехи складываются в вероятность результата.</p>
        <nav className="magic-hero-nav" aria-label="Разделы памятки"><a className="magic-primary-link" href="/guides/magic-probability/#magic-calculator">Рассчитать ↓</a><a href="/guides/magic-probability/#magic-formulas">Разобрать формулы ↗</a></nav>
      </div>
      <div className="magic-hero-diagram" aria-hidden="true"><div className="magic-kicker">МОДЕЛЬ ПИТЕРА КЭРРОЛЛА</div><div className="magic-diagram-line"><span>G · L · (1 − A) · (1 − R)</span><b>↓</b><strong>M</strong></div><div className="magic-diagram-result"><span>P</span><span>+</span><span>(1 − P) · M<sup>1/P</sup></span><b>= P<sub>m</sub></b></div><div className="magic-diagram-caption">Исходный шанс + вклад магии</div></div>
    </header>
    <div className="magic-content">
      <MagicCalculator />
      <section id="magic-formulas" className="magic-section guide-anchor" aria-labelledby="magic-formulas-title">
        <div className="magic-section-heading"><span className="magic-kicker">02 / Откуда берется число</span><h2 id="magic-formulas-title">ДВЕ ФОРМУЛЫ. ОДНА ЗАДАЧА.</h2></div>
        <div className="magic-formula-grid">
          <div className="magic-formula-block"><h3>СНАЧАЛА СИЛА МАГИИ</h3><MagicEquation /><p>Гнозис G и связь L входят напрямую. Фиксация A и сопротивление R вычитаются из единицы: чем они сильнее, тем меньше итоговый показатель M.</p><p>Здесь все перемножается. Если G или L равны нулю, либо A или R равны единице, M тоже равен нулю.</p><div className="magic-rule">M от 0 до 1. Это сила магического акта в модели, а не процент успеха.</div></div>
          <div className="magic-formula-block"><h3>ЗАТЕМ ВЕРОЯТНОСТЬ</h3><MagicEquation probability /><p>P обозначает исходный шанс. Часть (1 − P) остается на возможную прибавку. M<sup>1/P</sup> определяет, какая доля этой части добавится к P.</p><p>В формуле P записывается в долях: 25% = 0,25. Калькулятор сам переводит проценты в доли и результат обратно в проценты.</p><div className="magic-rule">Прибавка в процентных пунктах: (P<sub>m</sub> − P) × 100. Ее калькулятор показывает отдельно от итогового шанса.</div></div>
        </div>
      </section>
      <section id="magic-reading" className="magic-section magic-reading guide-anchor" aria-labelledby="magic-reading-title">
        <div className="magic-section-heading"><span className="magic-kicker">03 / Как читать результат</span><h2 id="magic-reading-title">СНАЧАЛА ПОДНИМИ P</h2></div>
        <div className="magic-takeaways"><div><span>01</span><h3>МАЛЫЙ ШАНС ТРУДНО СДВИНУТЬ</h3><p>Чем ниже P, тем больше степень 1/P. При 0 &lt; M &lt; 1 она подавляет прибавку. Поэтому высокий M еще не означает высокий шанс результата.</p></div><div><span>02</span><h3>ПРОВЕРЬ СВОИ ОЦЕНКИ</h3><p>Нет оснований для точного числа? Посчитай с более низкой и более высокой оценкой. Если итог сильно меняется, не привязывайся к одному проценту.</p></div><div><span>03</span><h3>ДЕЙСТВИЯ МЕНЯЮТ УСЛОВИЯ</h3><p>Навыки, подготовка, доступ к нужным людям и реальные шаги могут повысить исходный шанс. После них оцени P заново и пересчитай результат.</p></div></div>
        <div className="magic-boundaries"><strong>Границы модели</strong><p>При M = 0 итог равен P. При M = 1 и P &gt; 0 формула дает 100%. При P = 100% прибавка равна нулю. При P = 0 эта запись формулы не определена.</p></div>
      </section>
      <aside className="magic-source"><span className="magic-kicker">Источник</span><p>Питер Кэрролл, <a href="https://www.specularium.org/publications/liber-kaos" target="_blank" rel="noopener noreferrer"><i>Liber Kaos</i></a>. Здесь используется версия формул и обозначений из ролика. <a href="https://specularium.org/magic/the-dean-radin-pete-carroll-rap" target="_blank" rel="noopener noreferrer">Пояснение Кэрролла к формуле вероятности ↗</a>: в поздней записи он использует M = GLSB, а также отмечает трудность количественной оценки составляющих M.</p></aside>
    </div>
    <GuideFooterNav setRoute={setRoute} slug="magic-probability" />
  </article>;
}
