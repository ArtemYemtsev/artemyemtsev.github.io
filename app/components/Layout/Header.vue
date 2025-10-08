<script setup lang="ts">
const { data } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
});
</script>

<template>
  <header class="header">
    <div class="header-inner container">
      <div>Logo</div>

        <nav>
          <ul v-if="data">
            <li v-for="item in data" :key="item.path">
              <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </nav>

      <div>CTA</div>
    </div>
  </header>
</template>