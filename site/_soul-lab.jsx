function SoulImage({file, alt, ...props}) {
  return <img src={soulAsset(file)} alt={alt} loading="lazy" decoding="async" {...props}/>;
}

function SoulZoom({file, label, alt, className, children}) {
  const dialog=React.useRef(null);
  const [viewed,setViewed]=React.useState(false);
  return <><a className={className} href={soulAsset(file)} target="_blank" rel="noopener" aria-label={label}
    onClick={e=>{
      if(e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !dialog.current?.showModal) return;
      e.preventDefault();setViewed(true);dialog.current.showModal();
    }}>{children}</a>
    <dialog ref={dialog} className="hz-zoom" aria-label={label} onClick={e=>{if(e.target===dialog.current) dialog.current.close();}}>
      <button type="button" onClick={()=>dialog.current.close()}>Закрыть лист</button>
      {viewed && <SoulImage file={file} alt={alt} width="760" height="1351"/>}
    </dialog></>;
}

function SoulGlossary() {
  const [query, setQuery] = React.useState('');
  const clean = s => s.toLocaleLowerCase('ru').replaceAll('ё','е');
  const results = SOUL_TERMS.filter(([name, text]) => clean(name + ' ' + text).includes(clean(query.trim())));
  return <>
    <div className="hz-search"><label htmlFor="hz-term">Найти в словаре</label><div>
      <input id="hz-term" type="search" value={query} placeholder="Например, гнозис" onChange={e=>setQuery(e.target.value)}/>
      {query && <button type="button" onClick={()=>setQuery('')}>Сбросить</button>}
    </div><small role="status">Найдено {results.length} из {SOUL_TERMS.length}</small></div>
    <div className="hz-terms">{results.map(([name,text,leaf]) => <details key={name}>
      <summary>{name}</summary><p>{text}</p><a href={soulHref(leaf)}>В гайде · лист {soulNum(leaf)}</a>
    </details>)}</div>
    {results.length === 0 && <p>Такого термина нет. Попробуй часть слова или сбрось поиск.</p>}
  </>;
}

function SoulRouteMap() {
  const [point,setPoint] = React.useState(0);
  const [name,description,leaf] = SOUL_ROUTE[point];
  return <div className="hz-route-map">
    <div className="hz-stops" role="group" aria-label="Семь пунктов маршрута">{SOUL_ROUTE.map(([title],i)=>
      <button type="button" aria-pressed={i===point} key={title} onClick={()=>setPoint(i)}>
        <b>{soulNum(i+1)}</b><span>{title}</span></button>)}</div>
    <div className="hz-route-note" aria-live="polite"><p className="hz-eyebrow">Маршрутный лист · {point+1} / 7</p>
      <h3>{name}</h3><p>{description}</p><a href={soulHref(leaf)}>Открыть связанный лист {soulNum(leaf)}</a>
    </div>
    <noscript><ol>{SOUL_ROUTE.map(([t,d])=><li key={t}><b>{t}.</b> {d}</li>)}</ol></noscript>
  </div>;
}

const SOUL_CROSS = [
  ['Во мне','Середина','Отсюда начинается схема. Остальные точки получают смысл относительно центра.',50,50],
  ['Всё Наслаждение','Верх','Первая крайняя точка задаёт верхнюю половину вертикали.',50,12],
  ['Вся Боль','Низ','Противоположный полюс замыкает вертикаль.',50,88],
  ['Всё Выражение','Один конец перекладины','На горизонтали появляется то, что получает выражение вовне.',13,44],
  ['Всё Сдерживание','Другой конец перекладины','У выражения есть противовес. Вместе они держат горизонталь.',87,44],
];

function SoulCross() {
  const [point,setPoint] = React.useState(0);
  return <div className="hz-exhibit">
    <div className="hz-cross-diagram">
      <SoulImage file="cross-plate-efaded5b.webp" width="640" height="433" alt="Рисунок скелета с раскинутыми руками и двумя осями Креста."/>
      {SOUL_CROSS.map(([name,, ,x,y],i)=><button key={name} type="button" style={{left:x+'%',top:y+'%'}}
        aria-label={name} aria-pressed={point===i} onClick={()=>setPoint(i)}>{i+1}</button>)}
    </div>
    <div className="hz-caption" aria-live="polite"><p className="hz-eyebrow">{SOUL_CROSS[point][1]}</p>
      <h3>{SOUL_CROSS[point][0]}</h3><p>{SOUL_CROSS[point][2]}</p>
      <p>Обе оси сходятся на словах «Ибо Я есть Плоть». В оригинале здесь описан телесный переход. В этой схеме его место занимает центр рисунка.</p>
    </div>
  </div>;
}

const SOUL_SIDES = [[1,'front'],[3,'left'],[2,'right'],[0,'back']];
function SoulCompass() {
  const [selected,setSelected] = React.useState(1);
  const entry = SOUL_CASES[selected];
  return <>
    <div className="hz-exhibit"><div className="hz-compass" role="group" aria-label="Четыре стороны вокруг читателя">
      <span className="hz-compass-axis" aria-hidden="true"/><span className="hz-center">Ты</span>
      {SOUL_SIDES.map(([idx,side]) => <button type="button" key={side} className={'hz-side hz-side-'+side}
        style={{'--spot':SOUL_CASES[idx].ink}} aria-label={SOUL_CASES[idx].place+' — '+SOUL_CASES[idx].name}
        aria-pressed={idx===selected} onClick={()=>setSelected(idx)}>
        <SoulImage file={SOUL_CASES[idx].face} alt="" width="70" height="62"/><span>{SOUL_CASES[idx].place}</span>
      </button>)}
    </div><div className="hz-caption" aria-live="polite">
      <p className="hz-eyebrow">{entry.place} · {entry.title}</p><h3 lang="en">{entry.name}</h3>
      <p>{entry.domain}</p><a href={soulHref(entry.leaf+1)}>Открыть карту · {soulNum(entry.leaf+1)}</a>
    </div></div>
    <details className="hz-fold"><summary>Пять титулов Мастера</summary><p>До четырёх сторон в тексте звучат пять имён одного Мастера. Владыка Восприятия. Он от Мира. Мастер Восприятия. Наслаждение и Боль. Poenaplaceunque.</p></details>
    <noscript><p>Спереди Круенти — Страсть. Позади Мерси — Сдержанность. Справа Элиза — Желание. Слева Nichego — Ощущение.</p></noscript>
  </>;
}

const SOUL_STAR_WORDS = ['Желание','Порыв','Страсть','Разум','Ибо Ты есть Плоть'];
const SOUL_STAR_POINTS = [[50,9],[23,88],[91,39],[9,39],[77,88],[50,9]];
function SoulStar() {
  const [lines,setLines] = React.useState(0);
  return <div className="hz-exhibit"><div className="hz-star-frame"><div className="hz-star" aria-hidden="true">
    {SOUL_STAR_WORDS.map((word,i)=>{
      const [x,y]=SOUL_STAR_POINTS[i], [tx,ty]=SOUL_STAR_POINTS[i+1];
      return <i className={i<lines?'hz-drawn':''} key={word} style={{left:x+'%',top:y+'%',width:Math.hypot(tx-x,ty-y)+'%',transform:'rotate('+Math.atan2(ty-y,tx-x)+'rad)'}}/>;
    })}
    {SOUL_STAR_POINTS.slice(0,5).map(([x,y],i)=><b key={i} style={{left:x+'%',top:y+'%'}}>{i+1}</b>)}
  </div></div><div className="hz-caption"><p className="hz-eyebrow">Закрытие · {lines} / 5 линий</p>
    <h3 aria-live="polite">{lines ? SOUL_STAR_WORDS[lines-1] : 'Ты есть'}</h3>
    <p>{lines===5 ? 'Контур замкнут. Последнее слово в тексте — «Аминь». На этом заканчивается большая работа, в которую входил банишинг.' : 'Проведи линию на бумаге. Каждая сторона звезды открывает следующее слово формулы.'}</p>
    <button type="button" className="hz-button" onClick={()=>setLines(lines===5 ? 0 : lines+1)}>{lines===5?'Начертить заново':'Провести линию '+(lines+1)}</button>
  </div><noscript><p>{SOUL_STAR_WORDS.join(' · ')}. Финал — «Аминь».</p></noscript></div>;
}

const SOUL_BOX_ORDER = [1,0,3,2,4];
const SOUL_BOX_NOTES = [
  'Первым в тексте появляется Красно-Белый. Его глубокий голос и ярость дают сцене начальный вес.',
  'Вторым идёт Мерси. После открытой страсти Круенти появляется вынужденное чувство, которое приходится изображать.',
  'Третья часть принадлежит Nichego. Роль остаётся немой. Здесь история на мгновение переходит от речи к ощущению.',
  'Четвёртой в Мессе идёт Элиза. Её реплика задумана мягкой и свободной. С ней на сцену выходит желание.',
  'Шкатулка раскрыта. У Мастера сходятся два образа — «коробка» и «не коробка». В этой точке глава оставляет место формуле намерения, SOI.',
];
function SoulBox() {
  const [open,setOpen] = React.useState(0);
  const entry=SOUL_CASES[SOUL_BOX_ORDER[Math.max(0,open-1)]];
  return <div className="hz-exhibit">
    <div className="hz-box-scene" aria-hidden="true">
      <div className="hz-box-face" style={{'--spot':entry.ink}}><SoulImage file={entry.face} alt="" width="300" height="260"/><strong>{entry.name}</strong></div>
      {[0,1,2,3,4].map(i=><i key={i} className={'hz-box-strip'+(i<open?' hz-out':'')} style={{top:i*20+'%',backgroundPosition:'center '+i*25+'%'}}/>)}
    </div>
    <div className="hz-caption"><p className="hz-eyebrow">Шкатулка · {open} / 5</p>
      <div aria-live="polite"><h3>{open ? entry.name : 'Крышка закрыта'}</h3>
        <p>{open ? SOUL_BOX_NOTES[open-1] : 'Разбери изображение по одной планке. Под каждой появляется Хирург, которому в этой части Мессы принадлежит сцена.'}</p></div>
      <div className="hz-buttons"><button type="button" className="hz-button" onClick={()=>setOpen(open===5?0:open+1)}>{open===5?'Собрать шкатулку':'Сдвинуть планку'}</button>
        {open>0 && open<5 && <button type="button" className="hz-linkbutton" onClick={()=>setOpen(open-1)}>Вернуть одну</button>}</div>
    </div>
    <noscript><ol>{SOUL_BOX_NOTES.map(x=><li key={x}>{x}</li>)}</ol></noscript>
  </div>;
}

const SOUL_SUBSTITUTIONS = [
  ['Телесная отметина','Надрез как знак встречи с Хирургом.','Ощущение или символ из карты Хирурга.'],
  ['Красное в стакане','Кровь связывает части исходной Мессы.','Цвет сохраняется. В русском гайде перечислены вино, гранатовый и вишнёвый сок.'],
  ['Граница сцены','Телесное истощение и рвота отмечают предел в исходном тексте.','В переработке предел становится моментом остановки.'],
];
function SoulComparison() {
  const [edition,setEdition]=React.useState(1);
  return <div className="hz-comparison">
    <div className="hz-switch" role="group" aria-label="Слой текста">{['Текст Хорайзонстара','Русская версия'].map((t,i)=><button key={t} type="button" aria-pressed={edition===i} onClick={()=>setEdition(i)}>{t}</button>)}</div>
    <dl aria-live="polite">{SOUL_SUBSTITUTIONS.map(([title,from,to])=><div key={title}><dt>{title}</dt><dd>{edition ? to : from}</dd></div>)}</dl>
    <noscript><p>Исходная глава описывает самоповреждение. В авторской переработке его место занимают цвет, ощущение и возможность остановить сцену.</p></noscript>
  </div>;
}

const SOUL_PROPS = [
  ['ice','Лёд','Круенти','Холод на столе отсылает к крайностям в карте Красно-Белого.'],
  ['milk','Стакан кефира','Мерси','Тёплый кислый вкус приходит из перечня соответствий Мерси.'],
  ['cloth','Повязка','Nichego','Ткань и тишина передают отсутствие ощущения. Ответ этой фигуры в книге остаётся бессловесным.'],
  ['cup','Привычная чашка','Элиза','Предмет привычки даёт желанию видимый контур. На этом столе его изображает чашка кофе.'],
  ['mirror','Зеркало','Мастер','В последней позиции возникает отражение. Мастер возвращает вопрос к тому, кто смотрит.'],
];
function SoulTable({placed,setPlaced}) {
  const [inspected,setInspected]=React.useState(null);
  function move(key) {
    setInspected(key);
    setPlaced(previous=>previous.includes(key) ? previous.filter(id=>id!==key) : [...previous,key]);
  }
  const item=SOUL_PROPS.find(([key])=>key===inspected);
  return <div className="hz-table-lab">
    <div className="hz-table-tray" role="group" aria-label="Предметы дневного стационара">{SOUL_PROPS.map(([key,name,who])=><button key={key} type="button" onClick={()=>move(key)} aria-pressed={placed.includes(key)}>
      <strong>{name}</strong><small>{who}</small></button>)}</div>
    <div className="hz-tabletop" aria-label="Предметы на бумажном столе">{SOUL_PROPS.map(([key,name])=><div key={key} className={'hz-slot'+(placed.includes(key)?' hz-occupied':'')}>
      {placed.includes(key) && <i className={'hz-prop hz-prop-'+key} aria-hidden="true"/>}
      <small>{placed.includes(key)?name:'·'}</small></div>)}</div>
    <div className="hz-table-result" aria-live="polite"><b>{placed.length} / 5</b>
      <p>{placed.length===5 ? 'Все пятеро представлены. В финале русской версии звучит намерение, затем идут остановка, отдых и возвращение к обычным делам.' : item ? item[3] : 'Выбери предмет. Он переместится на стол и откроет свою роль. Повторное нажатие уберёт его обратно.'}</p></div>
    <noscript><dl>{SOUL_PROPS.map(([,name,who,desc])=><div key={who}><dt>{who} · {name}</dt><dd>{desc}</dd></div>)}</dl></noscript>
  </div>;
}
