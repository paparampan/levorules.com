// Shared parts for sketchy branded wireframes
// Uses brand tokens but deliberately "rough": dashed boxes, handwritten glyph labels,
// placeholder fills. Stays dark (void) because brand is non-negotiably dark.

const WF = {
  void: '#0A0A0A',
  ash: '#1F1F1F',
  ash2: '#141414',
  bone: '#E8E2D3',
  boneDim: '#8C8879',
  blood: '#B30000',
  purple: '#B026FF',
  border: '#2A2A2A',
  borderStrong: '#3D3D3D',
  dashed: '#3D3D3D',
};

// Rough placeholder box — dashed border + diagonal hatch
function PH({ h = 60, w, label, accent, children, style = {}, solid = false, noHatch = false }) {
  const stroke = accent || WF.dashed;
  return (
    <div style={{
      width: w || '100%', height: h,
      border: `1px ${solid ? 'solid' : 'dashed'} ${stroke}`,
      background: noHatch ? 'transparent' :
        `repeating-linear-gradient(135deg, transparent 0 8px, rgba(255,255,255,0.025) 8px 9px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Mono, monospace', fontSize: 10,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: accent || WF.boneDim, textAlign: 'center',
      padding: 8, position: 'relative',
      ...style,
    }}>
      {children || label}
    </div>
  );
}

// Handwritten-feeling label (uses Space Mono — the brand's "hand" is typographic)
function Scribble({ children, accent, size = 11, style = {} }) {
  return (
    <div style={{
      fontFamily: 'Space Mono, monospace',
      fontSize: size, lineHeight: 1.4,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: accent || WF.boneDim,
      ...style,
    }}>{children}</div>
  );
}

// Heading placeholder — shows scale/weight with bars instead of real text
function HeadingStub({ lines = 2, width = ['80%', '55%'], accent = WF.bone, size = 28 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: size,
          width: width[i] || width[width.length - 1],
          background: i === lines - 1 && accent !== WF.bone
            ? accent : WF.bone,
          opacity: i === lines - 1 && accent !== WF.bone ? 1 : 0.85,
        }} />
      ))}
    </div>
  );
}

// Body text placeholder — stacked thin bars
function BodyStub({ lines = 3, widths = ['100%', '92%', '70%'], color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: 5, width: widths[i % widths.length],
          background: color || WF.boneDim, opacity: 0.45,
        }} />
      ))}
    </div>
  );
}

// Tag pill — brand style but drawn as outline
function TagStub({ children, accent = WF.bone }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      border: `1px solid ${accent}`, color: accent,
      padding: '2px 8px',
      fontFamily: 'Space Mono, monospace', fontSize: 9,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>{children}</span>
  );
}

// Button placeholder
function BtnStub({ children, solid, accent = WF.bone, w = 'auto' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: '10px 16px', width: w,
      border: `2px solid ${accent}`,
      background: solid ? accent : 'transparent',
      color: solid ? WF.void : accent,
      fontFamily: 'Oswald, Impact, sans-serif', fontWeight: 700,
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>{children}</div>
  );
}

// Header band
function HeaderStub({ active = 'home' }) {
  const items = [
    { id: 'home', label: 'Главная' },
    { id: 'course', label: 'Курс · Сервиторы', accent: WF.purple },
    { id: 'video', label: 'Видео' },
    { id: 'tg', label: 'Telegram' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px',
      borderBottom: `1px solid ${WF.border}`,
      background: WF.void,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 20, height: 20, border: `1px solid ${WF.blood}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: 11, color: WF.blood }}>P</div>
        <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em', color: WF.bone }}>ЛЕВО&nbsp;РУЛЯ</div>
      </div>
      <div style={{ display: 'flex', gap: 18 }}>
        {items.map(i => (
          <div key={i.id} style={{
            fontFamily: 'Space Mono', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: i.id === active ? (i.accent || WF.bone) : WF.boneDim,
            borderBottom: i.id === active ? `1px solid ${i.accent || WF.blood}` : 'none',
            paddingBottom: 2,
          }}>▸ {i.label}</div>
        ))}
      </div>
      <div style={{
        fontFamily: 'Space Mono', fontSize: 9, letterSpacing: '0.1em',
        color: WF.boneDim, border: `1px solid ${WF.border}`, padding: '4px 8px',
      }}>RITUAL: OFF</div>
    </div>
  );
}

// Footer band
function FooterStub() {
  return (
    <div style={{
      padding: '20px 24px', borderTop: `1px solid ${WF.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: WF.ash2,
    }}>
      <Scribble size={9}>@levorules · mmxxvi</Scribble>
      <Scribble size={9} accent={WF.boneDim}>«ничто не истинно, всё дозволено»</Scribble>
      <div style={{ display: 'flex', gap: 8 }}>
        {['TG','YT','TT','X'].map(s =>
          <div key={s} style={{
            width: 22, height: 22, border: `1px solid ${WF.border}`,
            fontFamily: 'Space Mono', fontSize: 8, color: WF.boneDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{s}</div>
        )}
      </div>
    </div>
  );
}

// Annotation callout — draws a line + sticky-note-like comment
function Annot({ top, left, right, bottom, width = 180, children, from = 'left' }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width,
      zIndex: 20,
    }}>
      <div style={{
        background: '#fef4a8', color: '#5a4a2a', padding: '10px 12px',
        fontFamily: '"Comic Sans MS","Marker Felt","Segoe Print",cursive',
        fontSize: 11, lineHeight: 1.35,
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        transform: 'rotate(-1.5deg)',
      }}>
        {children}
      </div>
    </div>
  );
}

// Section divider w/ eyebrow
function SectionEyebrow({ children, accent }) {
  return (
    <div style={{
      fontFamily: 'Space Mono, monospace', fontSize: 10,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      color: WF.boneDim, marginBottom: 14,
    }}>
      <span style={{ color: accent || WF.blood }}>▸ </span>{children}
    </div>
  );
}

Object.assign(window, { WF, PH, Scribble, HeadingStub, BodyStub, TagStub, BtnStub, HeaderStub, FooterStub, Annot, SectionEyebrow });
