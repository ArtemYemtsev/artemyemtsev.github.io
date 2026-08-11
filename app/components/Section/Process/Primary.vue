<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  steps?: {
    title: string,
    content?: string,
  }[],
}>()
</script>

<template>
  <section class="process --primary">
    <div class="container process__inner">
      <h2 v-if="props.title" class="process__title">{{ props.title }}</h2>
      <p v-if="props.text" class="process__text">{{ props.text }}</p>

      <ol v-if="props.steps?.length" class="process__list">
        <li v-for="(step, index) in props.steps" :key="index" class="process__step">
          <!-- Номер печатаем из индекса, а не из контента: порядок шагов и есть
               их нумерация, дублировать её в JSON нечем не помогает. -->
          <span class="process__marker" aria-hidden="true">{{ index + 1 }}</span>

          <div class="process__body">
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p v-if="step.content" class="process__step-text">{{ step.content }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.process {
  padding: 6rem 0 12rem;

  &__text {
    max-width: 62rem;
    margin-top: 1.6rem;
    color: var(--font-muted);
  }

  // На десктопе таймлайн центрируется по оси контейнера, и заголовок, прижатый
  // влево, повисает от него отдельно. Центрируем шапку вместе с осью.
  @include min-width(lg) {
    &__title,
    &__text {
      text-align: center;
    }

    &__text {
      margin-inline: auto;
    }
  }

  &__list {
    // Список нумерованный семантически (ol), но маркеры рисуем сами.
    @include normalize-list;
    margin-top: 4.8rem;
    max-width: 78rem;

    // На десктопе таймлайн разворачивается в зигзаг по центральной оси,
    // поэтому ограничение по ширине снимаем — иначе колонки схлопнутся.
    @include min-width(lg) {
      max-width: 108rem;
      margin-inline: auto;
      margin-top: 6.4rem;
    }
  }

  &__step {
    position: relative;
    display: grid;
    grid-template-columns: 4.8rem 1fr;
    column-gap: 2rem;
    padding-bottom: 3.2rem;

    &:last-child {
      padding-bottom: 0;
    }

    // Вертикальная линия-связка вместо стрелки ↓: тянется от кружка вниз до
    // следующего шага. У последнего шага её нет, иначе линия висит в воздухе.
    &:not(:last-child)::before {
      content: "";
      position: absolute;
      top: 5.6rem;
      left: 2.35rem;
      width: 0.1rem;
      height: calc(100% - 5.6rem);
      background: linear-gradient(
        to bottom,
        var(--color-green-200-20),
        color-mix(in srgb, var(--color-green-400) 4%, transparent)
      );
    }

    @include min-width(lg) {
      // Три дорожки: контент слева | ось с номером | контент справа.
      grid-template-columns: 1fr 4.8rem 1fr;
      column-gap: 4rem;
      // Меньше, чем на мобиле: в зигзаге соседние шаги и так разведены по
      // разные стороны оси, большой вертикальный зазор только рвёт связь.
      padding-bottom: 2.4rem;

      &:not(:last-child)::before {
        // 0.05rem — половина толщины линии, иначе ось уезжает вправо на пиксель.
        left: calc(50% - 0.05rem);
      }

      // Чередование сторон. Маркер всегда в средней дорожке, меняется только
      // сторона текста — за счёт grid-column, а не за счёт порядка в DOM:
      // порядок чтения и нумерация остаются последовательными.
      &:nth-child(odd) {
        .process__body {
          grid-column: 1;
          text-align: right;
        }
      }

      &:nth-child(even) .process__body {
        grid-column: 3;
      }

      .process__marker {
        grid-column: 2;
      }
    }

    &-title {
      // Выравниваем заголовок по центру кружка: у h3 своя line-height, поэтому
      // подгоняем не margin-ом, а высотой строки, равной высоте маркера.
      line-height: 4.8rem;
    }

    &-text {
      margin-top: 0.4rem;
      color: var(--font-muted);
      font-size: 1.6rem;
      line-height: 1.6;
    }
  }

  &__marker {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 50%;
    background-color: var(--bg-main);
    color: var(--font-accent);
    font-size: 1.8rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}
</style>
