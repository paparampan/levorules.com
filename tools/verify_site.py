"""Regression checks for complete course publication and canonical static routes."""
from pathlib import Path
import json, re, hashlib, shutil, subprocess
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
errors=[]

def strings(value):
    if isinstance(value,str): yield value
    elif isinstance(value,list):
        for item in value: yield from strings(item)
    elif isinstance(value,dict):
        for item in value.values(): yield from strings(item)

def normalize(text):
    return ' '.join(re.findall(r'\w+',text.lower(),re.UNICODE))

source=(ROOT/'content/servitors-course.md').read_text(encoding='utf8')
module_bodies=re.split(r'^# МОДУЛЬ \d+\. [^\n]+\n',source,flags=re.M)[1:]
module_bodies[-1]=module_bodies[-1].split('# ПРИЛОЖЕНИЕ A.',1)[0]
checked=0
expected_by_module={}
for n,body in enumerate(module_bodies):
    data=json.loads((PUBLIC/f'dist/course/{n}.json').read_text(encoding='utf8'))
    published=normalize(' '.join(strings(data)))
    expected_by_module[n]=[]
    for line in body.splitlines():
        line=line.strip()
        if not line or line in ('---','```') or line.startswith(('### Практика Модуля','### Вопросы для самопроверки')):continue
        line=re.sub(r'^## \d+\.\d+\. ','',line)
        line=re.sub(r'^\d+\. ','',line)
        cells=line.strip('|').split('|') if line.startswith('|') else [line]
        for cell in cells:
            expected=normalize(cell)
            if expected and expected not in published: errors.append(f'Module {n}: missing content: {cell[:95]}')
            expected_by_module[n].append(re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',cell))
            checked+=bool(expected)
preface=source.split('## ВАЖНО ПЕРЕД НАЧАЛОМ',1)[1].split('## ОГЛАВЛЕНИЕ',1)[0]
intro=json.loads((PUBLIC/'dist/course/0.json').read_text(encoding='utf8'))['intro']
for paragraph in preface.split('\n\n'):
    if normalize(paragraph) not in normalize(' '.join(strings(intro))):errors.append('Missing common preface')

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True);self.ids=set();self.links=[];self.assets=[];self.meta={};self.content=[];self.hide=0;self.h1=0;self.anchors=[];self.images=[];self.videos=0;self.cards=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','style'):self.hide+=1
        if tag=='h1':self.h1+=1
        if 'id' in a:self.ids.add(a['id'])
        if tag=='a' and a.get('href'):self.links.append(a['href']);self.anchors.append(a)
        if tag in ('script','img','video') and a.get('src'):self.assets.append(a['src'])
        if tag=='img' and a.get('src'):self.images.append(a['src'])
        if tag=='video':self.videos+=1;self.assets+=[a['poster']] if a.get('poster') else []
        if a.get('srcset'):self.assets+=[item.strip().split(' ')[0] for item in a['srcset'].split(',')]
        if tag=='li' and 'pr-card' in a.get('class','').split():self.cards+=1
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.meta['canonical']=a.get('href')
        if tag=='link' and a.get('rel')=='stylesheet' and a.get('href'):self.assets.append(a['href'])
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.hide-=1
    def handle_data(self,text):
        if not self.hide:self.content.append(text)

prints_section=json.loads((ROOT/'content/prints/index.json').read_text(encoding='utf8'))
prints={slug:json.loads((ROOT/f'content/prints/{slug}.json').read_text(encoding='utf8')) for slug in prints_section['prints']}
paths=['/','/servitors/','/guides/','/guides/defense-basics/','/who/','/passport-servitora/','/prints/']+[f'/prints/{slug}/' for slug in prints]+[f'/servitors/{n}/' for n in range(11)]
pages={}
for route in paths:
    page=Page();page.feed((PUBLIC/route.lstrip('/')/'index.html').read_text(encoding='utf8'));pages[route]=page
    if page.h1!=1:errors.append(f'{route}: expected one h1, got {page.h1}')
    if len(' '.join(page.content))<500:errors.append(f'{route}: empty static content')
    if page.meta.get('canonical')!='https://levorules.com'+route:errors.append(f'{route}: wrong canonical')
    if page.meta.get('og:url')!='https://levorules.com'+route:errors.append(f'{route}: wrong og:url')
    if not page.meta.get('description'):errors.append(f'{route}: missing description')
for route,page in pages.items():
    for href in page.links+page.assets:
        parts=urlsplit(href)
        if parts.scheme or parts.netloc:continue
        path=unquote(parts.path)
        if path and not path.startswith('/'):errors.append(f'{route}: relative asset/link {href}');continue
        destination=path or route
        if destination in pages:
            if parts.fragment and parts.fragment not in pages[destination].ids and parts.fragment not in ['home','servitors','guides','who']:errors.append(f'{route}: broken anchor {href}')
        elif not (PUBLIC/destination.lstrip('/')).exists():errors.append(f'{route}: missing target {href}')

for n,expected in expected_by_module.items():
    visible=normalize(' '.join(pages[f'/servitors/{n}/'].content))
    for item in expected:
        if normalize(item) not in visible:errors.append(f'Module {n}: missing in rendered HTML: {item[:95]}')

# PRINTS: the index shows artwork only; each print page carries its full text,
# the approved artwork byte for byte and every product/color link from JSON.
for route in ('/','/servitors/','/who/'):
    if pages[route].links.count('/prints/')<2:errors.append(f'{route}: PRINTS missing from header or footer')
if any('/artwork-' not in src for src in pages['/prints/'].images if src.startswith('/media/')):errors.append('/prints/: product photos on the index page')
sitemap=(PUBLIC/'sitemap.xml').read_text(encoding='utf8')
fun_links=0
FUN_PROFILE='https://fun.ru/designer/levorules'  # footer link on every page, not a product
for slug,data in prints.items():
    route=f'/prints/{slug}/';page=pages[route];visible=normalize(' '.join(page.content))
    if f'/prints/{slug}/' not in ' '.join(pages['/prints/'].links):errors.append(f'/prints/: no link to {slug}')
    if f'https://levorules.com{route}' not in sitemap:errors.append(f'sitemap: missing {route}')
    image=page.meta.get('og:image','')
    if not image.startswith('https://levorules.com/media/prints/') or not (PUBLIC/urlsplit(image).path.lstrip('/')).exists():errors.append(f'{route}: og:image {image}')
    media=json.loads((ROOT/f'content/prints/{slug}.media.json').read_text(encoding='utf8'))
    art=PUBLIC/media['artwork']['full']['src'].lstrip('/')
    if hashlib.sha256(art.read_bytes()).hexdigest()!=data['artwork']['sha256']:errors.append(f'{route}: artwork differs from the approved original')
    for text in [data['title'],data['intro'],data['video']['caption']]+[p['text'] for p in data['story']['paragraphs']]:
        if normalize(text) not in visible:errors.append(f'{route}: missing text: {text[:80]}')
    if page.cards!=len(data['products']):errors.append(f'{route}: {page.cards} product cards, expected {len(data["products"])}')
    expected={p['url'] for p in data['products']}|{c['url'] for p in data['products'] for c in p['colors']}
    found=set()
    for a in page.anchors:
        if urlsplit(a['href']).netloc!='fun.ru':continue
        if a.get('target')!='_blank' or not {'noopener','noreferrer'}<=set(a.get('rel','').split()):errors.append(f'{route}: FUN.ru link without new tab/noopener noreferrer: {a["href"]}')
        if a['href']==FUN_PROFILE:continue
        fun_links+=1;found.add(a['href'])
        if a['href'] not in expected:errors.append(f'{route}: unexpected FUN.ru link {a["href"]}')
    for url in expected-found:errors.append(f'{route}: missing FUN.ru link {url}')
    for product in data['products']:
        if not any(src.startswith(f'/media/prints/{slug}/{product["order"]:02d}-') for src in page.images):errors.append(f'{route}: no image for {product["id"]}')
    video=data['video']
    if not video['src']:
        if page.videos:errors.append(f'{route}: <video> rendered without a file')
        if not any('/poster-' in src for src in page.images):errors.append(f'{route}: poster missing while video.src is null')
    else:
        file=PUBLIC/video['src'].lstrip('/')
        if not file.exists():errors.append(f'{route}: missing video {video["src"]}')
        elif shutil.which('ffprobe'):
            probe=json.loads(subprocess.run(['ffprobe','-v','error','-print_format','json','-show_streams',str(file)],capture_output=True,text=True,check=True).stdout)
            streams=probe['streams'];v=next(s for s in streams if s['codec_type']=='video')
            if any(s['codec_type']=='audio' for s in streams):errors.append(f'{route}: video has an audio stream')
            if abs(int(v['width'])/int(v['height'])-16/9)>0.002:errors.append(f'{route}: video is not 16:9')

assert not errors,'\n'.join(errors[:70])
print(f'Publication verification passed: {checked} source lines/cells, common preface, {len(paths)} HTML pages, local assets and section links, {len(prints)} print page(s) with {fun_links} FUN.ru links')
