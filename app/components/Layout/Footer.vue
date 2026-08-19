<script setup lang="ts">
const { locale } = useI18n()

const nav = useLocaleNav()
const { contacts, email } = useSiteContacts()

// Сайт статический: год фиксируется на момент сборки, а не на момент визита.
// Для копирайта это нормально — пересборка идёт с каждым релизом.
const year = new Date().getFullYear()

// mailto:/tel: открываем в той же вкладке, внешние http(s) — в новой и только
// с rel: без noopener открытая вкладка получает доступ к window.opener.
function isExternal(link?: string): boolean {
  return /^https?:\/\//.test(link ?? '')
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__cta">
        <p class="footer__cta-label">{{ $t('footer.ctaLabel') }}</p>

        <a v-if="email" :href="`mailto:${email}`" class="footer__cta-link rollup-link">
          <span class="rollup__layer rollup__layer--base">{{ email }}</span>
          <!-- Дубль — кадр rollup-анимации, для скринридера скрыт. -->
          <span class="rollup__layer rollup__layer--hover" aria-hidden="true">{{ email }}</span>
        </a>
      </div>

      <div class="footer__grid">
        <div class="footer__col">
          <NuxtLink :to="`/${locale}`" class="footer__logo">
            <img src="~/assets/images/brand-logo.svg" :alt="$t('a11y.brandLogo')">
          </NuxtLink>

          <p class="footer__role">{{ $t('footer.role') }}</p>

          <p class="footer__status">
            <span class="footer__status-dot" aria-hidden="true" />
            {{ $t('footer.status') }}
          </p>

          <div v-if="contacts.length" class="footer__socials">
            <UiSocialLink
              v-for="contact in contacts"
              :key="contact.link"
              :href="contact.link || '#'"
              :icon="contact.icon || ''"
              :label="contact.title || ''"
            />
          </div>
        </div>

        <nav class="footer__col" :aria-label="$t('footer.navTitle')">
          <h2 class="footer__title">{{ $t('footer.navTitle') }}</h2>
          <ul class="footer__list">
            <li v-for="item in nav" :key="item.path">
              <NuxtLink :to="item.path" class="footer__link">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div v-if="contacts.length" class="footer__col">
          <h2 class="footer__title">{{ $t('footer.contactsTitle') }}</h2>
          <ul class="footer__list">
            <li v-for="contact in contacts" :key="contact.link">
              <a
                :href="contact.link"
                class="footer__link"
                :target="isExternal(contact.link) ? '_blank' : undefined"
                :rel="isExternal(contact.link) ? 'noopener noreferrer' : undefined"
              >
                {{ contact.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          © {{ year }} Artem Yemtsev — {{ $t('footer.role') }}. {{ $t('footer.rights') }}
        </p>
        <p class="footer__built">{{ $t('footer.builtWith') }}</p>
      </div>
    </div>
  </footer>
</template>
