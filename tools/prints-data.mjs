// PRINTS section data: content/prints/*.json + generated media maps → one
// object for the app bundle (window.LR_PRINTS) and for prerender metadata.
// Fails the build on broken relations instead of publishing a half-filled page.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const FUN_URL = /^https:\/\/fun\.ru\/[a-z0-9-]+\/[a-z0-9_]+(?:\/color-[A-Za-z]+)?$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const srcset = (variants) => variants.map((v) => `${v.src} ${v.width}w`).join(', ');

export function loadPrints(root) {
  const dir = resolve(root, 'content/prints');
  const section = readJson(resolve(dir, 'index.json'));
  const errors = [];
  const fail = (message) => errors.push(message);
  const publicFile = (url, label) => {
    if (!url?.startsWith('/media/prints/') || !existsSync(resolve(root, '.' + url))) fail(`${label}: missing ${url}`);
    return url;
  };

  // Item type for the /prints/ filter, matched by the FUN.ru product name; the
  // type with an empty pattern takes everything else (accessories).
  const types = section.item_types.map((type) => ({ ...type, test: new RegExp(type.match || '.', 'i') }));
  const typeOf = (name) => types.find((type) => type.test.test(name)).id;

  const prints = section.prints.map((slug) => {
    if (!SLUG.test(slug)) fail(`bad slug ${slug}`);
    const print = readJson(resolve(dir, `${slug}.json`));
    const media = readJson(resolve(dir, `${slug}.media.json`));
    if (print.slug !== slug || media.slug !== slug) fail(`${slug}: slug mismatch`);

    const art = media.artwork;
    publicFile(art.full.src, `${slug} artwork`);
    art.variants.forEach((v) => publicFile(v.src, `${slug} artwork`));
    if (!art.thumb) fail(`${slug}: no artwork thumb, run python tools/prints_media.py thumbs`);
    else publicFile(art.thumb.src, `${slug} thumb`);
    media.poster.forEach((v) => publicFile(v.src, `${slug} poster`));
    publicFile(media.og.src, `${slug} og`);
    if (print.video.src) publicFile(print.video.src, `${slug} video`);

    const ids = new Set();
    const products = [...print.products].sort((a, b) => a.order - b.order).map((product) => {
      if (ids.has(product.id)) fail(`${slug}: duplicate product ${product.id}`);
      ids.add(product.id);
      if (!FUN_URL.test(product.url)) fail(`${product.id}: unexpected URL ${product.url}`);
      if (!product.colors.length || !product.colors.some((c) => c.depicted)) fail(`${product.id}: no depicted color`);
      const variants = media.products[product.id];
      if (!variants?.length) fail(`${product.id}: no web image`);
      (variants || []).forEach((v) => publicFile(v.src, product.id));
      const full = variants?.[variants.length - 1];
      if (full && (full.width !== product.image.width || full.height !== product.image.height)) {
        fail(`${product.id}: web copy ${full.width}x${full.height} differs from master`);
      }
      return {
        id: product.id,
        order: product.order,
        name: product.name,
        caption: product.caption || null,
        type: typeOf(product.name),
        avatar: product.avatar,
        url: product.url,
        image: {
          alt: product.image.alt,
          width: product.image.width,
          height: product.image.height,
          src: variants?.find((v) => v.width >= 800)?.src || full?.src,
          srcset: srcset(variants || []),
          full: full?.src,
        },
        colors: product.colors.map((color) => {
          if (!FUN_URL.test(color.url) || !color.url.startsWith(product.url)) fail(`${product.id}: color URL ${color.url}`);
          const swatch = section.color_swatches[color.name];
          if (!swatch) fail(`${product.id}: no swatch for ${color.name}`);
          return { id: color.id, name: color.name, url: color.url, depicted: color.depicted, swatch };
        }),
      };
    });

    const poster = media.poster;
    return {
      id: print.id,
      slug,
      href: `/prints/${slug}/`,
      title: print.title,
      theme: print.theme || null,
      latin: print.latin,
      latinLang: print.latin_lang || 'la',
      latinNote: print.latin_note,
      intro: print.intro,
      artwork: {
        alt: print.artwork.alt,
        width: art.full.width,
        height: art.full.height,
        src: art.variants[0].src,
        srcset: srcset(art.variants),
        full: art.full.src,
        thumb: art.thumb,
      },
      video: {
        src: print.video.src || null,
        width: print.video.width,
        height: print.video.height,
        poster: {
          src: poster[poster.length - 1].src,
          srcset: srcset(poster),
          width: poster[poster.length - 1].width,
          height: poster[poster.length - 1].height,
        },
        caption: print.video.caption,
        label: print.video.accessible_label,
        pauseLabel: print.video.pause_label,
        playLabel: print.video.play_label,
      },
      film: print.film,
      story: print.story,
      assortment: print.assortment,
      products,
      seo: { ...print.seo, image: media.og },
    };
  });

  if (errors.length) throw new Error('PRINTS data:\n  ' + errors.join('\n  '));
  return {
    section: {
      title: section.title,
      href: section.route,
      eyebrow: section.eyebrow,
      intro: section.intro,
      orderNote: section.order_note,
      catalogTitle: section.catalog_title,
      filterLabel: section.filter_label,
      filterAll: section.filter_all,
      tileCta: section.tile_cta,
      types: section.item_types.map(({ id, label }) => ({ id, label })),
      stepsTitle: section.steps_title,
      steps: section.steps,
      seo: section.seo,
    },
    prints,
  };
}
