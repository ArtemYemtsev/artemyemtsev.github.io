<script setup lang="ts">
// Витрина rollup-системы. Блок нигде не подключён в контенте — это площадка
// для проверки вариантов кнопок и ссылок. Стилей у кнопок здесь нет намеренно:
// всё живёт в layout/_buttons.scss, а scoped-стили секции до внутренних слоёв
// <UiButton> всё равно не дотянутся (у дочернего компонента свой data-v).
</script>

<template>
  <section class="demo --btns">
    <div class="container">
      <div class="demo-inner">
        <h3>Кнопки — чистый rollup</h3>
        <div class="demo-row">
          <UiButton href="#" variant="primary" label="Start Free Trial" />
          <UiButton href="#" variant="secondary" label="Book a Demo" />
          <UiButton variant="primary" icon="telegram-icon" label="С иконкой" />
          <UiButton variant="primary" label="Disabled" disabled />
        </div>

        <h3>Кнопка с раскрытием из центра (--pill)</h3>
        <div class="demo-row">
          <UiButton href="#" variant="primary" class="--pill" label="Start Free Trial" />
        </div>

        <h3>Текстовая ссылка с тем же эффектом</h3>
        <div class="demo-row">
          <a href="#" class="rollup-link">
            <span class="rollup__layer rollup__layer--base">Смотреть проекты</span>
            <span class="rollup__layer rollup__layer--hover" aria-hidden="true">Смотреть проекты</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.demo-inner {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 6rem 0;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
