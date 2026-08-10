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

## Аналитика курса

`analytics.js` отправляет в GA4 отдельные события воронки курса:

- `course_cta_click` — переход в курс из hero, программы или финального экрана;
- `course_start` — первый запуск курса в текущем браузере;
- `course_resume` / `course_revisit` — возврат к незавершённому / завершённому курсу;
- `course_module_view` — открытие модуля;
- `course_progress` — достижение 25%, 50%, 75% и 100%;
- `course_complete` — явное завершение курса;
- `course_reset` — сброс сохранённого прогресса.

Прогресс хранится локально в `lr_servitor_progress_v1`. Процент считается по числу открытых модулей; 100% фиксируется только после подтверждения завершения в модуле 10.
