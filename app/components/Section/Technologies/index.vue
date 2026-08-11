<script setup lang="ts">
const props = defineProps<{
  title?: string,
  subtitle?: string,
  technologies?: {
    name: string,
    icon: string,
  }[],
}>()
</script>

<template>
  <section class="technologies">
    <div class="container technologies__inner">
      <h2 class="technologies__title">{{ props.title }}</h2>
      <div class="technologies__text">{{ props.subtitle }}</div>

      <div v-if="props.technologies?.length" class="technologies__list">
        <div class="technologies__list-item" v-for="(tecnology, index) in props.technologies" :key="index">
          <svg>
            <use :xlink:href="`/sprite.svg#${tecnology.icon}`"></use>
          </svg>
          <div class="technologies__list-item-title">{{ tecnology.name }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.technologies {
  &__inner {}

  &__title {}

  &__text {
    margin-top: 3.2rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    margin-top: 6rem;

    @include min-width(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include min-width(md) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include min-width(lg) {
      grid-template-columns: repeat(4, 1fr);
    }

    &-item {
      display: flex;
      align-items: center;
      border-radius: 0.6rem;
      border: 1px solid var(--color-green-200-20);
      padding: 0 1.6rem;
      transition: color 0.3s ease-in-out;

      svg {
        width: 6rem;
        height: 6rem;
      }

      &:hover {
        color: var(--color-green-600);
      }
    }
  }
}
</style>