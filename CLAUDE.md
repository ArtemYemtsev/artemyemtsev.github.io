# CLAUDE.md — гайд по проекту

> Персональный сайт Артёма Емцева: визитка / резюме фронтенд-разработчика + площадка для услуг и (в перспективе) блога. Технически — Nuxt 4 + `@nuxt/content` v3 с самописной **блочной (модульной) системой** страниц без отдельного бэкенда: весь контент ведётся через JSON/Markdown.

## Язык и общение
- Отвечай и пиши документацию/коммиты **на русском**. Код, имена файлов, классы, типы, конвенции — на английском.
- Контекст приватности: проект **не анонсируется публично** (NDA текущего работодателя на тему фриланса). Пока живёт на GitHub как запасной вариант. Не предлагай публичных анонсов, постов в соцсети от лица компании и т.п.

## Стек
- **Nuxt 4** (`compatibilityDate: 2025-07-15`), Vue 3 `<script setup lang="ts">`, TypeScript.
- **@nuxt/content v3** (better-sqlite3) — контент-слой. `queryCollection('content')`, `queryCollectionNavigation('content')`.
- **@nuxtjs/i18n v10** — мультиязычность (en/ru/uk). См. раздел «Мультиязычность».
- **SCSS** — архитектура 7-1 в `app/assets/styles`, подключение через `app/assets/styles/main.scss`.
- **@nuxt/eslint** — линтинг.
- Деплой задуман на **GitHub Pages** (репозиторий `artemyemtsev.github.io`) — статическая генерация `nuxt generate`.

## Команды
```bash
npm run dev        # дев-сервер http://localhost:3000
npm run build      # SSR-сборка
npm run generate   # статическая генерация (для GitHub Pages → .output/public)
npm run preview    # предпросмотр сборки
npx eslint .       # линт
```

## Ядро: блочная система страниц

Контент страницы — это файл `content/<slug>/index.json` с массивом `body[]`. Каждый блок имеет поле `type`, по которому он маппится на Vue-компонент.

**Поток рендера** ([app/pages/[...slug].vue](app/pages/%5B...slug%5D.vue)):
1. `queryCollection('content').path(route.path).first()` достаёт документ по пути.
2. Если `page.body` — **массив**, рендерится цепочка `<component :is="componentsMap[block.type]" v-bind="block" />`.
3. Если `body` — **не массив** (markdown-посты), рендерится `<ContentRenderer :value="page" />`.

`componentsMap` вынесен в [app/blocks/componentsMap.ts](app/blocks/componentsMap.ts) и импортируется в `[...slug].vue` одной строкой — **любой новый блок регистрируется в этом файле** (импорт компонента + строка в map).

### Конвенция именования блоков
| Файл компонента | `type` в JSON |
|---|---|
| `app/components/Section/Hero/Primary.vue` | `hero-primary` |
| `app/components/Section/About/Primary.vue` | `about-primary` |
| `app/components/Section/DemoUI/Buttons.vue` | `demo-ui-buttons` |
| `app/components/Section/Services/Primary.vue` | `services-primary` |
| `app/components/Section/Technologies/index.vue` | `technologies` |

Правило: `Section/<Group>/<Variant>.vue` → `type = kebab-case(Group) + '-' + kebab-case(Variant)`. Если файл — `index.vue`, то `type = kebab-case(Group)` (например `technologies`). Составные имена групп режутся по словам: `DemoUI` → `demo-ui`.

### Анатомия блочного компонента
- `defineProps<{...}>()` — props **в точности повторяют ключи блока в JSON** (кроме `type`). Все поля опциональны (`?`), т.к. контент может быть неполным.
- Шаблон оборачивается в `<section class="<group> <group>--<variant>">` с внутренним `.container`.
- Стили — `<style lang="scss" scoped>`, BEM-нейминг (`block__element--modifier`).
- HTML из контента выводится через `v-html` (см. `about-primary`), плоский текст — через `{{ }}`.

### Скрытие блока
Поле `"hidden": true` в блоке — способ держать готовые данные в контенте, но не выводить секцию. Фильтр стоит в [\[...slug\].vue](app/pages/%5B...slug%5D.vue) перед `v-for`. Используется для `projects-primary` на главной, пока портфолио не наполнено.

### Контент-файлы
- **Контент разложен по локалям**: `content/<locale>/<slug>/index.json` → доступна по `/<locale>/<slug>`. Главная локали — `content/<locale>/index.json` → `/<locale>`. Локали: `en`, `ru`, `uk`.
- Поля верхнего уровня документа: `title`, `description`, `order` (порядок в навигации), `draft` (скрыть), `body[]`.
- Навигация ([Header.vue](app/components/Layout/Header.vue)) строится из `queryCollectionNavigation('content')` и **фильтруется до текущей локали** (берётся узел `/<locale>` и его `children`).
- Блог: markdown-файлы `content/<locale>/blog/*.md` с фронтматтером (`title`, `description`, `draft`). Рендерятся через `<ContentRenderer>`.

## Мультиязычность (i18n)
Сайт трёхъязычный: **en (основной), ru, uk**. Модуль — `@nuxtjs/i18n` ([nuxt.config.ts](nuxt.config.ts)).
- **Стратегия URL** — `prefix`: у всех языков префикс (`/en/about`, `/ru/about`, `/uk/about`). Чистого `/` нет.
- **Контент** зеркалится по папкам `content/<locale>/**`. Путь документа = путь маршрута: `content/ru/about/index.json` → `/ru/about`. Поэтому `[...slug].vue` работает **без изменений** — он ищет страницу по `route.path`, который уже несёт префикс локали.
- **UI-строки** (обвязка: футер, подписи) — в `i18n/locales/<code>.json`, выводятся через `$t('...')`. Пункты меню НЕ здесь — они берутся из `title` контент-страниц.
- **Переключатель языка** — в [Header.vue](app/components/Layout/Header.vue): подменяет первый сегмент `route.path` на код локали (`/ru/about` → `/en/about`).
- **Автоопределение** — `detectBrowserLanguage` (cookie `i18n_locale` → `navigator.language` → `en`), `redirectOn: 'root'`. Работает на клиенте (статика).
- **Корневой редирект** — [public/index.html](public/index.html): статическая страница-редирект для `/` (на GitHub Pages серверного редиректа нет). Та же логика приоритета: cookie → язык браузера → `en`.
- **GitHub Pages**: репозиторий `artemyemtsev.github.io` — это **user-страница** (отдаётся с корня домена), значит `baseURL = '/'`, под-путь не нужен.
- **Добавление перевода** — команда `/translate-page <slug>`: копирует структуру блоков из `en` в `ru`/`uk` и переводит только текстовые поля. Набор блоков и ключей во всех локалях должен совпадать.

## Стили и UI-конвенции
- Единицы — **`rem`**, базовый `font-size: 62.5%` (`1rem = 10px`). Размеры пиши в `rem`.
- Цвета и размеры темы — **CSS-переменные** в [_variables.scss](app/assets/styles/abstracts/_variables.scss) (`--font-accent`, `--bg-main`, `--color-green-*` и т.д.). Не хардкодь hex в компонентах — добавляй/используй переменные.
- Адаптив — **mobile-first**, миксин `@include min-width(md|lg|xl|2xl...)` из [_mixins.scss](app/assets/styles/abstracts/_mixins.scss).
- Миксины из `_mixins.scss` доступны в `scoped`-стилях компонентов **глобально** — через инжект `@use "@/assets/styles/abstracts/mixins" as *` в `vite.css.preprocessorOptions.scss.additionalData` ([nuxt.config.ts](nuxt.config.ts)). Отдельный `@use` в компоненте писать НЕ нужно. Инжект намеренно не льётся в `abstracts/` (иначе `mixins.scss` заимпортил бы себя). CSS-переменные (`--font-accent` и т.д.) глобальны и так — они в `:root` через `main.scss`.
- Иконки — SVG-спрайт: `<svg><use :xlink:href="`/sprite.svg#<icon-name>`" /></svg>`. Файл — [public/sprite.svg](public/sprite.svg).
- **Два набора иконок в спрайте, не смешивай в одном ряду.** Технологии/бренды — `viewBox="0 0 200 200"`, арт занимает ~50–60% коробки (широкий внутренний отступ). Соц/UI (`telegram-icon`, `linkedin-icon`, `instagram-icon`, `email-icon`) — `viewBox="0 0 24 24"`, арт заполняет ~85%. При одинаковых CSS-размерах `200`-иконка выглядит на ~40% мельче `24`-й. Если нужна `200`-иконка в соц-ряду — заводи вариант с подрезанным `viewBox` до ~84% заполнения (образец: `github-social-icon`, `viewBox="40 40 120 120"`), а не масштабируй трансформом.
- Глобальные классы: `.container`, `.section-label`, `.button.--primary/--secondary`. **`.underline-link` глобальным НЕ является** — вопреки прежней записи здесь он объявлен только в scoped-стилях [Header.vue](app/components/Layout/Header.vue) и [DemoUI/Buttons.vue](app/components/Section/DemoUI/Buttons.vue), то есть в других компонентах это пустой класс. Либо вынеси его в `app/assets/styles/layout/`, либо стилизуй ссылку локально.
- Новые стили блоков держи в `scoped` внутри компонента; общие/layout-стили — в `app/assets/styles/layout/*` и подключай в `main.scss`.

## Важно про завершающий слэш в путях
`[...slug].vue` **нормализует `route.path`**, срезая завершающий слэш, и только потом идёт в `queryCollection`. Причина: в контенте пути документов лежат без слэша (`/en`, `/en/about`), а статика отдаёт директорию по адресу со слэшем (`/en/` — так делает и `serve`, и GitHub Pages). Без нормализации пререндер отрабатывает нормально (он ходит по путям без слэша), а вот на клиенте после гидрации документ не находится и страница подменяется 404-й. Проявляется только при прямом заходе на URL со слэшем — по внутренним `NuxtLink` пути всегда без него, поэтому в дев-режиме баг незаметен.

## Важно про коллекцию контента
**Не добавляй `content.config.ts` с коллекцией `type: 'page''`.** Проверено: такой конфиг парсит JSON-поле `body` в markdown-дерево, после чего `Array.isArray(page.body)` становится `false` и блочный рендер ломается (страница уходит в ветку `ContentRenderer` и пустеет). Блочная система **сознательно держится на дефолтной коллекции** `@nuxt/content`, которая сохраняет `body` как сырой массив. Если когда-нибудь захочется типобезопасную схему — это потребует рефактора: переименовать поле `body` → `blocks` в JSON и в `[...slug].vue`, и только тогда объявлять коллекцию.

## Известные узкие места / TODO
Поддерживай этот список актуальным при работе.
- [x] ~~`type: "contacts"` не зарегистрирован в `componentsMap`~~ — добавлен компонент [Contacts/index.vue](app/components/Section/Contacts/index.vue) и регистрация.
- [x] ~~`draft`/`order` строками~~ — приведены к `boolean`/`number` во всех `content/**/*.json`.
- [x] ~~Мультиязычность~~ — внедрена (en/ru/uk) на `@nuxtjs/i18n`, см. раздел «Мультиязычность».
- [ ] Фильтрация навигации по `draft` не реализована (дефолтная коллекция не отдаёт `draft` как колонку для `.where()`); сейчас `blog` (`draft: true`) виден в меню всех локалей. Реализовывать — JS-фильтром после запроса или рефактором коллекции (см. блок выше).
- [x] ~~[Services/Primary.vue](app/components/Section/Services/Primary.vue) — заглушка~~ — свёрстан: 4 карточки (иконка в плашке + `h3` + описание), сетка 1 → 2 (`md`) → 4 (`xl`). Данные — блок `services-primary` в `content/<locale>/index.json` по трём локалям.
- [ ] Страницы About / Services / Blog во всех локалях содержат только `hero` — контент не наполнен.
- [ ] `type: "portfolio"` (страница Projects, все локали) **не зарегистрирован** в `componentsMap` — компонента `Section/Portfolio/index.vue` нет, блок молча не рендерится. Данные готовы: `filter[]` с тремя категориями, `portfolio-items: []` пустой.
- [ ] Коллизия `order`: и `about`, и `projects` имеют `order: 1` во всех локалях — порядок этих двух пунктов в меню недетерминирован. Развести нумерацию (например `about: 1`, `projects: 2`, `services: 3`, `blog: 4`, `contacts: 5`) сразу во всех трёх локалях.
- [ ] Footer хардкодит контакты/соцссылки (дублируют `content/<locale>/contacts/index.json`).
- [ ] GitHub Pages деплой не настроен (нет `app.baseURL`, nitro preset, GH Actions workflow). Учесть: репо — user-страница, `baseURL = '/'`.
- [ ] **Форма не подключена к отправке.** [Contacts/Simple.vue](app/components/Section/Contacts/Simple.vue) свёрстан и валидируется, но `endpoint` в `content/<locale>/index.json` пустой — по submit форма честно пишет «канал не настроен», а не имитирует успех. **До мержа в `main` нужно либо задать `endpoint`, либо поставить блоку `hidden: true`**, иначе на живом сайте посетитель упрётся в нерабочую форму. Варианты канала — см. пункт про форму-бриф ниже.
- [ ] `projects-primary` на главной скрыт (`hidden: true`), `items: []`. Разметка карточки готова и проверена (image / type / title / description / technologies / link). Ждёт наполнения + отдельной страницы проекта.
- [ ] **Форма-бриф на сайте** (отложено): секция-блок с базовым брифом-заявкой (поля — см. [docs/client-brief.md](docs/client-brief.md), раздел «Сокращённый бриф для формы»). Свёрстать форму + валидацию по блочной системе. Открытый вопрос — **способ отправки** (сайт статический, бэкенда нет): варианты — Web3Forms/Formspree на email / Telegram-бот напрямую (токен светится в JS) / serverless-прокси → Telegram. Решить до реализации submit.

## Кастомные команды (`.claude/commands`)
- `/start` — разогрев сессии: читает правила, память, команды/скиллы и состояние гита, выдаёт бриф «готов к работе». Запускай первой в новой сессии.
- `/new-section <Group> <Variant>` — скаффолд блочного компонента + регистрация в `componentsMap` + пример блока в JSON.
- `/new-page <slug>` — новая контент-страница `content/<locale>/<slug>/index.json`.
- `/new-post <slug>` — новый markdown-пост в `content/<locale>/blog`.
- `/translate-page <slug>` — перевести/синхронизировать страницу по всем локалям (en/ru/uk).
- `/content-check` — аудит: все ли `type` из JSON есть в `componentsMap`, корректны ли `draft`/`order`, нет ли битых ссылок на иконки спрайта.

## Рабочие правила
- После добавления/правки блока **проверяй три точки**: (1) компонент, (2) запись в `componentsMap`, (3) данные блока в JSON. Рассинхрон любой из них = блок не отрендерится.
- Не коммить и не пушь без явной просьбы. Ветка по умолчанию для PR — `main`, рабочая — `develop`.
- Перед заявлением «готово» — прогоняй `npm run dev`/`generate` или линт, если менял код.
