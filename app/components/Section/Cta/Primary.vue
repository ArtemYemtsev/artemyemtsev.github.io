<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  button?: {
    label?: string,
    link?: string,
  },
}>()
</script>

<template>
  <section class="cta --primary">
    <div class="container">
      <div class="cta__inner">
        <span class="cta__glow" aria-hidden="true" />

        <h2 v-if="props.title" class="cta__title">{{ props.title }}</h2>
        <p v-if="props.text" class="cta__text">{{ props.text }}</p>

        <UiButton
          v-if="props.button?.label"
          :to="props.button.link || '#contacts'"
          variant="primary"
          class="cta__button"
        >
          {{ props.button.label }}
          <!-- Стрелка декоративная: смысл несёт сам лейбл, скринридеру она лишняя. -->
          <span class="cta__arrow" aria-hidden="true">&rarr;</span>
        </UiButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta {
  padding: 6rem 0;

  &__inner {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem 2.4rem;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 2rem;
    background-color: color-mix(in srgb, var(--font-main) 3%, transparent);
    text-align: center;

    @include min-width(md) {
      padding: 8rem 4rem;
    }
  }

  // Зелёное свечение сверху — тот же приём, что в hero, для связности страницы.
  &__glow {
    position: absolute;
    top: -18rem;
    left: 50%;
    z-index: 0;
    width: 60rem;
    height: 30rem;
    transform: translateX(-50%);
    pointer-events: none;
    background: radial-gradient(
      ellipse at 50% 100%,
      color-mix(in srgb, var(--color-green-400) 22%, transparent),
      transparent 70%
    );
    filter: blur(6rem);
  }

  &__title {
    position: relative;
    z-index: var(--z-base);
    max-width: 68rem;
  }

  &__text {
    position: relative;
    z-index: var(--z-base);
    max-width: 56rem;
    margin-top: 1.6rem;
    color: var(--font-muted);
  }

  &__button {
    position: relative;
    z-index: var(--z-base);
    margin-top: 3.2rem;

    // Стрелка подъезжает вперёд по ховеру — микро-отклик без layout shift.
    &:hover .cta__arrow {
      transform: translateX(0.4rem);
    }
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease-in-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta__button:hover .cta__arrow {
    transform: none;
  }
}
</style>
