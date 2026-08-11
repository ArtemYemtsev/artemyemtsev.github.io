<script setup lang="ts">
const { locale, locales } = useI18n()
const route = useRoute()

// Полная навигация по всем локалям; фильтруем до текущей по префиксу пути.
const { data } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content').order('path', 'ASC')
})

// Узел локали ('/ru') — контейнер. @nuxt/content кладёт саму страницу-раздел
// первым дочерним узлом (self-index), поэтому root.children уже начинается с
// главной ('/ru', title из index.json) и содержит все подстраницы.
// Сам root вручную НЕ добавляем: его path '/ru' совпадает с self-index (был бы
// дубль ссылки на главную), а его title — имя папки ('Ru'), а не из index.json.
const nav = computed(() => {
  const root = data.value?.find(item => item.path === `/${locale.value}`)
  return root?.children ?? []
})

// Переключатель языка: подменяем первый сегмент пути на код локали.
// Работает для контент-маршрутов (/ru/about → /en/about, /ru → /en).
function localeSwitchPath(code: string): string {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return `/${code}`
  segments[0] = code
  return `/${segments.join('/')}`
}

// Мобильное меню: бургер тогглит выпадающую панель.
// Закрываем при любой смене маршрута (клик по пункту/языку меняет путь).
const isMenuOpen = ref(false)
watch(() => route.path, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-inner">
        <NuxtLink :to="`/${locale}`" class="header-logo">
          <img src="~/assets/images/brand-logo.svg" :alt="$t('a11y.brandLogo')" loading="eager">
        </NuxtLink>

        <nav class="header-nav menu-header" :class="{ 'header-nav--open': isMenuOpen }">
          <ul v-if="nav.length">
            <li v-for="item in nav" :key="item.path">
              <NuxtLink :to="item.path" class="underline-link"><span>{{ item.title }}</span></NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="header-controls">
          <div class="header-lang" :aria-label="$t('a11y.switchLanguage')">
            <NuxtLink
              v-for="loc in locales"
              :key="loc.code"
              :to="localeSwitchPath(loc.code)"
              class="header-lang__item"
              :class="{ 'header-lang__item--active': loc.code === locale }"
            >
              {{ loc.code.toUpperCase() }}
            </NuxtLink>
          </div>

          <button
            type="button"
            class="header-burger"
            :class="{ 'header-burger--active': isMenuOpen }"
            :aria-expanded="isMenuOpen"
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

<style lang="scss" scoped>
.underline-link {
  span {
    background-image: linear-gradient(transparent calc(100% - 0.1em),
        rgb(226, 232, 240) 0.1em);
    background-position-y: 100%;
    background-repeat: no-repeat;
    background-size: 0;
    display: inline;
    transition: background-size 1s cubic-bezier(0.3, 0.86, 0.36, 0.95);
  }

  &:hover {
    text-decoration: none !important;

    span {
      background-size: 100%;
    }
  }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.header-lang {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &__item {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--font-main);
    opacity: 0.5;
    transition: opacity 0.3s ease-in-out, color 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }

    &--active {
      opacity: 1;
      color: var(--font-accent);
    }
  }
}

// Бургер — виден только на мобилке/планшете, на десктопе прячется.
.header-burger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  width: 4rem;
  height: 4rem;
  padding: 0.9rem 0.8rem;

  span {
    display: block;
    width: 100%;
    height: 0.2rem;
    border-radius: 0.2rem;
    background-color: var(--font-main);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  // Полоски складываются в крестик при открытом меню.
  &--active {
    span:nth-child(1) {
      transform: translateY(0.7rem) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-0.7rem) rotate(-45deg);
    }
  }

  @include min-width(lg) {
    display: none;
  }
}

// Мобилка: nav — выпадающая панель под хедером (absolute от fixed .header).
// Десктоп: возвращается в поток топбара горизонтальным списком.
.header-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 1.6rem var(--container-offset-mobile) 2.4rem;
  background-color: var(--bg-main);
  border-bottom: 0.1rem solid var(--border-primary);
  visibility: hidden;
  opacity: 0;
  transform: translateY(-1rem);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;

  &--open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  ul {
    flex-direction: column;
    gap: 1.6rem;
  }

  @include min-width(lg) {
    position: static;
    padding: 0;
    background: none;
    border: none;
    visibility: visible;
    opacity: 1;
    transform: none;

    ul {
      flex-direction: row;
      gap: 2.4rem;
    }
  }
}
</style>
