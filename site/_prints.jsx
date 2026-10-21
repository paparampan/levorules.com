// PRINTS: section index (/prints/) and one page per print (/prints/<slug>/).
// Content lives in content/prints/*.json; build.mjs validates it and ships it
// as window.LR_PRINTS. Styles: brand/prints.css. Order happens on FUN.ru only.

const PRINTS_ACCENT = 'var(--amber)';
const LR_PRINTS_DATA = window.LR_PRINTS || { section: null, prints: [] };
const PRINT_FUN_REL = 'noopener noreferrer';

function lrPrintBySlug(slug) {
  return LR_PRINTS_DATA.prints.find((print) => print.slug === slug) || null;
}

function lrPad(n) { return String(n).padStart(2, '0'); }

function lrThings(n) {
  const mod10 = n % 10, mod100 = n % 100;
  const word = mod10 === 1 && mod100 !== 11 ? 'вещь'
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'вещи' : 'вещей';
  return `${n} ${word}`;
}

function lrPrintTrack(name, params) {
  window.lrAnalytics?.event(name, params);
}

// Russian text setting: short prepositions and numbers stay with the next
// word; the print's technical line "[ … ]" keeps its mono look and never wraps.
const LR_PRINT_GLUE = /(^|[\s(])(в|к|с|и|а|о|у|я|во|ко|со|на|по|за|из|от|до|не|но)\s/giu;
function lrGlue(text) {
  return text
    .replace(LR_PRINT_GLUE, '$1$2 ').replace(LR_PRINT_GLUE, '$1$2 ')
    .replace(/(\d)\s(?=\p{L})/gu, '$1 ')
    .replace(/\b([A-Z]{2,}) (?=[A-Z]{2,}\b)/g, '$1 ');
}
function PrintText({ text }) {
  return text.split(/(\[ [^\]]+ \])/).map((part, index) => (
    index % 2 ? <span key={index} className="pr-code">{part}</span> : lrGlue(part)
  ));
}

function PrintsCrumbs({ items }) {
  return (
    <nav className="pr-crumbs" aria-label="Навигационная цепочка">
      <ol>
        {items.map((item, i) => (
          <li key={item.label}>
            {item.href
              ? <a href={item.href}>{i === 0 ? '← ' : ''}{item.label}</a>
              : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PrintSectionHead({ index, children }) {
  return (
    <p className="pr-head">
      <span className="pr-head__n">{index}</span>
      <span className="pr-head__rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

// The approved artwork is shown as is: transparent PNG on a dark plate, never cropped.
function PrintPlate({ className = '', children }) {
  return (
    <div className={`pr-plate ${className}`.trim()}>
      <span className="pr-plate__marks" aria-hidden="true"><i /><i /><i /><i /></span>
      {children}
    </div>
  );
}

function PrintArtwork({ print, sizes, eager }) {
  const art = print.artwork;
  return (
    <img
      className={`pr-artwork${art.height > art.width ? ' pr-artwork--tall' : ''}`}
      src={art.src}
      srcSet={art.srcset}
      sizes={sizes}
      width={art.width}
      height={art.height}
      alt={art.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

// ----------- /prints/ ----------
function PrintsIndex() {
  const { section, prints } = LR_PRINTS_DATA;
  return (
    <div className="pr pr-index">
      <section className="pr-index__hero">
        <div className="pr-wrap">
          <PrintsCrumbs items={[{ label: 'Лево Руля', href: '/' }, { label: 'принты' }]} />
          <Eyebrow accent={PRINTS_ACCENT} style={{ marginTop: 40 }}>{section.eyebrow}</Eyebrow>
          <h1 className="pr-index__title lr-glitch-text">ПРИН<span>ТЫ.</span></h1>
          <div className="pr-index__intro">
            <p className="pr-index__lead"><PrintText text={section.intro} /></p>
            <p className="pr-index__note">{section.orderNote}</p>
          </div>
        </div>
      </section>
      <section className="pr-registry" aria-label="Все принты">
        <div className="pr-wrap">
          <ol className="pr-registry__list">
            {prints.map((print, index) => (
              <li key={print.id} className="pr-entry">
                <PrintPlate className="pr-plate--entry">
                  <PrintArtwork print={print} eager={index === 0} sizes="(min-width: 1280px) 1120px, calc(100vw - 72px)" />
                </PrintPlate>
                <div className="pr-entry__caption">
                  <span className="pr-entry__num" aria-hidden="true">{lrPad(index + 1)}</span>
                  <h2 className="pr-entry__title">
                    <a
                      className="pr-entry__link"
                      href={print.href}
                      onClick={() => lrPrintTrack('print_select', { print_id: print.id, print_title: print.title })}
                    >
                      {print.title}
                    </a>
                  </h2>
                  <p className="pr-entry__meta">
                    <span lang={print.latinLang}>{print.latin}</span> · {lrThings(print.products.length)}
                  </p>
                  <span className="pr-entry__go" aria-hidden="true">Открыть <span>→</span></span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

// ----------- /prints/<slug>/ ----------
function PrintPage({ slug }) {
  const print = lrPrintBySlug(slug);
  return print ? <PrintPageBody key={print.id} print={print} /> : <PrintNotFound />;
}

function PrintPageBody({ print }) {
  const [viewer, setViewer] = React.useState(null);
  const opener = React.useRef(null);
  const openViewer = (state, event) => {
    opener.current = event.currentTarget;
    setViewer(state);
  };
  const closeViewer = () => {
    setViewer(null);
    requestAnimationFrame(() => opener.current?.focus());
  };

  return (
    <article className={`pr pr-print${print.theme ? ` pr-print--${print.theme}` : ''}`}>
      <PrintHero print={print} onZoom={(event) => openViewer({ kind: 'artwork' }, event)} />
      <PrintFilm print={print} />
      <PrintStory print={print} />
      <PrintAssortment print={print} onZoom={(index, event) => openViewer({ kind: 'product', index }, event)} />
      <nav className="pr-outro" aria-label="Дальше">
        <div className="pr-wrap pr-outro__inner">
          <a className="pr-btn" href="/prints/">← Все принты</a>
          <a className="pr-outro__top" href={print.href}>Наверх <span aria-hidden="true">↑</span></a>
        </div>
      </nav>
      {viewer && <PrintViewer print={print} state={viewer} onChange={setViewer} onClose={closeViewer} />}
    </article>
  );
}

// "Сделай так, чтобы пылало" → line break after the comma, last word in fire.
function PrintTitle({ title }) {
  const [lead, rest] = title.includes(', ') ? title.split(/, (.+)/) : ['', title];
  const words = rest.split(' ');
  const last = words.pop();
  return (
    <>
      {lead && <>{lead},<br /></>}
      {words.length > 0 && `${words.join(' ')} `}<span className="pr-fire">{last}</span>
    </>
  );
}

function PrintHero({ print, onZoom }) {
  return (
    <header className="pr-hero">
      <div className="pr-wrap">
        <PrintsCrumbs items={[{ label: 'Принты', href: '/prints/' }, { label: print.title }]} />
        <PrintPlate className="pr-plate--hero">
          <PrintArtwork print={print} eager sizes="(min-width: 1280px) 1120px, calc(100vw - 72px)" />
          <a
            className="pr-plate__zoom"
            href={print.artwork.full}
            onClick={(event) => {
              if (!lrPlainClick(event)) return;
              event.preventDefault();
              onZoom(event);
            }}
          >
            <span aria-hidden="true">⤢</span> Рассмотреть рисунок
          </a>
        </PrintPlate>
        <div className="pr-hero__head">
          <p className="pr-hero__latin"><span lang={print.latinLang}>{print.latin}</span> · {print.latinNote}</p>
          <h1 className="pr-hero__title" style={{ '--pr-title-chars': Math.max(...print.title.split(/\s+/).map((word) => word.length)) }}>
            <PrintTitle title={print.title} />
          </h1>
        </div>
        <div className="pr-hero__grid">
          <p className="pr-hero__lead"><PrintText text={print.intro} /></p>
          <div className="pr-hero__actions">
            <a className="pr-btn pr-btn--fire" href="#print-assortment">
              К вещам <span className="pr-btn__count">↓ {print.products.length}</span>
            </a>
            <a className="pr-btn" href="#print-story">Читать историю</a>
          </div>
        </div>
      </div>
    </header>
  );
}

// Video slot: poster until content/prints/<slug>.json gets video.src.
// States: poster (no file), playing, paused (user, reduced motion or refused
// autoplay), error (file failed: back to poster). One element per page mount.
function PrintFilm({ print }) {
  const video = print.video;
  const prerender = Boolean(window.__LR_PRERENDER__);
  const ref = React.useRef(null);
  const userPaused = React.useRef(false);
  const [status, setStatus] = React.useState(video.src ? 'paused' : 'poster');
  const live = Boolean(video.src) && status !== 'error';

  React.useEffect(() => {
    const element = ref.current;
    if (!video.src || !element) return;
    element.muted = true;
    element.defaultMuted = true;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let autoPaused = false;

    const start = () => {
      const attempt = element.play();
      if (attempt?.catch) attempt.catch((error) => { if (error?.name !== 'AbortError') setStatus('paused'); });
    };
    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((current) => (current === 'error' ? current : 'paused'));
    const onError = () => setStatus('error');
    element.addEventListener('playing', onPlaying);
    element.addEventListener('pause', onPause);
    element.addEventListener('error', onError);

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && !element.paused) { autoPaused = true; element.pause(); }
        else if (visible && autoPaused && !userPaused.current) { autoPaused = false; start(); }
      }, { threshold: 0.2 });
      observer.observe(element);
    }
    if (!reduce) start();

    return () => {
      observer?.disconnect();
      element.removeEventListener('playing', onPlaying);
      element.removeEventListener('pause', onPause);
      element.removeEventListener('error', onError);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, [video.src]);

  const toggle = () => {
    const element = ref.current;
    if (!element) return;
    if (element.paused) {
      userPaused.current = false;
      const attempt = element.play();
      if (attempt?.catch) attempt.catch(() => setStatus('paused'));
      lrPrintTrack('print_video_play', { print_id: print.id });
    } else {
      userPaused.current = true;
      element.pause();
    }
  };

  return (
    <section id="print-video" className="pr-film" aria-labelledby="print-video-title">
      <div className="pr-wrap pr-film__stage">
        <PrintSectionHead index="01">{print.film.eyebrow}</PrintSectionHead>
        <figure className="pr-film__figure">
          <div
            className={`pr-film__frame is-${status}`}
            onClick={live && !prerender ? toggle : undefined}
          >
            {live ? (
              <video
                ref={ref}
                className="pr-film__media"
                src={video.src}
                poster={video.poster.src}
                width={video.width || 1920}
                height={video.height || 1080}
                muted
                loop
                playsInline
                disablePictureInPicture
                preload={prerender ? 'none' : 'auto'}
                controls={prerender}
                aria-label={video.label}
              />
            ) : (
              <img
                className="pr-film__media"
                src={video.poster.src}
                srcSet={video.poster.srcset}
                sizes="(min-width: 1280px) 1216px, calc(100vw - 40px)"
                width={video.poster.width}
                height={video.poster.height}
                alt={video.label}
                decoding="async"
              />
            )}
            {live && !prerender && status === 'paused' && <span className="pr-film__badge" aria-hidden="true">▶</span>}
          </div>
          <figcaption className="pr-film__bar">
            <h2 id="print-video-title" className="pr-film__caption">{video.caption}</h2>
            {live && !prerender && (
              <button type="button" className="pr-film__toggle" onClick={toggle}>
                <span aria-hidden="true">{status === 'playing' ? '❚❚' : '▶'}</span>
                {status === 'playing' ? video.pauseLabel : video.playLabel}
              </button>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function PrintStory({ print }) {
  const story = print.story;
  let clause = 0;
  return (
    <section id="print-story" className="pr-story" aria-labelledby="print-story-title">
      <div className="pr-wrap">
        <PrintSectionHead index="02">{story.eyebrow}</PrintSectionHead>
        <h2 id="print-story-title" className="pr-story__title"><PrintText text={story.heading} /></h2>
        <div className="pr-story__grid">
          <aside className="pr-spec" aria-label={story.spec_title}>
            <p className="pr-spec__title">{story.spec_title}</p>
            <dl>
              {story.spec.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd><PrintText text={value} /></dd>
                </div>
              ))}
              <div>
                <dt>Носители</dt>
                <dd><a href="#print-assortment">{lrThings(print.products.length)}</a></dd>
              </div>
            </dl>
          </aside>
          <div className="pr-story__body">
            {story.paragraphs.map((paragraph, index) => paragraph.quote ? (
              <blockquote key={index} className="pr-quote">
                <p>
                  <span className="pr-quote__latin" lang={print.latinLang}>{paragraph.latin}</span>{' '}
                  <span className="pr-fire"><PrintText text={paragraph.text} /></span>
                </p>
              </blockquote>
            ) : (
              <p key={index} className="pr-story__p">
                <span className="pr-story__n" aria-hidden="true">§ {lrPad(++clause)}</span>
                <PrintText text={paragraph.text} />
              </p>
            ))}
            <a className="pr-btn pr-btn--fire pr-story__cta" href="#print-assortment">
              {story.outro_cta} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrintAssortment({ print, onZoom }) {
  const copy = print.assortment;
  const ref = React.useRef(null);
  const total = print.products.length;
  const shares3 = lrRowShares(print.products, 3);
  const shares2 = lrRowShares(print.products, 2);

  React.useEffect(() => {
    const section = ref.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      lrPrintTrack('print_assortment_view', { print_id: print.id, items: total });
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [print.id]);

  return (
    <section id="print-assortment" ref={ref} className="pr-assort" aria-labelledby="print-assortment-title">
      <div className="pr-wrap">
        <div className="pr-assort__head">
          <div>
            <PrintSectionHead index="03">{copy.eyebrow} · {lrThings(total)}</PrintSectionHead>
            <h2 id="print-assortment-title" className="pr-assort__title"><PrintText text={copy.title} /></h2>
          </div>
          <div className="pr-assort__notes">
            <p><PrintText text={copy.intro} /></p>
            <p className="pr-assort__fine"><PrintText text={[copy.availability_note, copy.styling_note].filter(Boolean).join(' ')} /></p>
          </div>
        </div>
        <ol className="pr-grid">
          {print.products.map((product, index) => (
            <PrintProductCard
              key={product.id}
              print={print}
              product={product}
              index={index}
              shares={[shares3[index], shares2[index]]}
              onZoom={onZoom}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

// Every photo in a row gets the same height: each card's share of the row
// width follows its photo's aspect ratio, so nothing is cropped. A short last
// row is padded with virtual 2:3 photos and centred instead of stretched.
function lrRowShares(products, perRow) {
  const ratios = products.map((product) => product.image.width / product.image.height);
  return ratios.map((ratio, index) => {
    const start = index - (index % perRow);
    const row = ratios.slice(start, start + perRow);
    const total = row.reduce((sum, value) => sum + value, 0) + (perRow - row.length) * (2 / 3);
    return ratio / total;
  });
}

function lrTrackProduct(print, product, kind, color) {
  lrPrintTrack('print_product_click', {
    print_id: print.id,
    item_id: product.id,
    item_name: product.name,
    item_color: color?.name,
    link_kind: kind,
    link_url: color?.url || product.url,
  });
}

function PrintColors({ print, product, placement }) {
  const copy = print.assortment;
  const labelId = `${placement}-${product.id}-colors`;
  return (
    <div className="pr-colors">
      <p className="pr-colors__label" id={labelId}>{copy.colors_label}</p>
      <ul className="pr-colors__list" aria-labelledby={labelId}>
        {product.colors.map((color) => (
          <li key={color.id}>
            <a
              className="pr-chip"
              href={color.url}
              target="_blank"
              rel={PRINT_FUN_REL}
              onClick={() => lrTrackProduct(print, product, `${placement}_color`, color)}
            >
              <span className="pr-chip__dot" style={{ '--pr-swatch': color.swatch }} aria-hidden="true" />
              <span className="pr-sr">{product.name}, цвет </span>
              {color.name}
              {color.depicted && <span className="pr-chip__tag">{copy.depicted_label}</span>}
              <span className="pr-sr">, открыть на FUN.ru в новой вкладке</span>
              <span className="pr-chip__out" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The CTA opens the color variant shown in the photo, not the default one.
function PrintCta({ print, product, placement }) {
  const depicted = product.colors.find((color) => color.depicted);
  return (
    <a
      className="pr-cta"
      href={depicted?.url || product.url}
      target="_blank"
      rel={PRINT_FUN_REL}
      onClick={() => lrTrackProduct(print, product, placement, depicted)}
    >
      {print.assortment.cta}
      <span className="pr-sr">: {product.name}, откроется в новой вкладке</span>
      <span className="pr-cta__out" aria-hidden="true">↗</span>
    </a>
  );
}

function PrintProductCard({ print, product, index, shares, onZoom }) {
  const image = product.image;
  const total = print.products.length;
  const [share3, share2] = shares;
  return (
    <li
      className="pr-card"
      style={{ '--pr-ratio': `${image.width} / ${image.height}`, '--pr-share-3': share3.toFixed(4), '--pr-share-2': share2.toFixed(4) }}
    >
      <a
        className="pr-card__media"
        href={image.full}
        onClick={(event) => {
          if (!lrPlainClick(event)) return;
          event.preventDefault();
          onZoom(index, event);
        }}
      >
        <img
          src={image.src}
          srcSet={image.srcset}
          sizes={`(min-width: 1100px) ${Math.round(1160 * share3)}px, (min-width: 721px) calc((100vw - 84px) * ${share2.toFixed(3)}), calc(100vw - 40px)`}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading="lazy"
          decoding="async"
        />
        <span className="pr-card__zoom">
          <span aria-hidden="true">⤢</span>
          <span className="pr-card__zoom-text">{print.assortment.zoom_label}</span>
          <span className="pr-sr"> крупно: {product.name}</span>
        </span>
      </a>
      <div className="pr-card__body">
        <p className="pr-card__num" aria-hidden="true">{lrPad(index + 1)} / {lrPad(total)}</p>
        <h3 className="pr-card__name"><PrintText text={product.name} /></h3>
        <PrintColors print={print} product={product} placement="card" />
        <PrintCta print={print} product={product} placement="card" />
      </div>
    </li>
  );
}

// Full-size view for the artwork and every product scene. Native <dialog>
// keeps focus inside; Escape and the backdrop close it; ←/→ switch products.
function PrintViewer({ print, state, onChange, onClose }) {
  const ref = React.useRef(null);
  const closeRef = React.useRef(null);
  const [zoomed, setZoomed] = React.useState(false);
  const zoomedRef = React.useRef(false);
  zoomedRef.current = zoomed;
  const isProduct = state.kind === 'product';
  const total = print.products.length;
  const product = isProduct ? print.products[state.index] : null;
  // `preview` is the copy already shown on the page: it fills the frame while the full file loads.
  const image = isProduct
    ? { src: product.image.full, preview: product.image.src, width: product.image.width, height: product.image.height, alt: product.image.alt }
    : { src: print.artwork.full, preview: print.artwork.src, width: print.artwork.width, height: print.artwork.height, alt: print.artwork.alt };
  const step = (delta) => onChange({ kind: 'product', index: (state.index + delta + total) % total });

  React.useEffect(() => {
    if (!isProduct) return;
    [1, -1].forEach((delta) => { new Image().src = print.products[(state.index + delta + total) % total].image.full; });
  }, [state.index]);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    closeRef.current?.focus();
    const onCancel = (event) => { event.preventDefault(); onClose(); };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, []);

  React.useEffect(() => {
    setZoomed(false);
    if (!isProduct) return;
    const onKey = (event) => {
      // A zoomed image keeps the arrows for panning.
      if (zoomedRef.current) return;
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    const dialog = ref.current;
    dialog.addEventListener('keydown', onKey);
    return () => dialog.removeEventListener('keydown', onKey);
  }, [state.kind, state.index]);

  return (
    <dialog
      ref={ref}
      className={`pr-viewer${isProduct ? ' pr-viewer--product' : ' pr-viewer--art'}`}
      aria-labelledby="pr-viewer-title"
      onClick={(event) => { if (event.target === ref.current) onClose(); }}
    >
      <div className="pr-viewer__bar">
        <p id="pr-viewer-title" className="pr-viewer__title">
          {isProduct
            ? <><span className="pr-viewer__count">{lrPad(state.index + 1)} / {lrPad(total)}</span> {product.name}</>
            : <><span lang={print.latinLang}>{print.latin}</span> · оригинал принта</>}
        </p>
        <div className="pr-viewer__tools">
          {isProduct && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Предыдущая вещь">←</button>
              <button type="button" onClick={() => step(1)} aria-label="Следующая вещь">→</button>
            </>
          )}
          <button type="button" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
            {zoomed ? 'Вписать' : 'Увеличить'}
          </button>
          <button ref={closeRef} type="button" className="pr-viewer__close" onClick={onClose}>
            Закрыть <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <div className={`pr-viewer__stage${zoomed ? ' is-zoomed' : ''}`}>
        <img
          key={image.src}
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          style={{ backgroundImage: `url(${image.preview})` }}
          onClick={() => setZoomed((value) => !value)}
        />
      </div>
      {isProduct && (
        <div className="pr-viewer__info">
          <PrintColors print={print} product={product} placement="viewer" />
          <PrintCta print={print} product={product} placement="viewer" />
        </div>
      )}
    </dialog>
  );
}

function PrintNotFound() {
  return (
    <section className="pr pr-missing">
      <div className="pr-wrap">
        <PrintsCrumbs items={[{ label: 'Принты', href: '/prints/' }, { label: 'не найден' }]} />
        <h1 className="pr-missing__title">Такого принта нет</h1>
        <p className="pr-missing__lead">Возможно, ссылка устарела. Все опубликованные рисунки собраны на странице раздела.</p>
        <a className="pr-btn pr-btn--fire" href="/prints/">Все принты</a>
      </div>
    </section>
  );
}

Object.assign(window, { PrintsIndex, PrintPage, lrPrintBySlug });
