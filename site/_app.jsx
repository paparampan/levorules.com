// Root App + router. Last in load order — uses all page components.

const TWEAKS = window.__TWEAKS__ || { ritual: false, heroScale: 'xl', courseAccent: 'purple' };

function lrHashValue(hash = location.hash) {
  return hash.replace(/^#/, '').trim();
}

function lrRouteFromHash(hash = location.hash) {
  const h = lrHashValue(hash);
  if (h === 'servitors' || h === 'program' || h === 'appendices') return 'servitors';
  if (h === 'servitors-reader' || h.startsWith('servitors-reader/')) return 'servitors-reader';
  if (h === 'who') return 'who';
  return 'home';
}

function lrSectionFromHash(hash = location.hash, route = lrRouteFromHash(hash)) {
  const h = lrHashValue(hash);
  if (route === 'home' && ['territories', 'video', 'content'].includes(h)) return h;
  if (route === 'servitors' && ['program', 'appendices'].includes(h)) return h;
  return null;
}

function lrNeedsServitors(route) {
  return route === 'servitors' || route === 'servitors-reader';
}

function lrServitorsReady() {
  return typeof window.ServitorsPage === 'function'
    && typeof window.ServitorsReader === 'function'
    && Array.isArray(window.SERVITORS_MODULES);
}

function lrLoadServitorsBundle() {
  if (lrServitorsReady()) return Promise.resolve();
  if (window.__LR_SERVITORS_PROMISE__) return window.__LR_SERVITORS_PROMISE__;

  window.__LR_SERVITORS_PROMISE__ = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'dist/servitors.js';
    script.defer = true;
    script.onload = () => lrServitorsReady()
      ? resolve()
      : reject(new Error('Servitors bundle loaded without expected globals'));
    script.onerror = () => reject(new Error('Failed to load dist/servitors.js'));
    document.body.appendChild(script);
  });

  return window.__LR_SERVITORS_PROMISE__;
}

function App() {
  const pendingScrollId = React.useRef(lrSectionFromHash());
  const [navTick, setNavTick] = React.useState(0);
  const [route, setRoute] = React.useState(() => {
    const h = lrHashValue();
    if (h) return lrRouteFromHash();
    const saved = localStorage.getItem('lr_route') || 'home';
    return saved;
  });
  const [ritual, setRitual] = React.useState(TWEAKS.ritual);
  const [servitorsReady, setServitorsReady] = React.useState(() => lrServitorsReady());
  const [servitorsError, setServitorsError] = React.useState(null);
  const navigate = React.useCallback((nextRoute, sectionId = null) => {
    pendingScrollId.current = sectionId;
    setRoute(nextRoute);
    setNavTick((n) => n + 1);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('lr_route', route);
    const sectionId = pendingScrollId.current;
    if (route === 'servitors') history.replaceState(null, '', sectionId ? `#${sectionId}` : '#servitors');
    else if (route === 'servitors-reader') {
      const mod = localStorage.getItem('lr_servitor_module') || '0';
      history.replaceState(null, '', `#servitors-reader/${mod}`);
    }
    else if (route === 'who') history.replaceState(null, '', '#who');
    else history.replaceState(null, '', sectionId ? `#${sectionId}` : '#');

    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    pendingScrollId.current = null;
  }, [route, navTick]);

  React.useEffect(() => {
    document.body.classList.toggle('ritual', ritual);
  }, [ritual]);

  React.useEffect(() => {
    if (!lrNeedsServitors(route)) return;
    if (lrServitorsReady()) {
      setServitorsReady(true);
      setServitorsError(null);
      return;
    }
    setServitorsReady(false);
    setServitorsError(null);
    lrLoadServitorsBundle()
      .then(() => {
        setServitorsReady(true);
        setServitorsError(null);
      })
      .catch((err) => {
        console.error(err);
        setServitorsError(err);
      });
  }, [route]);

  React.useEffect(() => {
    const handler = (e) => {
      const detail = typeof e.detail === 'string' ? { route: e.detail } : e.detail;
      navigate(detail.route, detail.section || null);
    };
    const hashHandler = () => {
      const nextRoute = lrRouteFromHash();
      navigate(nextRoute, lrSectionFromHash(location.hash, nextRoute));
    };
    window.addEventListener('lr:route', handler);
    window.addEventListener('hashchange', hashHandler);
    return () => {
      window.removeEventListener('lr:route', handler);
      window.removeEventListener('hashchange', hashHandler);
    };
  }, [navigate]);

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
      <Header ritual={ritual} setRitual={setRitual} route={route} setRoute={navigate} />
      {lrNeedsServitors(route) && !servitorsReady ? (
        <>
          <ServitorsLoading error={servitorsError} />
          <Footer />
        </>
      ) : route === 'home' ? (
        <>
          <Hero ritual={ritual} />
          <Territories />
          <CourseCallout setRoute={navigate} />
          <VideoRow />
          <TelegramPosts />
          <ManifestoBand />
          <Footer />
        </>
      ) : route === 'servitors-reader' ? (
        <>
          <ServitorsReader setRoute={navigate} initialModule={initialModule} />
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

function ServitorsLoading({ error }) {
  return (
    <section style={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', padding: '96px 32px' }}>
      <div style={{ textAlign: 'center' }}>
        <Eyebrow accent="var(--purple)">курс</Eyebrow>
        <h1 style={{ marginTop: 16, fontSize: 'clamp(40px, 7vw, 92px)' }}>
          {error ? 'НЕ УДАЛОСЬ ЗАГРУЗИТЬ' : 'ЗАГРУЗКА'}
        </h1>
        <p style={{ marginTop: 14, color: 'var(--bone-dim)' }}>
          {error ? 'Обнови страницу или попробуй позже.' : 'Подгружаю материалы курса…'}
        </p>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
