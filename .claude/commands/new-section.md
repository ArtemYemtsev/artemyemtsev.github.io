---
description: Создать новый блок-секцию (компонент + регистрация в componentsMap + пример блока в JSON)
argument-hint: <Group> <Variant> [целевая-страница]
---

Создай новый блок для модульной системы страниц. Аргументы: `$ARGUMENTS`
(первое слово — `Group` в PascalCase, второе — `Variant` в PascalCase; если `Variant` не указан — используй `index`).

Сначала прочитай @CLAUDE.md (раздел «Ядро: блочная система») и @app/blocks/componentsMap.ts (карта регистрации блоков), чтобы свериться с актуальными конвенциями.

Шаги:
1. Вычисли `type` по правилу: `Group` без `Variant` (или `index`) → `kebab(Group)`; иначе → `kebab(Group)-kebab(Variant)`. Составные имена режутся по словам (`DemoUI` → `demo-ui`).
2. Создай компонент `app/components/Section/<Group>/<Variant>.vue`:
   - `<script setup lang="ts">` с `defineProps<{ ... }>()` — поля опциональны (`?`), отражают ключи блока в JSON.
   - Шаблон: `<section class="<kebab(Group)> <kebab(Group)>--<kebab(Variant)>"><div class="container">…</div></section>`.
   - `<style lang="scss" scoped>` с BEM-неймингом, размеры в `rem`, цвета через CSS-переменные, адаптив через `@include min-width(...)`.
3. Зарегистрируй блок в `componentsMap` в `app/blocks/componentsMap.ts`: добавь `import` и строку `'<type>': <ИмяКомпонента>`.
4. Если указана целевая страница — добавь пример блока `{ "type": "<type>", ... }` в её `content/<page>/index.json`. Иначе покажи готовый JSON-сниппет блока, который можно вставить.
5. Запусти `npm run dev` (или линт) и убедись, что блок рендерится без ошибок.

Не забудь синхронность трёх точек: компонент ↔ запись в `componentsMap` ↔ данные в JSON.
