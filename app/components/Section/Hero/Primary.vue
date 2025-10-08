<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="hero hero--primary">
    <div class="container hero-container">
      <h1>{{ props.title }}</h1>
      <p v-html="props.subtitle" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  h1 {
    color: red;
  }
}
</style>
