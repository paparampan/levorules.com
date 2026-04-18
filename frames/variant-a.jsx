// VARIANT A — "Single-scroll, reforged"
// Same overall flow as current site but recomposed with brand grid,
// adds: video row, course callout band, sharpened CTAs. Conservative.

function VariantA() {
  const W = 780;
  return (
    <div style={{ width: W, background: WF.void, color: WF.bone, position: 'relative' }}>
      <HeaderStub active="home" />

      {/* HERO */}
      <div style={{ padding: '56px 48px 40px', position: 'relative' }}>
        <SectionEyebrow>hero · 01</SectionEyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <HeadingStub lines={2} width={['85%','70%']} size={56} />
            <div style={{ marginTop: 16 }}>
              <Scribble size={11}>магия хаоса · демонология · путь левой руки</Scribble>
            </div>
            <div style={{ marginTop: 20, maxWidth: 340 }}>
              <BodyStub lines={3} />
            </div>
            <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
              <BtnStub solid accent={WF.blood}>Читать канал →</BtnStub>
              <BtnStub>Курс · сервиторы</BtnStub>
            </div>
          </div>
          <PH h={220} label="glitch · logo · manifesto loop" />
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <TagStub accent={WF.bone}>▸ личный опыт</TagStub>
          <TagStub accent={WF.bone}>▸ ритуалы с контекстом</TagStub>
          <TagStub accent={WF.bone}>▸ в ногу со временем</TagStub>
        </div>
      </div>

      <div style={{ height: 1, background: WF.border }} />

      {/* TERRITORIES — 3-card */}
      <div style={{ padding: '48px 48px' }}>
        <SectionEyebrow>три направления практики · 02</SectionEyebrow>
        <HeadingStub lines={1} width={['40%']} size={32} />
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {['МАГИЯ ХАОСА','ДЕМОНОЛОГИЯ','ПЛР'].map((t,i) => (
            <div key={i} style={{ border: `1px solid ${WF.border}`, padding: 18, background: WF.ash, minHeight: 170 }}>
              <Scribble accent={WF.blood} size={9}>0{i+1} /03</Scribble>
              <div style={{ height: 18 }} />
              <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>{t}</div>
              <div style={{ height: 12 }} />
              <BodyStub lines={3} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: WF.border }} />

      {/* NEW — COURSE CALLOUT BAND (purple) */}
      <div style={{ padding: '56px 48px', background: WF.ash2, borderLeft: `4px solid ${WF.purple}`, position: 'relative' }}>
        <SectionEyebrow accent={WF.purple}>новое · бесплатно · 03</SectionEyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <HeadingStub lines={2} width={['95%','65%']} size={44} accent={WF.purple} />
            <div style={{ height: 10 }} />
            <Scribble size={11} accent={WF.boneDim}>курс · 130 страниц · 6 модулей · полный доступ</Scribble>
            <div style={{ height: 16 }} />
            <div style={{ maxWidth: 400 }}><BodyStub lines={3} /></div>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <BtnStub solid accent={WF.purple}>Открыть курс</BtnStub>
              <BtnStub accent={WF.bone}>Программа ↓</BtnStub>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[1,2,3,4,5,6].map(n =>
              <div key={n} style={{ border: `1px dashed ${WF.purple}`, padding: '10px 8px', minHeight: 42 }}>
                <Scribble size={9} accent={WF.purple}>модуль 0{n}</Scribble>
                <div style={{ height: 4 }} />
                <div style={{ height: 4, background: WF.boneDim, width: '70%', opacity: 0.4 }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIDEO ROW — NEW */}
      <div style={{ padding: '48px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <SectionEyebrow>последние видео · 04</SectionEyebrow>
          <div style={{ display: 'flex', gap: 8 }}>
            <TagStub accent={WF.bone}>YOUTUBE</TagStub>
            <TagStub accent={WF.bone}>TIKTOK</TagStub>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[1,2,3,4,5].map(n =>
            <div key={n}>
              <PH h={220} label="9:16" />
              <div style={{ height: 8 }} />
              <div style={{ height: 4, background: WF.bone, opacity: 0.7, width: '90%' }} />
              <div style={{ height: 4, background: WF.bone, opacity: 0.5, width: '60%', marginTop: 4 }} />
            </div>
          )}
        </div>
      </div>

      {/* TELEGRAM POSTS */}
      <div style={{ padding: '0 48px 48px' }}>
        <SectionEyebrow>на канале · 05</SectionEyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[0,1].map(i =>
            <div key={i} style={{ border: `1px solid ${WF.border}`, background: WF.ash }}>
              <PH h={120} label="изображение · collage" noHatch />
              <div style={{ padding: 14 }}>
                <Scribble size={9}>▸ разбор · 14 мин</Scribble>
                <div style={{ height: 8 }} />
                <HeadingStub lines={1} width={['80%']} size={18} />
                <div style={{ height: 10 }} />
                <BodyStub lines={2} />
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <BtnStub accent={WF.bone}>Читать всё на канале →</BtnStub>
        </div>
      </div>

      {/* MANIFESTO BAND */}
      <div style={{ padding: '56px 48px', background: WF.blood, color: WF.bone, textAlign: 'center' }}>
        <Scribble size={10} accent={WF.bone} style={{ opacity: 0.7 }}>манифест · 06</Scribble>
        <div style={{ height: 12 }} />
        <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 42, lineHeight: 0.95 }}>
          НИЧТО НЕ ИСТИННО.<br/>ВСЁ ДОЗВОЛЕНО.
        </div>
        <div style={{ height: 14 }} />
        <Scribble size={10} accent={WF.bone} style={{ opacity: 0.7 }}>hassan-i sabbah → crowley → burroughs</Scribble>
      </div>

      <FooterStub />

      {/* annotations */}
      <Annot top={80} right={-220} width={200}>
        hero ≈ как сейчас, но с <b>двумя CTA</b> — канал и курс сразу
      </Annot>
      <Annot top={640} right={-220} width={220}>
        <b>новый блок:</b> курс как продолжение манифеста, не как «продукт»
      </Annot>
      <Annot top={1100} right={-220} width={200}>
        <b>новый блок:</b> видео с ютуба и тиктока, лента 5×9:16
      </Annot>
    </div>
  );
}

window.VariantA = VariantA;
