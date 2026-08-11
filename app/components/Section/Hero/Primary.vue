<script setup lang="ts">
const props = defineProps<{
  title?: string,
  subtitle?: string,
  text?: string,
}>()
</script>

<template>
  <section class="hero --primary">
    <div class="container">
      <div class="hero__inner">
        <div class="hero__info">
          <!-- TODO(контент): статус/формат вынести в props или content JSON -->
          <p class="hero__status">
            <span class="hero__status-dot" aria-hidden="true" />
            Open to work · Full-time · Part-time · Remote
          </p>

          <h1 class="hero__title">{{ props.title }}</h1>

          <!-- TODO(контент): акцент на «Front End» — позже через отдельные поля или v-html -->
          <p v-if="props.subtitle" class="hero__subtitle">{{ props.subtitle }}</p>

          <p v-if="props.text" class="hero__text">{{ props.text }}</p>

          <div class="hero__actions">
            <!-- TODO(контент): ссылки и лейблы CTA вынести в props/content -->
            <a href="#" class="button --primary">Скачать CV</a>
            <a href="#contacts" class="button --secondary">Связаться</a>
          </div>

          <ul class="hero__socials">
            <li>
              <a href="#" aria-label="Telegram">
                <svg>
                  <use :xlink:href="`/sprite.svg#telegram-icon`" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn">
                <svg>
                  <use :xlink:href="`/sprite.svg#linkedin-icon`" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="GitHub">
                <svg>
                  <use :xlink:href="`/sprite.svg#github-social-icon`" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div class="hero__media">
          <span class="hero__media-glow" aria-hidden="true" />
          <div class="hero__media-frame">
            <!-- TODO(контент): заменить на <img> с реальным фото; пока плейсхолдер -->
            <div class="hero__media-photo" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  // min-height (а не height): на низких экранах контент не обрежется.
  min-height: 100dvh;
  padding-top: 9rem;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;

  @include min-width(md) {
    padding-top: 12rem;
  }

  // Растягиваем контейнер на высоту секции, чтобы работало вертикальное
  // центрирование контента (align-content на inner).
  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__inner {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    align-content: center;
    gap: 4rem;

    @include min-width(lg) {
      grid-template-columns: 1.1fr .9fr;
      align-items: center;
      gap: 6rem;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;

    @include min-width(lg) {
      height: 100%;
      justify-content: center;
    }
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    width: max-content;
    padding: 0.4rem 1.2rem;
    color: var(--font-accent);
    border: 1px solid var(--color-green-200-20);
    border-radius: 4rem;
    font-size: 1.3rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &-dot {
      display: inline-block;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background-color: var(--color-green-400);
      // Мягкий пульс — расходящийся зелёный halo.
      animation: hero-pulse 2s ease-out infinite;
    }
  }

  &__title {
    font-size: var(--h1-font-size);
    line-height: 1.05;
  }

  &__subtitle {
    font-size: 2rem;

    @include min-width(md) {
      font-size: 2.4rem;
    }
  }

  &__text {
    max-width: 52rem;
    color: var(--font-muted);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
  }

  &__socials {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    @include normalize-list;

    & > li a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4.4rem;
      height: 4.4rem;
      color: var(--font-main);
      opacity: 0.7;
      transition: opacity 0.3s ease, color 0.3s ease;

      &:hover {
        opacity: 1;
        color: var(--font-accent);
      }

      svg {
        width: 2.6rem;
        height: 2.6rem;
        fill: currentColor;
      }
    }
  }

  &__media {
    position: relative;
    display: flex;
    justify-content: center;

    // Зелёное свечение за фото (Nuxt-приём). Под рамкой, клики не ловит.
    &-glow {
      position: absolute;
      inset: -2rem;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(
        circle at 50% 40%,
        color-mix(in srgb, var(--color-green-400) 35%, transparent),
        transparent 70%
      );
      filter: blur(4rem);
    }

    // Градиентная рамка вокруг фото — тонкий зелёный контур сверху.
    &-frame {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 42rem;
      padding: 0.1rem;
      border-radius: 2rem;
      background: linear-gradient(160deg, var(--color-green-400), transparent 55%);
    }

    // Плейсхолдер фото. Позже заменишь div на <img> — object-fit подхватит.
    &-photo {
      width: 100%;
      aspect-ratio: 4 / 5;
      border-radius: 1.9rem;
      background-color: color-mix(in srgb, var(--font-main) 5%, transparent);
      object-fit: cover;
    }
  }
}

@keyframes hero-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-green-400) 50%, transparent);
  }

  70% {
    box-shadow: 0 0 0 0.8rem transparent;
  }

  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}
</style>
