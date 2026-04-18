// VARIANT B — "Terminal grid / ritual console"
// Radical: whole home page is a monospaced grid, like a CRT terminal readout.
// Navigation as file system. Course is a full-width purple "transmission".

function VariantB() {
  const W = 780;
  const cell = { border: `1px solid ${WF.border}`, padding: 16, position: 'relative' };
  return (
    <div style={{ width: W, background: WF.void, color: WF.bone, fontFamily: 'Space Mono, monospace', position: 'relative' }}>
      {/* TOP BAR — terminal style */}
      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${WF.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.1em', color: WF.boneDim }}>
        <span><span style={{ color: WF.blood }}>▸</span> levorules.com / ~ / index</span>
        <span>SYS 2.6 · RITUAL: OFF · {new Date().toISOString().slice(0,10)}</span>
      </div>

      <HeaderStub active="home" />

      {/* HERO as ascii-ish console dump */}
      <div style={{ padding: 40, borderBottom: `1px solid ${WF.border}` }}>
        <div style={{ color: WF.boneDim, fontSize: 10 }}>&gt; WHOAMI</div>
        <div style={{ marginTop: 14, fontFamily: 'Oswald', fontWeight: 700, fontSize: 88, lineHeight: 0.85, color: WF.bone, letterSpacing: '-0.02em' }}>
          ЛЕВО<br/>РУЛЯ<span style={{ color: WF.blood }}>_</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 11, color: WF.boneDim, letterSpacing: '0.1em', maxWidth: 520 }}>
          [channel] chaos magick · demonology · left-hand path<br/>
          [audience] practitioners, not students<br/>
          [rule] «ничто не истинно, всё дозволено»
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <BtnStub solid accent={WF.blood}>$ subscribe tg</BtnStub>
          <BtnStub accent={WF.purple}>$ open course</BtnStub>
          <BtnStub accent={WF.boneDim}>$ ritual --on</BtnStub>
        </div>
      </div>

      {/* FILE SYSTEM GRID — main navigation */}
      <div style={{ padding: 0, borderBottom: `1px solid ${WF.border}` }}>
        <div style={{ padding: '16px 40px 8px' }}>
          <Scribble size={10}>// доступные разделы · выбери директорию</Scribble>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { code: '/chaos', title: 'МАГИЯ ХАОСА', acc: WF.bone, n: '01' },
            { code: '/demons', title: 'ДЕМОНОЛОГИЯ', acc: WF.bone, n: '02' },
            { code: '/lhp', title: 'ПУТЬ ЛЕВОЙ РУКИ', acc: WF.bone, n: '03' },
          ].map(c =>
            <div key={c.code} style={{ ...cell, borderRight: `1px solid ${WF.border}`, minHeight: 180, padding: 24 }}>
              <div style={{ fontSize: 10, color: WF.blood, letterSpacing: '0.1em' }}>[{c.n}] {c.code}</div>
              <div style={{ height: 14 }} />
              <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 24, color: c.acc, letterSpacing: '-0.01em' }}>{c.title}</div>
              <div style={{ height: 12 }} />
              <BodyStub lines={3} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 9, color: WF.boneDim }}>cd →</div>
            </div>
          )}
        </div>
      </div>

      {/* COURSE — full-width "incoming transmission" */}
      <div style={{ padding: 40, background: WF.ash2, borderBottom: `2px solid ${WF.purple}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: WF.purple, letterSpacing: '0.15em' }}>
          &gt;&gt; INCOMING TRANSMISSION · {'//'} FREE · {'//'} 130 PAGES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, marginTop: 20, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.02em' }}>
              СЕРВИТОРЫ<br/>
              <span style={{ color: WF.purple }}>ВМЕСТО</span><br/>
              МОЛИТВ
            </div>
            <div style={{ height: 18 }} />
            <Scribble size={11}>курс · открытый доступ · автономные сущности под твою волю</Scribble>
            <div style={{ height: 18 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <BtnStub solid accent={WF.purple}>$ ./enter</BtnStub>
              <BtnStub accent={WF.purple}>$ cat program.md</BtnStub>
            </div>
          </div>
          {/* module stack as log lines */}
          <div style={{ border: `1px solid ${WF.purple}`, padding: 18, fontSize: 11 }}>
            <div style={{ color: WF.purple, fontSize: 9, letterSpacing: '0.1em', marginBottom: 10 }}>▸ MODULES.LOG</div>
            {[
              '[01] что такое сервитор · природа',
              '[02] конструкция · протокол сборки',
              '[03] зарядка · питание · связь',
              '[04] контроль · границы · отзыв',
              '[05] практические кейсы',
              '[06] ретроспектива · чистка',
            ].map((l,i) =>
              <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: i<5 ? `1px dashed ${WF.border}` : 'none' }}>
                <span style={{ color: WF.purple, flexShrink: 0 }}>▸</span>
                <span style={{ color: WF.bone, opacity: 0.8 }}>{l}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIDEO + TG — split pane */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${WF.border}` }}>
        <div style={{ padding: 24, borderRight: `1px solid ${WF.border}` }}>
          <Scribble size={10}>/video/ · youtube + tiktok</Scribble>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[1,2,3,4,5,6].map(n => <PH key={n} h={130} label="9:16" />)}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <TagStub accent={WF.bone}>YT →</TagStub>
            <TagStub accent={WF.bone}>TT →</TagStub>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <Scribble size={10}>/tg/ · последние посты</Scribble>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(n =>
              <div key={n} style={{ borderBottom: `1px dashed ${WF.border}`, paddingBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: WF.boneDim, letterSpacing: '0.1em' }}>
                  <span>▸ разбор · 14 мин</span><span>18.04.2026</span>
                </div>
                <div style={{ height: 6 }} />
                <div style={{ height: 8, background: WF.bone, opacity: 0.8, width: '85%' }} />
                <div style={{ height: 4, background: WF.boneDim, opacity: 0.4, width: '95%', marginTop: 8 }} />
                <div style={{ height: 4, background: WF.boneDim, opacity: 0.4, width: '60%', marginTop: 4 }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANIFESTO — blood slab */}
      <div style={{ padding: '48px 40px', background: WF.blood, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 38, lineHeight: 0.95 }}>
          НИЧТО&nbsp;НЕ&nbsp;ИСТИННО<span style={{ opacity: 0.5 }}>_</span><br/>
          ВСЁ&nbsp;ДОЗВОЛЕНО<span style={{ opacity: 0.5 }}>_</span>
        </div>
      </div>

      <FooterStub />

      <Annot top={60} right={-220} width={210}>
        вся главная = <b>CRT-терминал</b>. монотайп, &gt; префиксы, системные метки
      </Annot>
      <Annot top={520} right={-220} width={220}>
        разделы как <b>директории</b> — /chaos, /demons, /lhp
      </Annot>
      <Annot top={800} right={-220} width={220}>
        курс = <b>incoming transmission</b>, модули = лог-линии
      </Annot>
    </div>
  );
}

window.VariantB = VariantB;
