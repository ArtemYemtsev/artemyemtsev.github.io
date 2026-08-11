<script lang="ts" setup>
import { componentsMap } from '~/blocks/componentsMap';

const route = useRoute();

// В контенте пути документов лежат без завершающего слэша (`/en`, `/en/about`), а
// браузер на статике легко даёт `/en/` — именно так GitHub Pages отдаёт директорию.
// Без нормализации документ не находится, и страница уходит в 404 уже после гидрации:
// пререндер-то отработал по пути без слэша и отдал корректный HTML.
const contentPath = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path;

const { data: page } = await useAsyncData(contentPath, () => {
  return queryCollection('content').path(contentPath).first();
});

// Документа по пути нет (битая ссылка, или страница есть в одной локали и не заведена
// в другой). Без этого гарда ветка v-else отдаёт в ContentRenderer :value="null" —
// и он падает на чтении .body, роняя пререндер 500-й ошибкой вместо честной 404.
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found: ${route.path}`,
    fatal: true,
  });
}
</script>

<template>
  <div class="page-content">
    <template v-if="Array.isArray(page?.body)">
      <component :is="componentsMap[block.type]" v-for="(block, index) in page.body" :key="index" v-bind="block" />
    </template>

    <template v-else>
      <article class="blog article">
        <ContentRenderer :value="page" />
      </article>
    </template>
  </div>
</template>