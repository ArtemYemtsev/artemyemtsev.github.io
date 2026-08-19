<script setup lang="ts">
const { locale, locales } = useI18n()
const route = useRoute()

const nav = useLocaleNav()
const { contacts } = useSiteContacts()

// Переключатель языка: подменяем первый сегмент пути на код локали.
// Работает для контент-маршрутов (/ru/about → /en/about, /ru → /en).
function localeSwitchPath(code: string): string {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return `/${code}`
  segments[0] = code
  return `/${segments.join('/')}`
}

// Шапка-капсула прозрачна на первом экране и уплотняется при скролле:
// стекло нужно только когда под ней реально едет контент.
const isScrolled = ref(false)
function onScroll() {
  isScrolled.value = window.scrollY > 24
}

const isMenuOpen = ref(false)
const isLangOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)

// Клик мимо дропдауна и Esc закрывают его — иначе он живёт до смены маршрута.
function onDocumentClick(event: MouseEvent) {
  if (!isLangOpen.value) return
  if (langRef.value?.contains(event.target as Node)) return
  isLangOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  isLangOpen.value = false
  isMenuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

// Закрываем всё при любой смене маршрута (клик по пункту/языку меняет путь).
watch(() => route.path, () => {
  isMenuOpen.value = false
  isLangOpen.value = false
})

// Скролл страницы блокируем классом на body, а не инлайн-стилем: так состояние
// переживает SSR и не конфликтует с чужими правками style.
useHead({
  bodyAttrs: {
    class: computed(() => (isMenuOpen.value ? 'is-menu-open' : '')),
  },
})
</script>

<template>
  <header class="header" :class="{ '--scrolled': isScrolled, '--menu-open': isMenuOpen }">
    <!-- Полноэкранная панель лежит внутри шапки, а не в <body> через Teleport:
         в её stacking context она уже выше всего контента, а бар остаётся
         поверх панели — тем же бургером её и закрываем. -->
    <div id="site-menu" class="menu" :class="{ '--open': isMenuOpen }">
      <div class="container">
        <nav class="menu__nav" :aria-label="$t('a11y.mainNav')">
          <ul class="menu__list">
            <li
              v-for="(item, index) in nav"
              :key="item.path"
              class="menu__item"
              :style="{ '--i': index }"
            >
              <NuxtLink :to="item.path" class="menu__link" :tabindex="isMenuOpen ? undefined : -1">
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="menu__bottom">
          <div class="menu__langs" :aria-label="$t('a11y.switchLanguage')">
            <NuxtLink
              v-for="loc in locales"
              :key="loc.code"
              :to="localeSwitchPath(loc.code)"
              class="menu__lang"
              :class="{ '--active': loc.code === locale }"
              :tabindex="isMenuOpen ? undefined : -1"
            >
              {{ loc.code.toUpperCase() }}
            </NuxtLink>
          </div>

          <div v-if="contacts.length" class="menu__socials">
            <UiSocialLink
              v-for="contact in contacts"
              :key="contact.link"
              :href="contact.link || '#'"
              :icon="contact.icon || ''"
              :label="contact.title || ''"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="header__bar">
        <NuxtLink :to="`/${locale}`" class="header__logo">
          <img src="~/assets/images/brand-logo.svg" :alt="$t('a11y.brandLogo')" loading="eager">
        </NuxtLink>

        <nav class="header__nav" :aria-label="$t('a11y.mainNav')">
          <ul class="header__list">
            <li v-for="item in nav" :key="item.path">
              <NuxtLink :to="item.path" class="header__link">
                <span class="header__link-dot" aria-hidden="true" />
                <span>{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="header__controls">
          <div ref="langRef" class="header__lang">
            <button
              type="button"
              class="header__lang-toggle"
              :class="{ '--open': isLangOpen }"
              :aria-expanded="isLangOpen"
              aria-haspopup="true"
              :aria-label="$t('a11y.switchLanguage')"
              @click="isLangOpen = !isLangOpen"
            >
              {{ locale.toUpperCase() }}
              <span class="header__lang-caret" aria-hidden="true" />
            </button>

            <ul v-show="isLangOpen" class="header__lang-list">
              <li v-for="loc in locales" :key="loc.code">
                <NuxtLink
                  :to="localeSwitchPath(loc.code)"
                  class="header__lang-item"
                  :class="{ '--active': loc.code === locale }"
                >
                  {{ loc.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="header__burger"
            :class="{ '--active': isMenuOpen }"
            :aria-expanded="isMenuOpen"
            aria-controls="site-menu"
            :aria-label="$t('a11y.toggleMenu')"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
