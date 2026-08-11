<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  linkLabel?: string,
  items?: {
    image?: string,
    title?: string,
    description?: string,
    type?: string,
    technologies?: string[],
    link?: string,
  }[],
}>()
</script>

<template>
  <section class="projects --primary">
    <div class="container projects__inner">
      <h2 v-if="props.title" class="projects__title">{{ props.title }}</h2>
      <p v-if="props.text" class="projects__text">{{ props.text }}</p>

      <ul v-if="props.items?.length" class="projects__list">
        <li v-for="(item, index) in props.items" :key="index" class="projects__card">
          <div class="projects__media">
            <!-- Плейсхолдер вместо img, пока картинки нет: карточка не должна
                 схлопываться и ломать высоту ряда. -->
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title || ''"
              class="projects__image"
              loading="lazy"
              decoding="async"
            >
            <span v-else class="projects__image --empty" aria-hidden="true" />

            <span v-if="item.type" class="projects__type">{{ item.type }}</span>
          </div>

          <div class="projects__content">
            <h3 v-if="item.title" class="projects__card-title">{{ item.title }}</h3>
            <p v-if="item.description" class="projects__card-text">{{ item.description }}</p>

            <ul v-if="item.technologies?.length" class="projects__tech">
              <li v-for="(tech, techIndex) in item.technologies" :key="techIndex" class="projects__tech-item">
                {{ tech }}
              </li>
            </ul>

            <NuxtLink
              v-if="item.link && props.linkLabel"
              :to="item.link"
              :target="item.link.startsWith('http') ? '_blank' : undefined"
              :rel="item.link.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="projects__link"
            >
              {{ props.linkLabel }}
              <span class="projects__arrow" aria-hidden="true">&rarr;</span>
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.projects {
  padding: 6rem 0 12rem;

  &__text {
    max-width: 62rem;
    margin-top: 1.6rem;
    color: var(--font-muted);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2.4rem;
    margin-top: 4.8rem;
    @include normalize-list;

    @include min-width(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include min-width(2xl) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 1.2rem;
    background-color: color-mix(in srgb, var(--font-main) 3%, transparent);
    transition: border-color 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:hover {
      border-color: var(--font-accent);
      transform: translateY(-0.4rem);
    }

    &-title {
      font-size: 2rem;
    }

    &-text {
      margin-top: 1.2rem;
      color: var(--font-muted);
      font-size: 1.6rem;
      line-height: 1.6;
    }
  }

  &__media {
    position: relative;
    // aspect-ratio на обёртке, а не на img: пропорция держится и у плейсхолдера.
    aspect-ratio: 16 / 10;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.--empty {
      background-color: color-mix(in srgb, var(--font-main) 6%, transparent);
    }
  }

  &__type {
    position: absolute;
    top: 1.2rem;
    left: 1.2rem;
    padding: 0.4rem 1.2rem;
    border-radius: 4rem;
    // Плашка лежит на фото, поэтому фон непрозрачный, а не color-mix.
    background-color: var(--bg-main);
    color: var(--font-accent);
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 2.4rem;
  }

  &__tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    // 2.4, а не 2: у описания line-height 1.6, нижний интерлиньяж съедает
    // часть отступа и чипы оптически липнут к тексту.
    margin-top: 2.4rem;
    @include normalize-list;

    &-item {
      padding: 0.4rem 1rem;
      border: 0.1rem solid var(--color-green-200-20);
      border-radius: 0.4rem;
      color: var(--font-muted);
      font-size: 1.3rem;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    // Подчёркивание по умолчанию тянется и на стрелку — выглядит грязно.
    // Показываем его на ховере и только под текстом.
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: var(--color-green-300);
      text-decoration: underline;
      text-underline-offset: 0.3rem;
    }
    // margin-top: auto прижимает ссылку к низу карточки — в ряду они на одной линии
    // независимо от длины описания.
    margin-top: auto;
    padding-top: 2.4rem;
    align-self: flex-start;
    color: var(--font-accent);
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease-in-out;
  }

  &__link:hover &__arrow {
    transform: translateX(0.4rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .projects__card:hover {
    transform: none;
  }

  .projects__link:hover .projects__arrow {
    transform: none;
  }
}
</style>
