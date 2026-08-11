<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
}>()
</script>

<template>
  <section class="about about--primary">
    <div class="container about-container">
      <!-- <div class="about-label section-label">About</div> -->
      <h2 class="about__title">{{ props.title }}</h2>
      <div class="about__text" v-html="props.text" />
      <!-- Разрабатываю продуманные и быстрые решения на Vue, Webflow и WordPress, превращая дизайн в чистый, адаптивный и идеально точный код. -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  padding: 12rem 0;

  &-inner {}

  &__title {
    margin-bottom: 3.2rem;
  }

  &__text {
    color: rgb(148, 163, 184);

    p {
      margin-bottom: 2.4rem;
    }
  }
}
</style>
