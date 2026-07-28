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
  if (h === 'guides') return 'guides';
  if (h.startsWith('guides/')) return 'guide';
  return 'home';
}

function lrSectionFromHash(hash = location.hash, route = lrRouteFromHash(hash)) {
  const h = lrHashValue(hash);
  if (route === 'home' && ['territories', 'video', 'content'].includes(h)) return h;
  if (route === 'servitors' && ['program', 'appendices'].includes(h)) return h;
  return null;
}

function lrGuideSlugFromHash(hash = location.hash) {
  const h = lrHashValue(hash);
  const m = h.match(/^guides\/(.+)$/);
  return m ? m[1] : null;
}

function lrModuleFromHash(hash = location.hash) {
  const h = lrHashValue(hash);
  const m = h.match(/^servitors-reader\/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) || n < 0 ? null : n;
}

function lrHashForRoute(route, sectionId = null, guideSlug = null, moduleIndex = null) {
  if (route === 'servitors') return sectionId ? `#${sectionId}` : '#servitors';
  if (route === 'servitors-reader') {
    let mod = moduleIndex;
    if (mod === null || mod === undefined) {
      const fromHash = lrModuleFromHash();
      if (fromHash !== null) mod = fromHash;
      else {
        try { mod = localStorage.getItem('lr_servitor_module') || '0'; }
        catch { mod = '0'; }
      }
    }
    return `#servitors-reader/${mod}`;
  }
  if (route === 'who') return '#who';
  if (route === 'guides') return '#guides';
  if (route === 'guide') return `#guides/${guideSlug || 'defense-basics'}`;
  return sectionId ? `#${sectionId}` : '#';
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

function lrRouteAccent(route) {
  if (route === 'servitors' || route === 'servitors-reader') return 'var(--purple)';
  if (route === 'guides' || route === 'guide') return 'var(--acid-green)';
  if (route === 'who') return 'var(--blood-text)';
  return 'var(--blood-display)';
}

function lrAnalyticsMeta(route, guideSlug, readerModule) {
  if (route === 'servitors') {
    return { title: 'Сервиторы — открытый курс · Лево Руля', contentGroup: 'course' };
  }
  if (route === 'servitors-reader') {
    return {
      title: `Сервиторы — модуль ${readerModule + 1} · Лево Руля`,
      contentGroup: 'course_reader',
    };
  }
  if (route === 'guides') {
    return { title: 'Гайды · Лево Руля', contentGroup: 'guides' };
  }
  if (route === 'guide') {
    const guide = window.GUIDES_INDEX?.find((item) => item.slug === guideSlug);
    return {
      title: `${guide?.title || 'Гайд'} · Лево Руля`,
      contentGroup: 'guide',
    };
  }
  if (route === 'who') {
    return { title: 'Кто я · Лево Руля', contentGroup: 'about' };
  }
  return { title: 'ЛЕВО РУЛЯ · Магия хаоса и ПЛР', contentGroup: 'home' };
}

function RouteCut({ active, accent }) {
  return (
    <div
      className={`lr-route-cut${active ? ' is-active' : ''}`}
      style={{ '--lr-route-accent': accent }}
      aria-hidden="true"
    >
      <span className="lr-route-cut__line lr-route-cut__line--primary" />
      <span className="lr-route-cut__line lr-route-cut__line--echo" />
    </div>
  );
}

function App() {
  const pendingScrollId = React.useRef(lrSectionFromHash());
  const pendingModuleIndex = React.useRef(null);
  const historyMode = React.useRef('replace');
  const handledHash = React.useRef(location.hash);
  const [navTick, setNavTick] = React.useState(0);
  const [route, setRoute] = React.useState(() => {
    const h = lrHashValue();
    if (h) return lrRouteFromHash();
    return 'home';
  });
  const [readerModule, setReaderModule] = React.useState(() => {
    const fromHash = lrModuleFromHash();
    if (fromHash !== null) return fromHash;
    try { return parseInt(localStorage.getItem('lr_servitor_module') || '0', 10); }
    catch { return 0; }
  });
  const [guideSlug, setGuideSlug] = React.useState(() => {
    const fromHash = lrGuideSlugFromHash();
    if (fromHash) return fromHash;
    try { return localStorage.getItem('lr_guide_slug') || 'defense-basics'; }
    catch { return 'defense-basics'; }
  });
  const [ritual, setRitual] = React.useState(TWEAKS.ritual);
  const [servitorsReady, setServitorsReady] = React.useState(() => lrServitorsReady());
  const [servitorsError, setServitorsError] = React.useState(null);
  const firstVisualRoute = React.useRef(true);
  const [routeCutTick, setRouteCutTick] = React.useState(0);
  const visualRouteKey = route === 'guide' ? `${route}:${guideSlug}` : route;

  React.useLayoutEffect(() => {
    if (firstVisualRoute.current) {
      firstVisualRoute.current = false;
      return;
    }
    setRouteCutTick((tick) => tick + 1);
  }, [visualRouteKey]);

  React.useLayoutEffect(() => {
    const root = document.getElementById('main-content');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!root || reduceMotion || !('IntersectionObserver' in window)) return;

    const targets = Array.from(root.querySelectorAll('[data-lr-reveal]'));
    if (!targets.length) return;

    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((target) => {
      target.classList.remove('is-armed', 'is-visible');
      const pageTop = target.getBoundingClientRect().top + window.scrollY;
      if (pageTop <= viewportHeight * 0.92) {
        target.classList.add('is-visible');
        return;
      }
      target.classList.add('is-armed');
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.add('is-visible'));
    };
  }, [visualRouteKey, servitorsReady]);

  const navigate = React.useCallback((nextRoute, sectionId = null, slug = null, options = {}) => {
    pendingScrollId.current = sectionId;
    let nextModule = options.moduleIndex ?? null;
    if (nextRoute === 'servitors-reader') {
      if (nextModule === null) {
        const fromHash = lrModuleFromHash();
        if (fromHash !== null) nextModule = fromHash;
        else {
          try { nextModule = parseInt(localStorage.getItem('lr_servitor_module') || '0', 10); }
          catch { nextModule = 0; }
        }
      }
      if (!Number.isFinite(nextModule) || nextModule < 0) nextModule = 0;
      setReaderModule(nextModule);
    }
    pendingModuleIndex.current = nextModule;
    historyMode.current = options.historyMode || 'push';
    if (slug) setGuideSlug(slug);
    setRoute(nextRoute);
    setNavTick((n) => n + 1);
  }, []);

  React.useEffect(() => {
    try { localStorage.setItem('lr_route', route); } catch {}
    const sectionId = pendingScrollId.current;
    const moduleIndex = pendingModuleIndex.current;
    if (route === 'guide') {
      try { localStorage.setItem('lr_guide_slug', guideSlug); } catch {}
    }
    const nextHash = lrHashForRoute(route, sectionId, guideSlug, moduleIndex);
    const mode = historyMode.current;
    const currentHash = location.hash || '#';
    if (mode !== 'none' && currentHash !== nextHash) {
      const method = mode === 'replace' ? 'replaceState' : 'pushState';
      history[method](null, '', nextHash);
    }
    handledHash.current = location.hash;
    const analyticsMeta = lrAnalyticsMeta(route, guideSlug, readerModule);
    document.title = analyticsMeta.title;
    window.lrAnalytics?.pageView({
      title: analyticsMeta.title,
      contentGroup: analyticsMeta.contentGroup,
      route,
    });

    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
      });
    } else if (mode === 'push') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    pendingScrollId.current = null;
    pendingModuleIndex.current = null;
  }, [route, navTick, guideSlug, readerModule]);

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
      navigate(detail.route, detail.section || null, detail.slug || null, detail.options || {});
    };
    const syncFromLocation = () => {
      if (handledHash.current === location.hash) return;
      handledHash.current = location.hash;
      const nextRoute = lrRouteFromHash();
      const slug = lrGuideSlugFromHash();
      navigate(nextRoute, lrSectionFromHash(location.hash, nextRoute), slug, {
        historyMode: 'none',
        moduleIndex: lrModuleFromHash(),
      });
    };
    window.addEventListener('lr:route', handler);
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('lr:route', handler);
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, [navigate]);

  return (
    <>
      <a className="lr-skip-link" href="#main-content">К содержанию</a>
      <RouteCut key={routeCutTick} active={routeCutTick > 0} accent={lrRouteAccent(route)} />
      <Header ritual={ritual} setRitual={setRitual} route={route} setRoute={navigate} />
      <main id="main-content" tabIndex={-1}>
        {lrNeedsServitors(route) && !servitorsReady ? (
          <ServitorsLoading error={servitorsError} />
        ) : route === 'home' ? (
          <>
            <Hero ritual={ritual} />
            <Territories />
            <CourseCallout setRoute={navigate} />
            <PassportPromo placement="home" />
            <VideoRow />
            <TelegramPosts />
            <ManifestoBand />
          </>
        ) : route === 'servitors-reader' ? (
          <ServitorsReader setRoute={navigate} initialModule={readerModule} />
        ) : route === 'who' ? (
          <WhoPage />
        ) : route === 'guides' ? (
          <GuidesLanding setRoute={navigate} />
        ) : route === 'guide' ? (
          <GuidePage slug={guideSlug} setRoute={navigate} />
        ) : (
          <ServitorsPage setRoute={navigate} />
        )}
      </main>
      <Footer />
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
