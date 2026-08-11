---
name: section-block
description: Авторинг и редактирование блоков-секций модульной системы этого сайта (Nuxt + @nuxt/content). Используй, когда нужно создать/изменить блок страницы, разобраться в связке content JSON ↔ componentsMap ↔ Vue-компонент, добавить или переиспользовать секцию. Не для общих вопросов по Vue/Nuxt.
---

# Блоки-секции модульной системы

Этот сайт собирает страницы из переиспользуемых блоков. Контент отделён от представления: данные — в `content/**/*.json`, представление — во Vue-компонентах `app/components/Section/**`. Связывает их карта `componentsMap` в `app/blocks/componentsMap.ts` (импортируется в `app/pages/[...slug].vue`).

## Ментальная модель

```
content/<slug>/index.json   →  body: [ { type: "hero-primary", ... }, ... ]
                                              │ type
app/blocks/componentsMap.ts  →  componentsMap[type]  →  <Component v-bind="block" />  (рендер в [...slug].vue)
                                              │
app/components/Section/...    →  defineProps<{...}>()  отражает ключи блока
```

Три точки **всегда синхронны**. Рассинхрон → блок молча не рендерится (`:is="undefined"`).

## Конвенция типов

| Файл | `type` |
|---|---|
| `Section/<Group>/<Variant>.vue` | `kebab(Group)-kebab(Variant)` |
| `Section/<Group>/index.vue` | `kebab(Group)` |

- `Hero/Primary.vue` → `hero-primary`
- `Technologies/index.vue` → `technologies`
- `DemoUI/Buttons.vue` → `demo-ui-buttons` (составное имя группы режется по словам)

## Как добавить блок (чек-лист)

1. **Компонент** `app/components/Section/<Group>/<Variant>.vue`:
   ```vue
   <script setup lang="ts">
   const props = defineProps<{
     title?: string
     subtitle?: string
     // ...поля = ключи блока в JSON, все опциональны
   }>()
   </script>

   <template>
     <section class="<group> <group>--<variant>">
       <div class="container">
         <h2 v-if="props.title">{{ props.title }}</h2>
       </div>
     </section>
   </template>

   <style lang="scss" scoped>
   .<group> {
     // rem, CSS-переменные, @include min-width(...) — см. ниже
   }
   </style>
   ```
2. **Регистрация** в `app/blocks/componentsMap.ts`: `import` компонента + строка `'<type>': <Имя>` в `componentsMap`.
3. **Данные** — объект `{ "type": "<type>", ... }` в `body[]` нужной страницы.
4. **Проверка** — `npm run dev`, открыть страницу, убедиться что блок виден и без ошибок в консоли.

## Стилевые правила (обязательны)

- Единицы — **`rem`** (базис `1rem = 10px`). Не `px` для размеров.
- Цвета/отступы темы — **CSS-переменные** из `app/assets/styles/abstracts/_variables.scss` (`--font-accent`, `--bg-main`, `--font-main`, `--color-green-*`). Нет нужной — добавь переменную, не хардкодь hex.
- Адаптив — **mobile-first**, миксин `@include min-width(sm|md|lg|xl|2xl|3xl|4xl|5xl)` из `_mixins.scss`.
- Нейминг — **BEM**: `.block`, `.block__element`, `.block--modifier`.
- Обёртка контента — `.container` (центрирование + адаптивные отступы уже внутри).
- Иконки — SVG-спрайт: `<svg><use :xlink:href="`/sprite.svg#<id>`" /></svg>`. Перед использованием убедись, что `<id>` есть в `public/sprite.svg`.
- HTML из контента — через `v-html`; плоский текст — `{{ }}`.

## Переиспользование вместо дублирования

- Прежде чем плодить новый вариант, проверь существующие в `app/components/Section/**` — возможно, хватит нового набора данных в JSON для уже готового блока.
- Несколько вариантов одной группы (`Hero/Primary`, `Hero/Compact`) делят `<group>`-класс и тему; различия — через модификатор `--variant`.
- Глобальные UI-примитивы (кнопки `.button.--primary/--secondary`, `.underline-link`, `.section-label`) уже есть — переиспользуй их, а не верстай заново.

## Частые ошибки

- Добавил компонент, забыл `componentsMap` → блок не виден.
- `type` в JSON не совпадает с ключом карты (опечатка/регистр) → блок не виден.
- `draft`/`order` записаны строками (`"true"`) вместо `boolean`/`number` → фильтрация ломается.
- Ссылка на иконку `#id`, которой нет в спрайте → пустое место.
- Хардкод hex/px вместо переменных и `rem` → расхождение с темой и адаптивом.
