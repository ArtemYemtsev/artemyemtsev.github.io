---
description: Создать новый markdown-пост в content/<locale>/blog (по всем локалям)
argument-hint: <slug> ["Заголовок"]
---

Создай новый пост блога. Аргументы: `$ARGUMENTS` (первый — `slug` файла, далее — необязательный заголовок).

Сверься с примером @content/en/blog/faq-micromarkup.md и @CLAUDE.md (раздел «Мультиязычность»).

Сайт мультиязычный (en/ru/uk) — пост заводится в каждой локали: `content/<locale>/blog/<slug>.md`.

Шаги:
1. Создай `content/en/blog/<slug>.md` с фронтматтером:
   ```
   ---
   title: <Заголовок>
   description: <короткое описание для SEO>
   draft: true
   ---
   ```
2. Добавь заготовку тела поста в markdown (H1 = заголовок, вводный абзац). Посты рендерятся через `<ContentRenderer>` — это обычный markdown, не блочный JSON.
3. Заведи перевод поста в `content/ru/blog/<slug>.md` и `content/uk/blog/<slug>.md` (через `/translate-page` или вручную): переводи фронтматтер и тело, код/команды в бэктиках не трогай.
4. Напомни, что блог-раздел сейчас в `draft` ([content/en/blog/index.json](content/en/blog/index.json)) — публикация зависит от фильтра draft в навигации/листинге (пока не реализован).
5. Предложи открыть `/<locale>/blog/<slug>` в `npm run dev` для проверки.
