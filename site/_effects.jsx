// Visual effects layer — preloader, live background, scroll progress,
// tilt/spotlight on .lr-reactive-card, magnetic .lr-action buttons.
// Vanilla DOM, mounted outside React root: prerender-safe (runs only in browser).
// Loaded in the app bundle before _home-top.jsx (see build.mjs APP_FILES).

function ChaosStar({ accent = 'var(--blood)', opacity = 0.42, size = 600 }) {
  const arrows = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" stroke={accent}
      className="lr-chaos-star" style={{ opacity, overflow: 'visible' }} aria-hidden="true">
      <g className="lr-chaos-star__rings" strokeWidth="0.4">
        <circle cx="100" cy="100" r="96" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="88" />
      </g>
      <g className="lr-chaos-star__arrows" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        {arrows.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
            <path d="M100 100 L100 18" />
            <path d="M88 32 L100 18 L112 32" fill={accent} fillOpacity="0.35" />
          </g>
        ))}
        <circle cx="100" cy="100" r="30" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="7" fill={accent} fillOpacity="0.6" strokeWidth="0.8" className="lr-chaos-star__core" />
      </g>
    </svg>
  );
}

// Marquee strip under the hero.
function Marquee({ items }) {
  const row = items.map((t, i) => (
    <React.Fragment key={i}>
      <span style={{ padding: '0 24px' }}>{t.text}</span>
      <span style={{ color: t.accent }}>✱</span>
    </React.Fragment>
  ));
  return (
    <div className="lr-marquee" aria-hidden="true">
      <div className="lr-marquee__track">{row}{row}</div>
    </div>
  );
}

(function lrEffects() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__LR_PRERENDER__) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = motion.matches;
  const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

  const mount = (fn) => (document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn());

  // ---- Preloader (once per session) ----
  mount(() => {
    if (reduce) return;
    try { if (sessionStorage.getItem('lr_preloaded')) return; sessionStorage.setItem('lr_preloaded', '1'); } catch {}
    const el = document.createElement('div');
    el.className = 'lr-preloader';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="lr-preloader__inner">
        <svg viewBox="0 0 200 200" width="180" height="180" fill="none" stroke="var(--blood-display)" stroke-width="0.9" style="overflow:visible">
          <g class="lr-preloader__spin">
            <circle cx="100" cy="100" r="95" stroke-dasharray="1200" class="lr-preloader__draw"></circle>
            <circle cx="100" cy="100" r="72" stroke-dasharray="1200" class="lr-preloader__draw" style="animation-delay:.15s"></circle>
            <circle cx="100" cy="100" r="48" stroke-dasharray="1200" class="lr-preloader__draw" style="animation-delay:.3s"></circle>
          </g>
          <path d="M100 5 L183 147 L17 147 Z" stroke-dasharray="1200" class="lr-preloader__draw" style="animation-delay:.35s"></path>
          <path d="M100 195 L17 53 L183 53 Z" stroke-dasharray="1200" class="lr-preloader__draw" style="animation-delay:.5s"></path>
          <circle cx="100" cy="100" r="3" fill="var(--blood-display)" class="lr-preloader__core"></circle>
        </svg>
        <div class="lr-preloader__label">▸ fac ut ardeat <span class="lr-preloader__cursor">_</span></div>
      </div>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('is-out'), 1500);
    setTimeout(() => el.remove(), 2300);
  });

  // ---- Live background: embers canvas + cursor glow + grain ----
  mount(() => {
    const bg = document.createElement('div');
    bg.className = 'lr-live-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = `<canvas class="lr-live-bg__embers"></canvas><div class="lr-live-bg__glow"></div><div class="lr-live-bg__grain"></div>`;
    document.body.prepend(bg);
    const glow = bg.querySelector('.lr-live-bg__glow');
    if (fine) {
      window.addEventListener('mousemove', (e) => {
        if (motion.matches) return;
        glow.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(179,0,0,.16), transparent 70%)`;
      }, { passive: true });
    }
    if (reduce) return;
    const c = bg.querySelector('canvas');
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let W, H;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const spawn = (p = {}) => Object.assign(p, {
      x: Math.random() * W, y: H + Math.random() * H * 0.3,
      r: 0.6 + Math.random() * 1.8, vy: 0.15 + Math.random() * 0.45, vx: (Math.random() - 0.5) * 0.2,
      a: 0.2 + Math.random() * 0.6, ph: Math.random() * Math.PI * 2,
      c: Math.random() < 0.8 ? '255,90,90' : '255,184,0',
    });
    resize();
    window.addEventListener('resize', resize);
    const count = window.innerWidth < 720 ? 35 : 70;
    const P = Array.from({ length: count }, () => spawn({}));
    P.forEach((p) => { p.y = Math.random() * H; });
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.y -= p.vy; p.x += p.vx + Math.sin(t / 900 + p.ph) * 0.25;
        if (p.y < -10) spawn(p);
        const fl = p.a * (0.6 + 0.4 * Math.sin(t / 300 + p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${fl})`; ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${p.c},.8)`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const syncAnimation = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !motion.matches) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', syncAnimation);
    motion.addEventListener('change', syncAnimation);
  });

  // ---- Scroll progress line under the header ----
  mount(() => {
    const bar = document.createElement('div');
    bar.className = 'lr-scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const header = document.querySelector('.lr-site-header');
      bar.style.top = (header ? header.getBoundingClientRect().bottom - 2 : 0) + 'px';
      const p = h.scrollHeight - h.clientHeight;
      bar.style.width = (p > 0 ? (h.scrollTop / p) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // ---- Tilt + spotlight on .lr-reactive-card, magnet on .lr-action (delegated) ----
  mount(() => {
    if (!fine || reduce) return;
    const TILT = 8;
    const ensureSpot = (el) => {
      let s = el.querySelector(':scope > .lr-spot');
      if (!s) {
        s = document.createElement('div');
        s.className = 'lr-spot';
        el.appendChild(s);
      }
      return s;
    };
    document.addEventListener('mousemove', (e) => {
      if (motion.matches) return;
      const card = window.innerWidth > 720 && e.target.closest?.('.lr-reactive-card');
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * TILT}deg) rotateY(${(px - 0.5) * TILT}deg) translateY(-3px)`;
        card.style.zIndex = '3';
        const s = ensureSpot(card);
        s.style.opacity = '1';
        s.style.background = `radial-gradient(400px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.10), transparent 60%)`;
      }
      const btn = e.target.closest?.('.lr-action');
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18, dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest?.('.lr-reactive-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.style.transform = ''; card.style.zIndex = '';
        const s = card.querySelector(':scope > .lr-spot'); if (s) s.style.opacity = '0';
      }
      const btn = e.target.closest?.('.lr-action');
      if (btn && !btn.contains(e.relatedTarget)) btn.style.transform = '';
    }, { passive: true });
  });
})();

Object.assign(window, { ChaosStar, Marquee });
