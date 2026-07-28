// Shared UI primitives for the hi-fi site
// Tokens come from brand/colors_and_type.css — we reference CSS vars, never hard-code.

function LRLogo({ size = 28, color = 'bone', alt = 'ЛЕВО РУЛЯ' }) {
  const src = color === 'blood' ? 'brand/assets/logo-mono-blood.svg'
            : color === 'bone'  ? 'brand/assets/logo-mono-bone.svg'
            : 'brand/assets/logo-primary.svg';
  return <img src={src} width={size} height={size} style={{ display: 'block' }} alt={alt} aria-hidden={alt === '' ? 'true' : undefined} />;
}

function Eyebrow({ accent = 'var(--blood-text)', children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 12,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--bone-dim)', ...style,
    }}>
      <span style={{ color: accent }}>▸ </span>{children}
    </div>
  );
}

function Btn({ variant = 'default', accent, children, onClick, href, style = {}, block, className = '' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '14px 22px', width: block ? '100%' : 'auto',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 15,
    border: '2px solid var(--bone)', background: 'transparent', color: 'var(--bone)',
    cursor: 'pointer', textDecoration: 'none',
    transition: 'background .15s ease, color .15s ease, border-color .15s ease, transform .08s ease',
    whiteSpace: 'nowrap',
  };
  const variants = {
    default: {},
    blood:  { background: 'var(--blood)', borderColor: 'var(--blood)', color: 'var(--bone)' },
    accent: { background: accent, borderColor: accent, color: 'var(--void)' },
    ghostAccent: { background: 'transparent', borderColor: accent, color: accent },
    ghost:  { borderColor: 'var(--border-strong)', color: 'var(--bone-dim)' },
  };
  const mergedStyle = { ...base, ...(variants[variant] || {}), ...style };
  const Comp = href ? 'a' : 'button';
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const hoverStyle = hover ? (
    variant === 'blood' ? { background: '#8f0000', borderColor: '#8f0000' }
    : variant === 'accent' ? { filter: 'brightness(1.15)' }
    : variant === 'ghostAccent' ? { background: accent, color: 'var(--void)' }
    : variant === 'ghost' ? { color: 'var(--bone)', borderColor: 'var(--bone)' }
    : { background: 'var(--bone)', color: 'var(--void)' }
  ) : {};
  const pressStyle = active ? { transform: 'translateY(1px)' } : {};
  return (
    <Comp
      {...(Comp === 'button' ? { type: 'button' } : {})}
      className={`lr-action ${className}`.trim()}
      onClick={onClick} href={href}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
      style={{
        '--lr-interaction-accent': accent || (variant === 'blood' ? 'var(--blood-text)' : 'var(--bone)'),
        ...mergedStyle, ...hoverStyle, ...pressStyle,
      }}
    >
      {children}
    </Comp>
  );
}

function Tag({ accent = 'var(--bone-dim)', children, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      border: `1px solid ${accent}`, color: accent, background: 'transparent',
      ...style,
    }}>{children}</span>
  );
}

function SectionTitle({ eyebrow, title, accent, align = 'left', children }) {
  return (
    <div style={{ textAlign: align, marginBottom: 32 }}>
      {eyebrow && <Eyebrow accent={accent}>{eyebrow}</Eyebrow>}
      <h2 style={{ margin: '12px 0 0', fontSize: 'clamp(32px, 4vw, 56px)' }}>{title}</h2>
      {children && <div style={{ marginTop: 14, color: 'var(--bone-dim)', maxWidth: 560, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{children}</div>}
    </div>
  );
}

// Subtle sigil SVGs for decoration — hand-built, low opacity
function SigilTriad({ accent = 'var(--blood)', opacity = 0.35, size = 320 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" stroke={accent} strokeWidth="0.5" style={{ opacity }}>
      <circle cx="100" cy="100" r="95"/>
      <circle cx="100" cy="100" r="72"/>
      <circle cx="100" cy="100" r="48"/>
      <path d="M100 5 L183 147 L17 147 Z"/>
      <path d="M100 195 L17 53 L183 53 Z"/>
      <circle cx="100" cy="100" r="3" fill={accent}/>
    </svg>
  );
}

function SigilServitor({ accent = 'var(--purple)', opacity = 0.3, size = 320 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" stroke={accent} strokeWidth="0.6" style={{ opacity }}>
      <polygon points="100,10 175,150 25,150" />
      <circle cx="100" cy="105" r="40"/>
      <circle cx="100" cy="105" r="22"/>
      <path d="M40 150 L100 10 L160 150"/>
      <path d="M60 105 L140 105 M100 65 L100 145"/>
      <circle cx="100" cy="105" r="5" fill={accent}/>
    </svg>
  );
}

const PASSPORT_PRODUCT = Object.freeze({
  title: 'Паспорт сервитора',
  price: '299 ₽',
  pages: 37,
  landingUrl: '/passport-servitora/',
});

function PassportPromo({ placement = 'site' }) {
  const amber = 'var(--amber)';
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trackView = () => window.lrAnalytics?.passportPromotion('view_promotion', placement);
    if (!('IntersectionObserver' in window)) {
      trackView();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      trackView();
      observer.disconnect();
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => observer.disconnect();
  }, [placement]);

  return (
    <section
      ref={sectionRef}
      className="lr-passport-promo"
      data-lr-reveal="section"
      style={{
        '--lr-interaction-accent': amber,
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #171208 100%)',
      }}
    >
      <div className="lr-passport-promo__inner">
        <div className="lr-passport-promo__copy">
          <Eyebrow accent={amber}>практический гайд · PDF · {PASSPORT_PRODUCT.pages} страниц</Eyebrow>
          <h2 className="lr-passport-promo__title">
            КУРС ОБЪЯСНЯЕТ.<br />
            <span style={{ color: amber }}>ПАСПОРТ СОБИРАЕТ.</span>
          </h2>
          <p className="lr-passport-promo__lead">
            Последовательный маршрут от реальной задачи и критериев успеха
            до имени, сигилы, формы, правил, тестов и завершения сервитора.
          </p>
          <ul className="lr-passport-promo__list">
            <li>примеры и типичные ошибки на каждом этапе;</li>
            <li>12 чистовых страниц для собственной конструкции;</li>
            <li>понятные границы, ревизия и условия остановки.</li>
          </ul>
          <div className="lr-passport-promo__actions">
            <Btn
              variant="accent"
              accent={amber}
              href={PASSPORT_PRODUCT.landingUrl}
              onClick={() => {
                window.lrAnalytics?.passportPromotion('select_promotion', placement);
              }}
            >
              Посмотреть гайд →
            </Btn>
            <span className="lr-passport-promo__price">{PASSPORT_PRODUCT.price}</span>
          </div>
          <div className="lr-passport-promo__note">
            Покупка и выдача файла проходят в Tribute
          </div>
        </div>
        <a
          className="lr-passport-promo__cover-link lr-reactive-card"
          href={PASSPORT_PRODUCT.landingUrl}
          aria-label={`Подробнее о гайде «${PASSPORT_PRODUCT.title}»`}
          onClick={() => {
            window.lrAnalytics?.passportPromotion('select_promotion', `${placement}_cover`);
          }}
        >
          <img
            className="lr-passport-promo__cover"
            src="/passport-servitora/assets/cover.webp"
            alt="Обложка практического гайда «Паспорт сервитора»"
            loading="lazy"
          />
        </a>
      </div>
    </section>
  );
}

Object.assign(window, {
  LRLogo,
  Eyebrow,
  Btn,
  Tag,
  SectionTitle,
  SigilTriad,
  SigilServitor,
  PassportPromo,
});
