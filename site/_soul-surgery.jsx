const SOUL_SESSION_KEY = 'lr_soul_reading_v2';
const SOUL_BOOKMARK_KEY = 'lr_soul_bookmark_v2';
const soulValidLeaf = n => Number.isInteger(n) && n >= 1 && n <= SOUL_LEAVES.length;
const soulLeafFromHash = hash => SOUL_LEAVES.find(leaf => '#'+leaf.id === hash)?.number;

function soulReadSession() {
  let saved;
  try { saved = JSON.parse(sessionStorage.getItem(SOUL_SESSION_KEY)); } catch {}
  return {
    visited: Array.isArray(saved?.visited) ? [...new Set(saved.visited.filter(soulValidLeaf))] : [],
    chosen: SOUL_CASES.some(c=>c.leaf===saved?.chosen) ? saved.chosen : null,
    stamp: saved?.stamp === true,
    placed: SOUL_PROPS.map(p=>p[0]).filter(k=>Array.isArray(saved?.placed) && saved.placed.includes(k)),
  };
}

function SoulContents({compact=false}) {
  return <nav className={compact?'hz-chapter-jumps':'hz-contents'} aria-label={compact?'Разделы истории болезни':'Все 24 листа'}>
    {SOUL_CHAPTERS.filter(([first])=>!compact || first!==1).map(([first,last,title])=>
      compact
        ? <a key={first} href={soulHref(first)}><span>{title}</span><b>{soulNum(first)}{last!==first?'–'+soulNum(last):''}</b></a>
        : <div key={first}><p>{title}</p>{SOUL_LEAVES.slice(first-1,last).map(leaf=><a href={'#'+leaf.id} key={leaf.id}>
            <b>{soulNum(leaf.number)}</b><span>{leaf.title}</span></a>)}</div>)}
  </nav>;
}

function SoulCover({bookmark}) {
  return <div className="hz-cover">
    <div className="hz-cover-poster">
      <div className="hz-cover-copy"><p className="hz-eyebrow">ХОХМа · История болезни</p>
        <h1><span className="hz-sr">Хирурги души</span><img src={soulAsset('masthead-570700c6.webp')} alt="" width="1120" height="524"/></h1>
        <p className="hz-cover-sub">Хирургическое отделение хаос-магии</p>
        <p className="hz-cover-intro">Улыбку выдавил ты. Ярость проглотил тоже ты. В этом отделении у них разные лечащие врачи.</p>
        <div className="hz-buttons"><a className="hz-button" href={soulHref(2)}>Войти в приёмный покой</a>
          {bookmark>2 ? <a className="hz-underline" href={soulHref(bookmark)}>Продолжить с листа {soulNum(bookmark)}</a> : <a className="hz-underline" href={soulHref(21)}>Разобрать шкатулку</a>}</div>
      </div>
      <figure className="hz-cover-art"><img src={soulAsset('theatre-d242edb0.webp')} alt="Все пять Хирургов под круглой операционной лампой." width="940" height="898" fetchpriority="high"/>
        <figcaption><span>Ординаторская ХОХМы</span><b>18+</b></figcaption></figure>
    </div>
    <div className="hz-cover-index"><div><p className="hz-eyebrow">По главе Soul Surgery</p><h2>В истории болезни</h2>
      <p>24 листа от поступления до выписки. Можно читать по порядку или открыть любой раздел.</p></div><SoulContents compact/></div>
  </div>;
}

function SoulAdmission({stamp,onStamp}) {
  return <div className="hz-split">
    <div className="hz-prose">
      <p className="hz-lead">Талон к Хирургу души. Кабинет внутри тебя. При себе иметь себя.</p>
      <p>В 2008 году DKMU выпустили сборник <i lang="en">The Assault on Reality</i>. В четвёртой главе Дэмиен Хорайзонстар описал пятерых Хирургов. Каждому досталось то, что человек привык прятать от самого себя.</p>
      <p>У Мерси дежурная улыбка. У Круенти злость. Элиза ведает желанием, Nichego — телом. Мастер держит зеркало, в котором вся эта компания меняет смысл.</p>
      <p>Русский гайд устроен как история болезни. Сначала словарь и маршрут. Потом ординаторская. За ней операционная с двумя версиями Мессы, в конце — выписной лист.</p>
      <aside className="hz-source-note"><b>DKMU</b><p>Domus Kaotica и Marauder Underground, сеть магов хаоса. В том же кругу появилась Элис, Связующий сигил.</p></aside>
    </div>
    <div className="hz-admission-art"><figure className="hz-photo"><SoulImage file="staff-4d1f4bf5.webp" alt="Общий портрет Хирургов. Мастер с зеркалом стоит в середине." width="900" height="681"/><figcaption>Хирурги в сборе · рисунок из выписки</figcaption></figure>
      <div className="hz-ticket"><b>№ 23</b><div><small>Регистратура ХОХМы</small><strong>{stamp?'Принят в отделение':'Талон к Хирургу души'}</strong></div>
        <button className="hz-ticket-btn" type="button" onClick={onStamp} disabled={stamp}>{stamp?'Выдан':'Взять талон'}</button></div></div>
  </div>;
}

function SoulConsent() {
  return <div className="hz-split"><div className="hz-prose">
    <p className="hz-lead">«Распишитесь. Больно не будет». Под бланком улыбается именно Мерси. Ты уже примерно понимаешь, чего стоит его улыбка.</p>
    <p>Автор русского издания называет гайд вольным переводом и творческим пересказом. Это оккультный текст для взрослого читателя. Медицинских обещаний у этой истории нет.</p>
    <p>В исходной главе есть телесный ужас, риск потери сознания и самоповреждение. Автор главы оставляет ответственность практику. Русский составитель отдельно предупреждает об этих эпизодах и предлагает собственную «Мессу без крови».</p>
    <div className="hz-paper-note"><h3>Как устроена веб-версия</h3><p>Телесные эпизоды переданы как сцены на экране. Крест можно рассмотреть по точкам, шкатулку разобрать мышью или касанием. Все листы открываются прямо из оглавления.</p></div>
  </div><figure className="hz-photo hz-narrow-photo"><SoulImage file="orderly-aea0fca1.webp" width="490" height="536" alt="Улыбающийся Мерси с протянутой рукой на бланке согласия."/><figcaption>Markus Mercy · приём ведётся</figcaption></figure></div>;
}

function SoulRoster({chosen}) {
  return <><p className="hz-lead">С чем пришёл? Выбирай по тому, что в тебе зажато, спрятано или никак не даёт покоя.</p>
    <div className="hz-roster">{SOUL_CASES.map(c=><a key={c.leaf} href={soulHref(c.leaf)} style={{'--spot':c.ink}}>
      <SoulImage file={c.face} alt="" width="540" height="467"/><span className="hz-roster-label"><small>{c.sphere}</small><strong lang="en">{c.name}</strong></span>
      <span className="hz-roster-caption">{c.complaint}</span></a>)}</div>
    <p className="hz-marginal">{chosen ? 'В твоём талоне уже записан '+SOUL_CASES.find(c=>c.leaf===chosen).name+'.' : 'У каждого Хирурга два листа. На лицевой стороне портрет, на обороте карта с соответствиями и символами.'}</p>
  </>;
}

function SoulPortrait({entry,chosen,choose}) {
  return <div className="hz-case-grid" style={{'--spot':entry.ink}}>
    <div><SoulZoom file={entry.poster} label={'Увеличить портрет '+entry.name} alt={entry.look} className="hz-poster">
      <SoulImage file={entry.poster} alt={'Портретный лист из гайда. '+entry.look} width="760" height="1351"/><span>Увеличить плакат</span></SoulZoom></div>
    <div className="hz-prose"><p className="hz-case-tag">{entry.alias}</p><p className="hz-lead">{entry.domain}</p>
      <h3>Облик</h3><p>{entry.look}</p>
      <dl className="hz-facts"><div><dt>Сфера</dt><dd>{entry.sphere}</dd></div><div><dt>В банишинге</dt><dd>{entry.place} · {entry.title}</dd></div><div><dt>В Мессе</dt><dd>{entry.mass}</dd></div></dl>
      <div className="hz-buttons"><a className="hz-button" href={soulHref(entry.leaf+1)}>Перевернуть на оборот</a>
        <button type="button" className="hz-linkbutton" aria-pressed={chosen===entry.leaf} onClick={()=>choose(entry.leaf)}>{chosen===entry.leaf?'В твоём талоне':'Вписать в мой талон'}</button></div>
    </div></div>;
}

function SoulCaseFile({entry}) {
  const [exhibit,setExhibit]=React.useState('detail');
  return <div className="hz-file-grid" style={{'--spot':entry.ink}}>
    <div className="hz-file-drawings">
      <div className="hz-switch" role="group" aria-label="Рисунки в деле">
        <button type="button" aria-pressed={exhibit==='detail'} onClick={()=>setExhibit('detail')}>Крупный план</button>
        <button type="button" aria-pressed={exhibit==='symbol'} onClick={()=>setExhibit('symbol')}>Символ</button>
      </div>
      <figure className="hz-drawing"><SoulImage file={exhibit==='detail'?entry.detail:entry.symbol}
        alt={exhibit==='detail'?entry.detailText:entry.sign} width="390" height="440"/><figcaption>{exhibit==='detail'?entry.detailText:entry.sign}</figcaption></figure>
    </div><div className="hz-prose"><p className="hz-case-tag">{entry.sphere} · {entry.name}</p>
      <h3>Соответствия</h3><p>{entry.senses}</p><h3>Форма встречи</h3><p>{entry.form}</p>
      <h3>Как узнать</h3><p>{entry.encounter}</p><h3>Чему учит</h3><p>{entry.lesson}</p>
      <div className="hz-case-question"><small>Вопрос регистратуры</small><p>{entry.question}</p></div>
      <a href={soulHref(6)}>Ко всем пятерым</a></div>
  </div>;
}

function SoulDischarge({reading}) {
  const [note,setNote]=React.useState('');
  const c=SOUL_CASES.find(entry=>entry.leaf===reading.chosen);
  return <div className="hz-discharge"><div className="hz-prose">
    <p className="hz-lead">Консилиум закончен. Самые интересные графы Хорайзонстар оставил пустыми.</p>
    <h3>Чего в книге нет</h3><ul><li>Что делать после встречи и о чём спрашивать Хирурга.</li><li>Откуда взялись их имена.</li><li>Что автор вкладывал в SOI и в помету «Class C» в шапке главы.</li></ul>
    <p>Система дана как ориентир. В оригинале остаётся пространство между образом сущности и выводом того, кто на неё смотрит.</p>
    <aside className="hz-source-note"><b>Источник</b><p><i>The Assault on Reality: A Field Manual for the Strange Psyche.</i> Domus Kaotica &amp; Marauder Underground, 2008. Глава 4, <i>Soul Surgery</i>, Damien Horizonstar. Перевод и творческая сборка — «Лево руля!».</p></aside>
    <div className="hz-buttons"><a href="https://t.me/levorules/143" target="_blank" rel="noopener noreferrer">Пост автора</a>
      <a href="/uploads/soul-surgery-portraits.pdf" download="Хирурги души — пять портретов.pdf">Пять портретных листов · PDF</a></div>
  </div><div className="hz-discharge-form"><div className="hz-form-top"><span>ХОХМа / Форма 663/В</span><b>№ 23</b></div><h3>Выписной лист</h3>
    <dl className="hz-facts"><div><dt>Листов открыто</dt><dd>{reading.visited.length} из 24</dd></div><div><dt>Хирург в талоне</dt><dd>{c?c.name:'Графа свободна'}</dd></div>
      <div><dt>Предметы на столе</dt><dd>{SOUL_PROPS.filter(([id])=>reading.placed.includes(id)).map(p=>p[1]).join(', ') || 'Стол пуст'}</dd></div></dl>
    {c && <p className="hz-personal-question">{c.question}</p>}
    <label htmlFor="hz-own-question">С каким вопросом уходишь?</label>
    <textarea id="hz-own-question" rows="3" maxLength="280" placeholder="Можно оставить пустым" value={note} onChange={e=>setNote(e.target.value)}/>
    <p className="hz-print-note">{note || ' '}</p><small className="hz-note-help">Твой текст попадёт в распечатку. После обновления страницы поле очистится.</small>
    <button type="button" className="hz-button" onClick={()=>window.print()}>Распечатать выписку</button>
  </div></div>;
}

function SoulLeafBody({number,reading,update,bookmark}) {
  if(number>=7 && number<=16) {
    const entry=SOUL_CASES[Math.floor((number-7)/2)];
    return number%2 ? <SoulPortrait entry={entry} chosen={reading.chosen} choose={n=>update(prev=>({...prev,chosen:n}))}/> : <SoulCaseFile entry={entry}/>;
  }
  switch(number) {
    case 1: return <SoulCover bookmark={bookmark}/>;
    case 2: return <SoulAdmission stamp={reading.stamp} onStamp={()=>update(prev=>({...prev,stamp:true}))}/>;
    case 3: return <SoulConsent/>;
    case 4: return <><p className="hz-lead">Двенадцать слов, которые понадобятся в отделении. Открой термин, чтобы увидеть его значение и место в гайде.</p><SoulGlossary/></>;
    case 5: return <><p className="hz-lead">Готового сценария вызова в главе нет. Семь остановок собраны в русском гайде из подсказок самого гримуара.</p><SoulRouteMap/></>;
    case 6: return <SoulRoster chosen={reading.chosen}/>;
    case 17: return <><p className="hz-lead">Банишинг Хирурга начинается с креста. Рассмотри пять точек рисунка из книги, прежде чем встать в его воображаемый центр.</p><SoulCross/></>;
    case 18: return <><p className="hz-lead">Мастер появляется первым. Четверо остальных занимают места вокруг тебя. Выбери сторону схемы, чтобы увидеть, кто там стоит.</p><SoulCompass/></>;
    case 19: return <><p className="hz-lead">Сам банишинг уже завершён. Если он был частью более крупного ритуала, в книге вся работа закрывается пятиконечной звездой.</p><SoulStar/>
      <details className="hz-fold"><summary>Заметка на полях</summary><p>Составитель сравнивает устройство сцены с Малым ритуалом пентаграммы. В обоих есть крест и фигуры вокруг человека. Здесь места вокруг центра занимают четыре Хирурга.</p></details></>;
    case 20: return <div className="hz-split"><div className="hz-prose"><p className="hz-lead">Одна пустая комната. В середине шкатулка, которую можно разобрать. Пятеро Хирургов получают по сцене.</p>
      <p>Это большой ритуал главы. В центре — чередование «решена / не решена». По мере того как у коробки отделяются части, меняются персонаж, голос и переживание. Последним приходит Мастер с вопросом о том, что вообще можно считать коробкой.</p>
      <p>В оригинальной Мессе присутствуют кровь и самоповреждение. Хорайзонстар оставляет тексты обращений и мантр самому практику. Веб-постановка передаёт последовательность персонажей через разбор изображения.</p>
      <p className="hz-paper-note">Шкатулка и связка наслаждения с болью напоминают «Восставшего из ада». В русском гайде это замечание на полях. Сам Хорайзонстар фильм не упоминает.</p><a href={soulHref(21)}>Открыть шкатулку</a>
    </div><figure className="hz-photo"><SoulImage file="box-48a58134.webp" alt="Деревянная шкатулка-головоломка. Рука вытягивает узкую планку." width="766" height="518"/><figcaption>Месса Кошмара · рисунок из гайда</figcaption></figure></div>;
    case 21: return <><p className="hz-lead">Порядок в Мессе отличается от порядка в ординаторской. Начинает Круенти. Дальше коробка сама покажет, чья очередь.</p><SoulBox/></>;
    case 22: return <><p className="hz-lead">У русского гайда есть вторая постановка. Шкатулка и роли остаются, а три детали переписаны. Переключи редакцию, чтобы прочитать обе версии.</p><SoulComparison/>
      <p className="hz-paper-note">Общие элементы двух версий — одиночество, пустая комната, шкатулка, очерёдность пятерых, голоса, две мантры, принцип «ни то, ни другое», стакан и финал с Мастером.</p></>;
    case 23: return <><p className="hz-lead">На бумажном столе каждому Хирургу соответствует свой предмет из версии без крови. Расставь предметы. То, что останется на столе, попадёт в твою выписку.</p>
      <SoulTable placed={reading.placed} setPlaced={fn=>update(prev=>({...prev,placed:fn(prev.placed)}))}/>
      <details className="hz-fold"><summary>Ремарки к началу и финалу</summary><p>Пролог начинается со шкатулки и противоположности «решена / не решена». Затем идут Круенти, Мерси, Nichego и Элиза. Мастер в зеркале завершает этот ряд. В русском тексте громкость его голоса меняется, как меняются два взгляда на одну коробку.</p>
        <p>После Мастера остаются ещё две части — пик с формулой намерения и вращение, которое в этой версии обрывается остановкой. Выписка возвращает историю к отдыху, еде и обычным делам.</p></details></>;
    case 24: return <SoulDischarge reading={reading}/>;
  }
}

function SoulSurgeryGuide() {
  const [number,setNumber]=React.useState(()=>soulLeafFromHash(location.hash)||1);
  const [reading,setReading]=React.useState(soulReadSession);
  const [bookmark,setBookmark]=React.useState(()=>{
    try { const n=Number(localStorage.getItem(SOUL_BOOKMARK_KEY)); return soulValidLeaf(n)?n:1; } catch { return 1; }
  });
  const [ready,setReady]=React.useState(false);
  const contents=React.useRef(null);
  const container=React.useRef(null);

  React.useEffect(()=>{
    setReady(true);
    const sync=()=>setNumber(soulLeafFromHash(location.hash)||1);
    const close=e=>{if(e.key==='Escape' && contents.current?.open) {contents.current.open=false;contents.current.querySelector('summary').focus();}};
    const outside=e=>{if(contents.current?.open && !contents.current.contains(e.target)) contents.current.open=false;};
    window.addEventListener('hashchange',sync); window.addEventListener('popstate',sync);
    document.addEventListener('keydown',close); document.addEventListener('pointerdown',outside);
    return ()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);};
  },[]);
  React.useEffect(()=>{
    if(!ready) return;
    setReading(prev=>prev.visited.includes(number)?prev:{...prev,visited:[...prev.visited,number]});
    if(number>1) {
      setBookmark(number);
      try { localStorage.setItem(SOUL_BOOKMARK_KEY,String(number)); } catch {}
    }
    if(!soulLeafFromHash(location.hash)) return;
    const frame=requestAnimationFrame(()=>{
      const page=container.current?.querySelector('.hz-sheet.is-open');
      if(page) {page.scrollIntoView({block:'start',behavior:'instant'});page.querySelector('.hz-sheet-title')?.focus({preventScroll:true});}
    });
    return ()=>cancelAnimationFrame(frame);
  },[number,ready]);
  React.useEffect(()=>{
    if(ready) {try {sessionStorage.setItem(SOUL_SESSION_KEY,JSON.stringify(reading));} catch {}}
  },[reading,ready]);
  function follow(event) {
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link=event.target.closest?.('a[href^="#soul-"]');
    const next=link && soulLeafFromHash(link.getAttribute('href'));
    if(next) {if(contents.current) contents.current.open=false;setNumber(next);}
  }
  return <article className="hz-zine" ref={container} data-enhanced={ready?'true':undefined} onClick={follow}>
    <div className="hz-rail"><div className="hz-rail-inner">
      <div className="hz-crumb"><a href="/guides/">Все гайды</a><span>/</span><strong>Хирурги души</strong></div>
      <div className="hz-tools"><span className="hz-counter">{soulNum(number)} <i>/</i> 24</span>
        <details className="hz-toc" ref={contents}><summary>Оглавление</summary><SoulContents/></details></div>
    </div></div>
    {SOUL_LEAVES.map(leaf=>{
      const n=leaf.number,chapter=soulChapter(n);
      const dark=[4,6,17,18,19,21,23].includes(n) || (n>=7 && n<=15 && n%2===1);
      const entry=n>=7&&n<=16?SOUL_CASES[Math.floor((n-7)/2)]:null;
      return <section key={leaf.id} id={leaf.id} data-leaf={n} aria-label={soulNum(n)+' · '+leaf.title}
        className={'hz-sheet'+(n===number?' is-open':'')+(n===1?' hz-front':'')+(dark?' hz-dark':'')} style={entry?{'--spot':entry.ink}:undefined}>
        {n!==1 && <header className="hz-pagehead"><div><p className="hz-eyebrow">{chapter[2]} · лист {soulNum(n)}</p>
          <h2 className="hz-sheet-title" tabIndex="-1">{leaf.title}</h2></div><span className="hz-folio" aria-hidden="true">{soulNum(n)}</span></header>}
        <SoulLeafBody number={n} reading={reading} update={setReading} bookmark={bookmark}/>
        {SOUL_FACSIMILES[n] && <div className="hz-facsimile"><SoulZoom file={SOUL_FACSIMILES[n]} label={'Печатный оригинал листа '+soulNum(n)} alt={'Лист '+soulNum(n)+' русского издания. '+leaf.title+'.'}>
          Рассмотреть печатный лист {soulNum(n)}</SoulZoom></div>}
        <nav className="hz-turn" aria-label={'Перелистать лист '+soulNum(n)}>
          {n>1?<a className="hz-prev" rel="prev" href={soulHref(n-1)}>Предыдущий лист</a>:<span/>}
          <span className="hz-pagecount">{soulNum(n)} / 24</span>
          <a className="hz-next" rel={n<24?'next':undefined} href={soulHref(n<24?n+1:1)}>{n<24?SOUL_LEAVES[n].title:'На обложку'}</a>
        </nav>
      </section>;
    })}
  </article>;
}

window.LRSoulSurgery = SoulSurgeryGuide;
