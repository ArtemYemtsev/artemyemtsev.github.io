<script lang="ts" setup>
import SectionHeroPrimary from '~/components/Section/Hero/Primary.vue';
// import type { ContentNavigationItem } from '@nuxt/content';

// interface PageDataJson {
//   title: string;
//   description: string;
//   body: [];
// };

const componentsMap: Record<string, Component> = {
  'hero-primary': SectionHeroPrimary,
};

const route = useRoute();
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first();
});
</script>

<template>
  <div class="page-content">
    <template v-if="Array.isArray(page?.body)">
      <component
        v-for="(block, index) in page.body"
        :key="index"
        :is="componentsMap[block.type]"
        v-bind="block"
      />
    </template>

    <template v-else>
      <article class="blog article">
        <ContentRenderer :value="page" />
      </article>
    </template>
  </div>
</template>