// «Кто я» — one-line koan page.
function WhoPage() {
  const blood = 'var(--blood-display)';
  return (
    <section style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '96px 32px', position: 'relative', overflow: 'hidden',
      background: 'var(--void)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(232,29,29,0.12), transparent 60%)' }} />
      <div style={{ position: 'relative', maxWidth: 1100, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(22px, 3.6vw, 48px)', lineHeight: 1.15,
          letterSpacing: '-0.015em', textTransform: 'uppercase',
          color: 'var(--bone)',
        }}>
          Кто я —<br/>не имеет никакого значения.
        </div>
        <div className="lr-glitch-text" style={{
          marginTop: 40,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(56px, 10vw, 152px)', lineHeight: 1.0,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: blood,
        }}>
          А вот кто ты?
        </div>
      </div>
    </section>
  );
}

window.WhoPage = WhoPage;
