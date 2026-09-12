"""Regression checks for complete course publication and canonical static routes."""
from pathlib import Path
import json, re
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
        super().__init__(convert_charrefs=True);self.ids=set();self.links=[];self.assets=[];self.meta={};self.content=[];self.hide=0;self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','style'):self.hide+=1
        if tag=='h1':self.h1+=1
        if 'id' in a:self.ids.add(a['id'])
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag in ('script','img') and a.get('src'):self.assets.append(a['src'])
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.meta['canonical']=a.get('href')
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.hide-=1
    def handle_data(self,text):
        if not self.hide:self.content.append(text)

paths=['/','/servitors/','/guides/','/guides/defense-basics/','/who/','/passport-servitora/']+[f'/servitors/{n}/' for n in range(11)]
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

assert not errors,'\n'.join(errors[:70])
print(f'Publication verification passed: {checked} source lines/cells, common preface, {len(paths)} HTML pages, local assets and section links')
