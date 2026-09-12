// «Кто я» — one-line koan page.
function WhoPage() {
  const blood = 'var(--blood-display)';
  return (
    <><section style={{
      minHeight: '55vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '96px 32px', position: 'relative', overflow: 'hidden',
      background: 'var(--void)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(232,29,29,0.12), transparent 60%)' }} />
      <div style={{ position: 'relative', maxWidth: 1100, textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(22px, 3.6vw, 48px)', lineHeight: 1.15,
          letterSpacing: '-0.015em', textTransform: 'uppercase',
          color: 'var(--bone)',
        }}>
          Кто я —<br/>не имеет никакого значения.
        </h1>
        <p className="lr-glitch-text" style={{
          marginTop: 40,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(56px, 10vw, 152px)', lineHeight: 1.0,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: blood,
        }}>
          А вот кто ты?
        </p>
      </div>
    </section>
    <section className="lr-about-copy">
      <h2>А ЗА ТЕКСТ ОТВЕЧАЮ Я.</h2>
      <p>Я Антон, автор «Лево Руля». Здесь я разбираю магию хаоса, демонологию и путь левой руки: читаю источники, сопоставляю подходы и собираю из них рабочие инструкции.</p>
      <p>В курсе я отделяю исторические сведения от авторских моделей и практических договорённостей. Магическое объяснение опыта не становится научным фактом от того, что его уверенно произнесли.</p>
      <p>Материалы обновляются. Если нашёл неточность — принеси цитату и источник <a href="https://telegram.me/levorules_chat" target="_blank" rel="noopener">в обсуждение</a>. Дата редакции и изменения доступны <a href="/servitors/#edition">на странице курса</a>.</p>
      <a className="lr-about-cta" href="/servitors/">Читать бесплатный курс →</a>
    </section></>
  );
}

window.WhoPage = WhoPage;
