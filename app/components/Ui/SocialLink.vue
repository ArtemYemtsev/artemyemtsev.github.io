<script setup lang="ts">
// Соц-ссылка-иконка с тем же rollup, что у кнопок. Один компонент на весь сайт:
// хедер, футер и hero раньше расходились по стилю и по атрибутам — в футере
// ссылки были без aria-label (скринридер читал пустую ссылку) и без rel.
const props = defineProps<{
  href: string,
  icon: string,
  label: string,
}>()

// mailto:/tel: открываем в той же вкладке. Внешние http(s) — в новой, и только
// с rel: без noopener открытая вкладка получает доступ к window.opener.
const isExternal = computed(() => /^https?:\/\//.test(props.href))
</script>

<template>
  <a
    class="social-link"
    :href="props.href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :aria-label="props.label"
  >
    <span class="rollup__layer rollup__layer--base">
      <svg class="social-link__icon" aria-hidden="true">
        <use :xlink:href="`/sprite.svg#${props.icon}`" />
      </svg>
    </span>

    <!-- Дубль иконки — кадр анимации, не контент. -->
    <span class="rollup__layer rollup__layer--hover" aria-hidden="true">
      <svg class="social-link__icon">
        <use :xlink:href="`/sprite.svg#${props.icon}`" />
      </svg>
    </span>
  </a>
</template>
