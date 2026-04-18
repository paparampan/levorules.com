// VARIANT C — "Sigil broadcast" / dense one-screen poster
// Hero + manifest collapsed into a full-viewport brutalist poster.
// Below: course as a tall zine column, video + TG side-by-side.
// Interactive ideas surface: «твой цвет магии» quiz card, ritual mode toggle.

function VariantC() {
  const W = 780;
  return (
    <div style={{ width: W, background: WF.void, color: WF.bone, position: 'relative' }}>
      <HeaderStub active="home" />

      {/* HERO POSTER — full-bleed type, type-as-image */}
      <div style={{ position: 'relative', padding: '40px 40px 28px', overflow: 'hidden', borderBottom: `2px solid ${WF.blood}` }}>
        {/* faint sigil behind */}
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', right: -40, top: -20, width: 380, opacity: 0.18 }} fill="none" stroke={WF.blood} strokeWidth="0.4">
          <circle cx="100" cy="100" r="95"/><circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="45"/>
          <path d="M100 5 L180 140 L20 140 Z"/><path d="M100 195 L20 60 L180 60 Z"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <Scribble size={10} accent={WF.blood}>▸ broadcast · mmxxvi · ch. 2026-04</Scribble>
          <div style={{ height: 16 }} />
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 150, lineHeight: 0.82, letterSpacing: '-0.03em' }}>
            АНТИ<br/>
            <span style={{ color: WF.blood }}>ДОГМА.</span>
          </div>
          <div style={{ height: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'end' }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 16, lineHeight: 1.5, maxWidth: 440 }}>
              <div style={{ height: 6, background: WF.bone, width: '95%', opacity: 0.85 }} />
              <div style={{ height: 6, background: WF.bone, width: '88%', opacity: 0.85, marginTop: 6 }} />
              <div style={{ height: 6, background: WF.bone, width: '60%', opacity: 0.85, marginTop: 6 }} />
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <TagStub>магия хаоса</TagStub>
                <TagStub>демонология</TagStub>
                <TagStub>плр</TagStub>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <BtnStub solid accent={WF.blood} w="100%">Читать канал</BtnStub>
              <BtnStub accent={WF.purple} w="100%">Открыть курс</BtnStub>
              <BtnStub accent={WF.boneDim} w="100%">Ritual mode ON</BtnStub>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ CARD + COURSE + VIDEO as 3-col zine spread */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', borderBottom: `1px solid ${WF.border}` }}>

        {/* COL 1 — QUIZ "твой цвет магии" */}
        <div style={{ padding: 24, borderRight: `1px solid ${WF.border}`, background: WF.ash2 }}>
          <Scribble size={10} accent={WF.amber}>▸ интерактив · тест</Scribble>
          <div style={{ height: 12 }} />
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 26, lineHeight: 0.95, letterSpacing: '-0.01em' }}>
            ТВОЙ ЦВЕТ<br/>МАГИИ
          </div>
          <div style={{ height: 10 }} />
          <Scribble size={10} accent={WF.boneDim}>8 вопросов · 90 сек</Scribble>
          <div style={{ height: 14 }} />
          {/* color swatches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
            {[WF.blood, '#39FF14', '#00E5FF', '#FF006E', '#FFB800', WF.purple, WF.bone, WF.borderStrong].map((c,i) =>
              <div key={i} style={{ height: 28, background: c, opacity: 0.85 }} />
            )}
          </div>
          <div style={{ height: 16 }} />
          <BtnStub accent={WF.amber} w="100%">Начать →</BtnStub>
          <div style={{ height: 20 }} />
          <Scribble size={9} accent={WF.boneDim}>// результат сохраняется, влияет на hero-акцент при возврате</Scribble>
        </div>

        {/* COL 2 — COURSE (purple, tall) */}
        <div style={{ padding: 24, borderRight: `1px solid ${WF.border}`, borderLeft: `3px solid ${WF.purple}` }}>
          <Scribble size={10} accent={WF.purple}>▸ курс · 130 стр · бесплатно</Scribble>
          <div style={{ height: 12 }} />
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 44, lineHeight: 0.9, letterSpacing: '-0.02em' }}>
            СЕРВИ<span style={{ color: WF.purple }}>ТОРЫ</span>
          </div>
          <div style={{ height: 12 }} />
          <Scribble size={10} accent={WF.boneDim}>автономные сущности, сконструированные под волю. без ангелов, без гоэтии, без кармы.</Scribble>
          <div style={{ height: 18 }} />
          {/* module ladder */}
          {['что это вообще такое','конструкция','зарядка и питание','границы и контроль','кейсы','чистка'].map((m,i) =>
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: `1px dashed ${WF.border}` }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: 14, color: WF.purple, fontWeight: 700 }}>0{i+1}</div>
              <div style={{ fontSize: 11, color: WF.bone }}>{m}</div>
              <div style={{ fontSize: 9, color: WF.boneDim, fontFamily: 'Space Mono' }}>{8+i*4} мин</div>
            </div>
          )}
          <div style={{ height: 18 }} />
          <BtnStub solid accent={WF.purple} w="100%">Открыть курс →</BtnStub>
        </div>

        {/* COL 3 — VIDEO STACK */}
        <div style={{ padding: 24 }}>
          <Scribble size={10}>▸ видео</Scribble>
          <div style={{ height: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(n =>
              <div key={n} style={{ position: 'relative' }}>
                <PH h={140} label={n === 1 ? 'NEW · 9:16' : '9:16'} accent={n === 1 ? WF.blood : null} />
                <div style={{ height: 4, background: WF.bone, opacity: 0.75, width: '85%', marginTop: 6 }} />
                <div style={{ height: 4, background: WF.boneDim, opacity: 0.5, width: '55%', marginTop: 3 }} />
              </div>
            )}
          </div>
          <div style={{ height: 14 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <TagStub accent={WF.bone}>YT →</TagStub>
            <TagStub accent={WF.bone}>TT →</TagStub>
          </div>
        </div>
      </div>

      {/* TG POSTS — horizontal strip */}
      <div style={{ padding: '32px 40px', borderBottom: `1px solid ${WF.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Scribble size={10}>▸ telegram · свежее</Scribble>
          <Scribble size={10} accent={WF.boneDim}>@levorules →</Scribble>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[1,2,3,4].map(n =>
            <div key={n} style={{ background: WF.ash, border: `1px solid ${WF.border}`, padding: 12, minHeight: 140 }}>
              <Scribble size={8}>▸ разбор · {10+n*2} мин</Scribble>
              <div style={{ height: 10 }} />
              <div style={{ height: 7, background: WF.bone, opacity: 0.85, width: '90%' }} />
              <div style={{ height: 7, background: WF.bone, opacity: 0.85, width: '60%', marginTop: 4 }} />
              <div style={{ height: 16 }} />
              <BodyStub lines={3} />
            </div>
          )}
        </div>
      </div>

      {/* MANIFESTO STRIP on blood */}
      <div style={{ padding: '36px 40px', background: WF.blood, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 32, lineHeight: 0.95 }}>
          НИЧТО НЕ ИСТИННО · ВСЁ ДОЗВОЛЕНО
        </div>
        <BtnStub accent={WF.bone}>Подписаться</BtnStub>
      </div>

      <FooterStub />

      <Annot top={50} right={-220} width={220}>
        hero = <b>постер</b>, одна тема в цикле (anti-dogma / anti-orthodox / anti-certainty)
      </Annot>
      <Annot top={700} right={-220} width={220}>
        <b>3-колоночный зин:</b> тест · курс · видео — курс всегда в центре
      </Annot>
      <Annot top={1100} right={-220} width={210}>
        манифест — строкой-баром с CTA. компактно и бьёт
      </Annot>
    </div>
  );
}

window.VariantC = VariantC;
