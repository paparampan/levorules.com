// «Хирурги души» — the five colours of the cover open the same files as the intake list.
const SOUL_MEDIA = '/media/soul-surgery/';
const SOUL_CASES = [
  {
    id: 'mercy', name: 'Markus Mercy', field: 'Притворство', complaint: 'Улыбаюсь через силу',
    color: '#d7ed27', portrait: 'mercy-e28125a1.webp', layer: '26%',
    alt: 'Маркус Мерси с полуулыбкой. От висков за спину тянутся тонкие проволоки.',
    byname: 'Насмешка', sign: 'Пламя, осколки зеркала',
    text: 'На вечеринке ты ещё смеёшься, а в голове уже едешь домой. Мерси ведает чувствами, которые приходится из себя выжимать. На лице у него та самая учтивая улыбка.',
    question: 'Кому досталась твоя последняя дежурная улыбка? Что хотелось сделать вместо этого?',
  },
  {
    id: 'cruenti', name: 'Cruenti Niveus', field: 'Ярость', complaint: 'Киплю, но молчу',
    color: '#ff525d', portrait: 'cruenti-930cf3eb.webp', layer: '41%',
    alt: 'Крупное лицо Круенти. Внизу виден красно-белый шахматный узор.',
    byname: 'Красно-Белый', sign: 'Цепь',
    text: 'У Круенти два лица. Второе пришито к затылку и передразнивает первое. Ему знаком момент, когда собеседник уже положил трубку, а ты наконец нашёл для него слова.',
    question: 'Как прозвучала бы фраза, которую ты тогда проглотил?',
  },
  {
    id: 'blutenfrau', name: 'Blutenfrau', field: 'Желание', complaint: 'Хочу ещё. Опять',
    color: '#ff579d', portrait: 'blutenfrau-87f46cb1.webp', layer: '55%',
    alt: 'Кровавая Элиза касается пальцем опутанных нитью губ.',
    byname: 'Кровавая Элиза', sign: 'Проволока',
    text: 'Губы Элизы обмотаны алой нитью. По спине вместо волос спускается проволока. Она появляется в коротком промежутке между «хочу ещё» и рукой, которая уже сама потянулась за привычным.',
    question: 'Когда твоё «хочу» в первый раз прозвучало как «мне надо»?',
  },
  {
    id: 'nichego', name: 'Nichego', field: 'Ощущение', complaint: 'Помню прикосновение',
    color: '#ff9945', portrait: 'nichego-a5cfdf35.webp', layer: '70%',
    alt: 'Nichego склонил голову набок. Лицо напоминает тёмную растрескавшуюся маску.',
    byname: 'Имени нет', sign: 'Тьма, открытая рана',
    text: 'Остальные Хирурги могут назвать то, за что отвечают. Nichego говорить не умеет. В главе Хорайзонстара его ответ узнают по прикосновению. Да, имя читается именно так, как тебе послышалось.',
    question: 'Какими словами ты опишешь прикосновение, если придётся обойтись без слова «чувствую»?',
  },
  {
    id: 'master', name: 'The Poenaplaceunque', field: 'Восприятие', complaint: 'Всё зависит от угла',
    color: '#41d8f0', portrait: 'master-70ad7e91.webp', layer: '84%',
    alt: 'Белое лицо Мастера. Синяя четверть маски окружает алый глаз.',
    byname: 'Мастер над четырьмя', sign: 'Зеркало',
    text: 'В руке у Мастера зеркало. Один глаз у него красный, другой чёрный. Рай и ад в его ведении вполне могут занимать одну комнату. Кто в неё смотрит — вот что его занимает.',
    question: 'Кто рассказал бы ту же историю совсем иначе?',
  },
];

function soulCaseFromHash() {
  return SOUL_CASES.find(entry => '#soul-' + entry.id === location.hash)?.id || null;
}

function SoulSurgeryGuide() {
  const [active, setActive] = React.useState(() => soulCaseFromHash() || SOUL_CASES[0].id);
  const [interactive, setInteractive] = React.useState(false);

  React.useEffect(() => {
    setInteractive(true);
    const sync = () => setActive(soulCaseFromHash() || SOUL_CASES[0].id);
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const select = (event, entry) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      setActive(entry.id);
    }
  };

  return (
    <article className="ss-guide" data-interactive={interactive ? 'true' : undefined}>
      <section className="ss-hero" aria-labelledby="ss-title">
        <div className="ss-wrap">
          <div className="ss-mast">
            <nav aria-label="Хлебные крошки" className="ss-crumb"><a href="/guides/">Все гайды</a><span aria-hidden="true">/</span><span>ХОХМа</span></nav>
            <div className="ss-edition">PDF · 24 страницы <span className="ss-age">18+</span></div>
          </div>
          <div className="ss-hero-grid">
            <div className="ss-intro">
              <p className="ss-kicker ss-department">Хирургическое отделение хаос-магии</p>
              <h1 id="ss-title"><span className="ss-sr">Хирурги души</span><img src={SOUL_MEDIA + 'masthead-570700c6.webp'} width="1120" height="524" alt="" /></h1>
              <p className="ss-lede">Ты улыбаешься человеку, которого терпеть не можешь. Улыбкой заведует один Хирург. Тем, что за ней, — другой.</p>
              <div className="ss-actions">
                <a className="ss-take" href="#soul-intake"><span className="ss-take-number">№ 23</span><span>Взять талон</span></a>
                <a className="ss-textlink" href="#soul-edition">Об издании</a>
              </div>
            </div>
            <figure className="ss-film">
              <div className="ss-film-head"><span>ХОХМа / Ординаторская</span><span className="ss-film-holes" aria-hidden="true" /></div>
              <div className="ss-film-image">
                <picture>
                  <source media="(max-width: 520px)" srcSet={SOUL_MEDIA + 'film-small-922436a5.webp'} />
                  <img src={SOUL_MEDIA + 'film-814f6202.webp'} alt="На одной стороне лица закрыт глаз. На другой бумага разорвана и видны пять цветных слоёв." width="904" height="873" fetchpriority="high" />
                </picture>
                {SOUL_CASES.map((entry, index) => (
                  <a key={entry.id} href={'#soul-' + entry.id} className="ss-layer"
                    style={{'--layer': entry.layer, '--ink': entry.color}}
                    onClick={event => select(event, entry)}
                    aria-label={'Открыть карту ' + entry.name + ' — ' + entry.field}>
                    <span className="ss-layer-name">{entry.field}</span><b aria-hidden="true">{String(index + 1).padStart(2, '0')}</b>
                  </a>
                ))}
              </div>
              <figcaption><span className="ss-register" aria-hidden="true" />Выбери цветной слой на снимке.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="ss-intake" id="soul-intake" aria-labelledby="ss-intake-title">
        <div className="ss-wrap">
          <div className="ss-intake-head">
            <div><p className="ss-kicker ss-ink-red">Приёмный покой</p><h2 id="ss-intake-title">С чем пришёл?</h2></div>
            <p className="ss-margin-note">При себе иметь<span>себя.</span></p>
          </div>
          <div className="ss-registry">
            <nav className="ss-choices" aria-label="Выбрать состояние">
              {SOUL_CASES.map((entry, index) => (
                <a key={entry.id} className="ss-choice" href={'#soul-' + entry.id}
                  aria-current={interactive && active === entry.id ? 'true' : undefined}
                  style={{'--ink': entry.color}} onClick={event => select(event, entry)}>
                  <span className="ss-choice-index">{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{entry.complaint}</strong><small>{entry.field}</small></span>
                  <span className="ss-choice-mark" aria-hidden="true" />
                </a>
              ))}
            </nav>
            <div className="ss-files">
              {SOUL_CASES.map((entry, index) => (
                <article key={entry.id} id={'soul-' + entry.id} className={'ss-file' + (active === entry.id ? ' ss-active' : '')}
                  tabIndex="-1" aria-labelledby={'ss-name-' + entry.id} style={{'--ink': entry.color}}>
                  <div className="ss-file-bar"><span>Карта Хирурга</span><span>{String(index + 1).padStart(2, '0')} / 05</span></div>
                  <div className="ss-file-main">
                    <figure className="ss-portrait">
                      <img loading="lazy" src={SOUL_MEDIA + entry.portrait} alt={entry.alt} width="540" height="467" />
                      <figcaption>{entry.byname}</figcaption>
                    </figure>
                    <div className="ss-file-copy">
                      <h3 id={'ss-name-' + entry.id} lang="en">{entry.id === 'master' ? <>The Poena<wbr/>place<wbr/>unque</> : entry.name}</h3>
                      <p>{entry.text}</p>
                      <dl><dt>Символ</dt><dd>{entry.sign}</dd></dl>
                    </div>
                  </div>
                  <div className="ss-slip">
                    <div className="ss-slip-stub"><span>Талон</span><b>23</b><i className="ss-barcode" aria-hidden="true" /></div>
                    <div className="ss-slip-note">
                      <p className="ss-slip-label">Вопрос регистратуры</p>
                      <p className="ss-slip-question">{entry.question}</p>
                      <span className="ss-print-credit">ХОХМа · {entry.name} · Лево руля!</span>
                      {interactive && <button type="button" onClick={() => window.print()}>Распечатать талон</button>}
                    </div>
                  </div>
                  <a className="ss-again" href="#soul-intake">Выбрать другого Хирурга</a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ss-colophon" id="soul-edition" aria-labelledby="ss-colophon-title">
        <div className="ss-wrap ss-colophon-inner">
          <div className="ss-book"><img src={SOUL_MEDIA + 'cover-abd4ba54.webp'} alt="Обложка гайда «Хирурги души» с пятью фигурами под операционной лампой." width="316" height="562" loading="lazy" /></div>
          <div className="ss-colophon-copy">
            <p className="ss-kicker">Лево руля! / Издание на русском</p>
            <h2 id="ss-colophon-title">Выписка</h2>
            <p>В 2008 году DKMU выпустили <i lang="en">The Assault on Reality</i>. В главе <i lang="en">Soul Surgery</i> Дэмиен Хорайзонстар описал пятерых Хирургов. А вот о чём с ними разговаривать, оставил решать тебе.</p>
            <p>«Хирурги души» — вольный перевод и творческий пересказ главы на 24 страницах. Внутри словарь, карты пятерых, Банишинг Хирурга и Месса Кошмара. В русском гайде есть ещё и «Месса без крови».</p>
            <div className="ss-edition-links">
              <a className="ss-download" href="/uploads/soul-surgery-portraits.pdf" download="Хирурги души — пять портретов.pdf">Скачать пять портретов <span>PDF</span></a>
              <a className="ss-textlink" href="https://t.me/levorules/143" target="_blank" rel="noopener noreferrer">Пост автора в Telegram</a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
