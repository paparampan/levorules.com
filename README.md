# levorules.com

Исходники сайта и открытого курса «Сервиторы».

## Сборка сайта

```bash
npm ci
npm run build
```

Команда создаёт `public/` — единственный каталог, который разрешено публиковать в Cloudflare. Корень репозитория содержит исходники и служебные файлы и не должен раздаваться как static assets.

## Обновление курса

Канонический текст находится в `content/servitors-course.md`.

```bash
npm run content:jsx
```

Команда обновляет веб-версию курса в `site/_servitors-content-1.jsx` и `site/_servitors-content-2.jsx`.

## Пересборка PDF

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-pdf.txt
python -m playwright install chromium
npm run content:pdf
```

PDF создаются непосредственно в `uploads/` и `uploads/appendices/`. Генератор включает структуру тегов и PDF-outline для доступности.

## Полная проверка

```bash
npm test
```

Проверка заново генерирует JSX из канонического Markdown, собирает production-артефакт `public/` и запускает регрессионный аудит структуры курса, опасных формулировок и публичного allowlist.
