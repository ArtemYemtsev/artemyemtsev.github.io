<script setup lang="ts">
// Универсальная кнопка/ссылка с rollup-анимацией.
//
// Тег выбирается по props: `to` → <NuxtLink> (внутренний маршрут),
// `href` → <a> (внешняя ссылка или якорь), иначе — <button>.
//
// Двухслойная разметка ниже — контракт @mixin rollup (abstracts/_mixins.scss):
// второй слой дублирует подпись чисто визуально, поэтому он aria-hidden.
// Стили — глобальные (.button в layout/_buttons.scss), здесь только разметка.
const props = defineProps<{
  to?: string,
  href?: string,
  variant?: 'primary' | 'secondary',
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean,
  label?: string,
  icon?: string,
}>()

// resolveComponent зовём на верхнем уровне setup, а не внутри computed:
// внутри геттера Vue ругается на вызов вне контекста рендера.
const NuxtLinkComponent = resolveComponent('NuxtLink')

const tag = computed(() => {
  if (props.to) return NuxtLinkComponent
  if (props.href) return 'a'
  return 'button'
})

// Атрибуты специфичны для тега: на <button> нельзя лить to/href,
// на ссылку — type/disabled.
const tagProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type ?? 'button', disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="tagProps"
    class="button"
    :class="`--${props.variant ?? 'primary'}`"
  >
    <span class="rollup__layer rollup__layer--base">
      <svg v-if="props.icon" class="button__icon" aria-hidden="true">
        <use :xlink:href="`/sprite.svg#${props.icon}`" />
      </svg>
      <slot>{{ props.label }}</slot>
    </span>

    <!-- Дубль подписи — кадр анимации, не контент. Скрыт от скринридера,
         иначе кнопка читается дважды. -->
    <span class="rollup__layer rollup__layer--hover" aria-hidden="true">
      <svg v-if="props.icon" class="button__icon">
        <use :xlink:href="`/sprite.svg#${props.icon}`" />
      </svg>
      <slot>{{ props.label }}</slot>
    </span>
  </component>
</template>
