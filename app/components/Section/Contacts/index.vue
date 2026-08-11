<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  contacts?: {
    title: string,
    icon: string,
    link: string,
  }[],
}>()
</script>

<template>
  <section class="contacts">
    <div class="container contacts__inner">
      <h2 v-if="props.title" class="contacts__title">{{ props.title }}</h2>
      <div v-if="props.text" class="contacts__text">{{ props.text }}</div>

      <div v-if="props.contacts?.length" class="contacts__list">
        <NuxtLink
          v-for="(contact, index) in props.contacts"
          :key="index"
          :to="contact.link"
          :target="contact.link.startsWith('http') ? '_blank' : undefined"
          class="contacts__item"
        >
          <svg class="contacts__icon">
            <use :xlink:href="`/sprite.svg#${contact.icon}`"></use>
          </svg>
          <span class="contacts__item-title">{{ contact.title }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contacts {
  padding: 6rem 0 12rem;

  &__text {
    margin-top: 1.6rem;
    color: var(--font-main);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
    margin-top: 4rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 0.6rem;
    padding: 1.6rem 2rem;
    color: var(--font-main);
    transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;

    &:hover {
      color: var(--font-accent);
      border-color: var(--font-accent);
    }

    &-title {
      font-size: 1.8rem;
    }
  }

  &__icon {
    width: 2.4rem;
    height: 2.4rem;
    flex-shrink: 0;
  }
}
</style>
