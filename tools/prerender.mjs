import vm from 'node:vm';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function prerender({root, publicDir}) {
  const template = readFileSync(resolve(publicDir,'index.html'), 'utf8');
  const modules = Array.from({length:11}, (_, n) => JSON.parse(readFileSync(resolve(root, 'dist/course', `${n}.json`), 'utf8')));
  const routes = [
    ['/', 'ЛЕВО РУЛЯ · Магия хаоса и ПЛР', 'Антидогматический оккультизм: магия хаоса, демонология, путь левой руки. Открытый курс «Сервиторы»: 11 модулей без регистрации и оплаты.'],
    ['/servitors/', 'Сервиторы — бесплатный курс · Лево Руля', 'Авторский курс о сервиторах: история, проектирование, критическая проверка и завершение. 11 модулей, бесплатные PDF и шаблоны.'],
    ['/guides/', 'Гайды · Лево Руля', 'Открытые статьи, протоколы и разборы магической практики. Базовые техники защиты и рабочая тетрадь «Паспорт сервитора».'],
    ['/guides/defense-basics/', 'Базовые техники защиты · Лево Руля', 'Бесплатный гайд: две парадигмы защиты, работа с вниманием, сигилы, заземление и проверка ощущения угрозы.'],
    ['/who/', 'Об авторе · Лево Руля', 'Антон, автор «Лево Руля»: подход к источникам, авторским моделям, практике и исправлению материалов.'],
    ...modules.map((mod,n) => [`/servitors/${n}/`, `Сервиторы: ${mod.title} · Модуль ${mod.n} · Лево Руля`, (mod.sub || mod.sections.map(s => s.title).join('. ')).replace(/[*`]/g,'').slice(0,230)]),
  ];
  for (const [path,title,description] of routes) {
    const location = {pathname:path,hash:'',origin:'https://levorules.com',href:'https://levorules.com'+path};
    const context = {React:{...React,useLayoutEffect:React.useEffect},location,console,URL,URLSearchParams,TextEncoder,TextDecoder,__LR_PRERENDER__:true};
    context.window=context;
    context.localStorage={getItem:()=>null};
    vm.createContext(context);
    vm.runInContext(readFileSync(resolve(root,'dist/servitors.js'),'utf8'),context);
    context.SERVITORS_MODULES=modules;
    vm.runInContext(readFileSync(resolve(root,'dist/app.js'),'utf8'),context);
    let body=renderToString(React.createElement(context.App));
    // Fallback markup supports navigation without JavaScript too.
    body=body.replace(/href="#home"/g,'href="/"').replace(/href="#servitors"/g,'href="/servitors/"');
    let html=template.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
    const metadata=Object.fromEntries(routes.map(([url,title,description])=>[url,{title,description}]));
    html=html.replace('  window.__TWEAKS__ =',`  window.__LR_PAGE_META__ = ${JSON.stringify(metadata).replaceAll('<','\\u003c')};\n  window.__TWEAKS__ =`);
    html=html.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`);
    for(const [attribute,name,value] of [['name','description',description],['property','og:title',title],['property','og:description',description],['property','og:url',location.href],['name','twitter:title',title],['name','twitter:description',description]]) {
      html=html.replace(new RegExp(`<meta ${attribute}="${name}" content="[^"]*">`),`<meta ${attribute}="${name}" content="${escape(value)}">`);
    }
    html=html.replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${location.href}">`);
    const directory=resolve(publicDir,'.'+path);
    mkdirSync(directory,{recursive:true});
    writeFileSync(resolve(directory,'index.html'),html);
  }
  const urls=[...routes.map(r=>r[0]),'/passport-servitora/','/uploads/servitors.pdf'];
  writeFileSync(resolve(publicDir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(path=>`  <url><loc>https://levorules.com${path}</loc></url>`).join('\n')+'\n</urlset>\n');
  console.log(`Prerendered ${routes.length} routes with readable HTML and canonical metadata`);
}
