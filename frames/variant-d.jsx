// VARIANT D — "Vertical split · living room"
// Left fixed "altar" rail (logo + manifesto + CTA, always visible)
// Right scrolling stream: chapters, course as hero, video gallery, TG.
// Non-standard navigation via cipher anchors.

function VariantD() {
  const W = 780;
  return (
    <div style={{ width: W, background: WF.void, color: WF.bone, position: 'relative', display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 1400 }}>

      {/* LEFT ALTAR RAIL — fixed */}
      <div style={{ padding: 24, borderRight: `1px solid ${WF.border}`, background: WF.ash2, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, border: `1px solid ${WF.blood}`, color: WF.blood, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: 14 }}>P</div>
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>ЛЕВО<br/>РУЛЯ</div>
        </div>
        <div style={{ height: 28 }} />
        <Scribble size={9} accent={WF.boneDim}>▸ navigation / cipher</Scribble>
        <div style={{ height: 10 }} />
        {[
          { k: '§01', label: 'манифест', a: WF.blood },
          { k: '§02', label: 'направления', a: WF.bone },
          { k: '§03', label: 'курс · сервиторы', a: WF.purple },
          { k: '§04', label: 'видео', a: WF.bone },
          { k: '§05', label: 'telegram', a: WF.bone },
          { k: '§06', label: 'контур', a: WF.bone },
        ].map(i =>
          <div key={i.k} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', padding: '6px 0', borderBottom: `1px dashed ${WF.border}`, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: i.a, letterSpacing: '0.08em' }}>{i.k}</span>
            <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: WF.bone, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{i.label}</span>
          </div>
        )}
        <div style={{ height: 28 }} />
        <div style={{ border: `1px solid ${WF.border}`, padding: 14 }}>
          <Scribble size={9} accent={WF.blood}>▸ манифест</Scribble>
          <div style={{ height: 10 }} />
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 17, lineHeight: 1.05 }}>
            НИЧТО НЕ<br/>ИСТИННО.<br/>ВСЁ<br/>ДОЗВОЛЕНО.
          </div>
          <div style={{ height: 12 }} />
          <BtnStub solid accent={WF.blood} w="100%">Подписаться</BtnStub>
        </div>
        <div style={{ height: 20 }} />
        <Scribble size={8} accent={WF.boneDim}>
          ritual: OFF<br/>
          @levorules · mmxxvi<br/>
          yt · tt · tg · x
        </Scribble>
      </div>

      {/* RIGHT STREAM */}
      <div>
        {/* Top strip — breadcrumb + ritual toggle */}
        <div style={{ padding: '12px 24px', borderBottom: `1px solid ${WF.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Scribble size={9}>▸ §01 / манифест →</Scribble>
          <div style={{ display: 'flex', gap: 8 }}>
            <TagStub accent={WF.bone}>RITUAL OFF</TagStub>
            <TagStub accent={WF.amber}>ТЕСТ ЦВЕТА</TagStub>
          </div>
        </div>

        {/* §01 Hero */}
        <div style={{ padding: '40px 32px' }}>
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 92, lineHeight: 0.88, letterSpacing: '-0.02em' }}>
            БЕЗ ПЫЛИ<br/>И ВАНИЛИ.<br/>
            <span style={{ color: WF.blood }}>БЕЗ КУРСОВ</span><br/>
            И НАСТАВЛЕНИЙ.
          </div>
          <div style={{ height: 18 }} />
          <div style={{ maxWidth: 360 }}><BodyStub lines={3} /></div>
        </div>

        <div style={{ height: 1, background: WF.border }} />

        {/* §02 Directions — tall narrow stack */}
        <div style={{ padding: '32px 32px' }}>
          <Scribble size={10}>▸ §02 · территории</Scribble>
          <div style={{ height: 18 }} />
          {[
            { t: 'МАГИЯ ХАОСА', b: 'Сигилы, ритуалы, деконструкция догм.' },
            { t: 'ДЕМОНОЛОГИЯ', b: 'Инфернальные сущности. Без страха и поклонения.' },
            { t: 'ПУТЬ ЛЕВОЙ РУКИ', b: 'Самообожествление, индивидуация.' },
          ].map((c, i) =>
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 20, alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${WF.border}` }}>
              <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 36, color: WF.blood }}>0{i+1}</div>
              <div>
                <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 24, letterSpacing: '-0.01em' }}>{c.t}</div>
                <div style={{ height: 4 }} />
                <Scribble size={10} accent={WF.boneDim}>{c.b}</Scribble>
              </div>
              <Scribble size={9} accent={WF.boneDim}>cd →</Scribble>
            </div>
          )}
        </div>

        {/* §03 Course — full-bleed purple */}
        <div style={{ padding: '40px 32px', background: `linear-gradient(180deg, ${WF.void} 0%, #120820 100%)`, borderTop: `2px solid ${WF.purple}`, borderBottom: `2px solid ${WF.purple}`, position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', right: -20, top: 20, width: 260, opacity: 0.25 }} fill="none" stroke={WF.purple} strokeWidth="0.6">
            <polygon points="50,5 95,80 5,80" />
            <circle cx="50" cy="55" r="30"/>
            <line x1="20" y1="30" x2="80" y2="30"/>
          </svg>
          <Scribble size={10} accent={WF.purple}>▸ §03 · курс · бесплатный · открытый</Scribble>
          <div style={{ height: 14 }} />
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 72, lineHeight: 0.88, letterSpacing: '-0.02em' }}>
            <span style={{ color: WF.purple }}>СЕРВИТОРЫ.</span><br/>
            СКОНСТРУИРОВАТЬ,<br/>ЗАПИТАТЬ,<br/>УПРАВЛЯТЬ.
          </div>
          <div style={{ height: 18 }} />
          <Scribble size={11}>130 страниц · 6 модулей · без оплат · без регистраций</Scribble>
          <div style={{ height: 22 }} />
          {/* module grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['природа','конструкция','питание','контроль','кейсы','чистка'].map((m,i) =>
              <div key={i} style={{ border: `1px solid ${WF.purple}`, padding: '12px 14px' }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: WF.purple, letterSpacing: '0.1em' }}>0{i+1} / 06</div>
                <div style={{ height: 6 }} />
                <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>{m}</div>
              </div>
            )}
          </div>
          <div style={{ height: 22 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <BtnStub solid accent={WF.purple}>Открыть курс →</BtnStub>
            <BtnStub accent={WF.purple}>Скачать PDF</BtnStub>
          </div>
        </div>

        {/* §04 Video */}
        <div style={{ padding: '32px 32px', borderBottom: `1px solid ${WF.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Scribble size={10}>▸ §04 · видео-поток</Scribble>
            <div style={{ display: 'flex', gap: 6 }}>
              <TagStub accent={WF.bone}>YT</TagStub>
              <TagStub accent={WF.bone}>TT</TagStub>
              <TagStub accent={WF.bone}>ALL</TagStub>
            </div>
          </div>
          <div style={{ height: 14 }} />
          {/* masonry-ish — one big + four small */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
            <PH h={300} label="featured · 9:16" accent={WF.blood} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PH h={146} label="9:16" />
              <PH h={146} label="9:16" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PH h={146} label="9:16" />
              <PH h={146} label="9:16" />
            </div>
          </div>
        </div>

        {/* §05 TG */}
        <div style={{ padding: '32px 32px', borderBottom: `1px solid ${WF.border}` }}>
          <Scribble size={10}>▸ §05 · telegram</Scribble>
          <div style={{ height: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[0,1].map(i =>
              <div key={i} style={{ border: `1px solid ${WF.border}`, padding: 14, background: WF.ash }}>
                <Scribble size={9}>▸ {i === 0 ? 'разоблачение · 11 мин' : 'протокол · 6 мин'}</Scribble>
                <div style={{ height: 10 }} />
                <HeadingStub lines={1} width={['85%']} size={18} accent={i === 0 ? '#FF006E' : '#39FF14'} />
                <div style={{ height: 10 }} />
                <BodyStub lines={3} />
              </div>
            )}
          </div>
        </div>

        <FooterStub />
      </div>

      <Annot top={40} right={-220} width={220}>
        <b>боковой алтарь</b>: логотип, оглавление-шифр (§01–§06), манифест, CTA — всегда на экране
      </Annot>
      <Annot top={600} right={-220} width={220}>
        курс — <b>полноэкранный блок</b> с собственным фоном и модульной сеткой 3×2
      </Annot>
      <Annot top={1050} right={-220} width={220}>
        видео: <b>1 большой + 4 маленьких</b> (featured + лента)
      </Annot>
    </div>
  );
}

window.VariantD = VariantD;
