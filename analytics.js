(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-NKR6YXP4VV';
  const PASSPORT_ITEM = Object.freeze({
    item_id: 'passport_servitora',
    item_name: 'Паспорт сервитора',
    item_category: 'PDF-гайд',
    price: 299,
    quantity: 1,
  });
  const isProduction = /(^|\.)levorules\.com$/i.test(location.hostname);
  const debugMode = new URLSearchParams(location.search).has('ga_debug');
  const eventLog = window.__LR_ANALYTICS_EVENTS__ = window.__LR_ANALYTICS_EVENTS__ || [];
  let scrollMarks = new Set();
  let scrollFrame = null;

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = window.gtag || gtag;

  function compact(params) {
    return Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => (
        value !== undefined && value !== null && value !== ''
      )),
    );
  }

  function event(name, params) {
    const payload = compact({
      ...(params || {}),
      debug_mode: debugMode ? true : undefined,
    });
    const record = { name, params: payload, at: new Date().toISOString() };
    eventLog.push(record);
    window.dispatchEvent(new CustomEvent('lr:analytics', { detail: record }));

    if (isProduction) {
      window.gtag('event', name, payload);
    } else {
      console.debug('[levorules analytics]', name, payload);
    }
  }

  function contentGroupForPath() {
    if (location.pathname.startsWith('/passport-servitora')) return 'product';
    if (location.hash.startsWith('#servitors-reader')) return 'course_reader';
    if (location.hash.startsWith('#servitors')) return 'course';
    if (location.hash.startsWith('#guides/')) return 'guide';
    if (location.hash.startsWith('#guides')) return 'guides';
    if (location.hash.startsWith('#who')) return 'about';
    return 'home';
  }

  function pageView(options) {
    const details = options || {};
    scrollMarks = new Set();
    event('page_view', {
      page_title: details.title || document.title,
      page_location: location.href,
      page_path: `${location.pathname}${location.search}${location.hash}`,
      content_group: details.contentGroup || contentGroupForPath(),
      app_route: details.route,
      module_index: details.moduleIndex,
      module_number: details.moduleNumber,
      module_title: details.moduleTitle,
    });
  }

  function course(eventName, details) {
    event(eventName, {
      course_id: 'servitors',
      course_name: 'Сервиторы',
      ...(details || {}),
    });
  }

  function passportPromotion(eventName, placement) {
    event(eventName, {
      promotion_id: 'passport_servitora',
      promotion_name: 'Паспорт сервитора',
      creative_slot: placement,
      items: [{ ...PASSPORT_ITEM }],
    });
  }

  function passportCheckout(placement) {
    event('begin_checkout', {
      currency: 'RUB',
      value: PASSPORT_ITEM.price,
      checkout_provider: 'Tribute',
      creative_slot: placement,
      items: [{ ...PASSPORT_ITEM }],
    });
  }

  function trackScrollDepth() {
    scrollFrame = null;
    const doc = document.documentElement;
    const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));

    [25, 50, 75, 90].forEach((mark) => {
      if (percent < mark || scrollMarks.has(mark)) return;
      scrollMarks.add(mark);
      event('content_progress', {
        percent_scrolled: mark,
        content_group: contentGroupForPath(),
        page_path: `${location.pathname}${location.hash}`,
      });
    });
  }

  window.lrAnalytics = Object.freeze({
    measurementId: MEASUREMENT_ID,
    isProduction,
    event,
    pageView,
    course,
    passportPromotion,
    passportCheckout,
  });

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    debug_mode: debugMode,
  });

  if (isProduction) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  window.addEventListener('scroll', () => {
    if (scrollFrame !== null) return;
    scrollFrame = requestAnimationFrame(trackScrollDepth);
  }, { passive: true });

  document.addEventListener('click', (clickEvent) => {
    const link = clickEvent.target.closest('a[href]');
    if (!link) return;

    let url;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }

    if (!['t.me', 'telegram.me'].includes(url.hostname)) return;
    event('telegram_click', {
      link_url: url.href,
      link_text: (link.textContent || '').trim().slice(0, 100),
      page_path: `${location.pathname}${location.hash}`,
    });
  }, true);
})();
