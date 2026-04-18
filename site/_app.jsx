// Root App + router. Last in load order — uses all page components.

const TWEAKS = window.__TWEAKS__ || { ritual: false, heroScale: 'xl', courseAccent: 'purple' };

function App() {
  const [route, setRoute] = React.useState(() => {
    const h = location.hash.replace('#', '');
    if (h === 'servitors') return 'servitors';
    if (h === 'servitors-reader' || h.startsWith('servitors-reader/')) return 'servitors-reader';
    if (h === 'who') return 'who';
    const saved = localStorage.getItem('lr_route') || 'home';
    return saved;
  });
  const [ritual, setRitual] = React.useState(TWEAKS.ritual);

  React.useEffect(() => {
    localStorage.setItem('lr_route', route);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (route === 'servitors') history.replaceState(null, '', '#servitors');
    else if (route === 'servitors-reader') {
      const mod = localStorage.getItem('lr_servitor_module') || '0';
      history.replaceState(null, '', `#servitors-reader/${mod}`);
    }
    else if (route === 'who') history.replaceState(null, '', '#who');
    else history.replaceState(null, '', '#');
  }, [route]);

  React.useEffect(() => {
    document.body.classList.toggle('ritual', ritual);
  }, [ritual]);

  React.useEffect(() => {
    const handler = (e) => setRoute(e.detail);
    window.addEventListener('lr:route', handler);
    return () => window.removeEventListener('lr:route', handler);
  }, []);

  // Initial module from hash (#servitors-reader/3 → module 3)
  const initialModule = (() => {
    const h = location.hash.replace('#', '');
    const m = h.match(/^servitors-reader\/(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n >= 0) return n;
    }
    return parseInt(localStorage.getItem('lr_servitor_module') || '0', 10);
  })();

  return (
    <>
      <Header ritual={ritual} setRitual={setRitual} route={route} setRoute={setRoute} />
      {route === 'home' ? (
        <>
          <Hero ritual={ritual} />
          <Territories />
          <CourseCallout setRoute={setRoute} />
          <VideoRow />
          <TelegramPosts />
          <ManifestoBand />
          <Footer />
        </>
      ) : route === 'servitors-reader' ? (
        <>
          <ServitorsReader setRoute={setRoute} initialModule={initialModule} />
          <Footer />
        </>
      ) : route === 'who' ? (
        <>
          <WhoPage />
          <Footer />
        </>
      ) : (
        <>
          <ServitorsPage setRoute={setRoute} />
          <Footer />
        </>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
