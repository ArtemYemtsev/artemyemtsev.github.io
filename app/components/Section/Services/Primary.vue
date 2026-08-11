<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  list?: {
    icon: string,
    title: string,
    content: string,
  }[],
}>()
</script>

<template>
  <section class="services --primary">
    <div class="container services__inner">
      <h2 v-if="props.title" class="services__title">{{ props.title }}</h2>
      <p v-if="props.text" class="services__text">{{ props.text }}</p>

      <ul v-if="props.list?.length" class="services__list">
        <li v-for="(service, index) in props.list" :key="index" class="services__item">
          <!-- Иконка декоративная: смысл несёт заголовок карточки рядом. -->
          <span class="services__icon" aria-hidden="true">
            <svg>
              <use :xlink:href="`/sprite.svg#${service.icon}`" />
            </svg>
          </span>

          <h3 class="services__item-title">{{ service.title }}</h3>
          <p class="services__item-text">{{ service.content }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.services {
  padding: 6rem 0 12rem;

  &__text {
    // Ограничиваем строку: лид-абзац во всю ширину контейнера не читается.
    max-width: 62rem;
    margin-top: 1.6rem;
    color: var(--font-muted);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
    margin-top: 4.8rem;
    @include normalize-list;

    @include min-width(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    // Четыре в ряд только с xl: на lg карточка ужимается до ~200px и текст рвётся.
    @include min-width(xl) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    padding: 2.8rem 2.4rem;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 1.2rem;
    background-color: color-mix(in srgb, var(--font-main) 3%, transparent);
    transition:
      border-color 0.3s ease-in-out,
      background-color 0.3s ease-in-out,
      transform 0.3s ease-in-out;

    &:hover {
      border-color: var(--font-accent);
      background-color: color-mix(in srgb, var(--color-green-400) 6%, transparent);
      transform: translateY(-0.4rem);
    }

    &-title {
      margin-top: 2.4rem;
      line-height: 1.2;

      // На xl карточка узкая и часть заголовков переносится на вторую строку —
      // тогда описания в ряду стартуют с разной высоты. Резервируем две строки
      // (min-height, не height: длинному заголовку в ru/uk есть куда расти).
      @include min-width(xl) {
        min-height: 2.4em;
      }
    }

    &-text {
      // margin-top, а не gap на карточке: подпись должна липнуть к заголовку,
      // а отступ от иконки задаётся отдельно и он крупнее.
      margin-top: 1.2rem;
      color: var(--font-muted);
      font-size: 1.6rem;
      line-height: 1.6;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    // align-self, иначе flex-контейнер растянет плашку на всю ширину карточки.
    align-self: flex-start;
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 1.2rem;
    background-color: color-mix(in srgb, var(--color-green-400) 10%, transparent);
    color: var(--font-accent);

    svg {
      width: 2.8rem;
      height: 2.8rem;
      fill: currentColor;
    }
  }
}

// Подъём карточки — украшение, а не смысл: по системной настройке гасим движение,
// подсветку рамки оставляем.
@media (prefers-reduced-motion: reduce) {
  .services__item {
    transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;

    &:hover {
      transform: none;
    }
  }
}
</style>
