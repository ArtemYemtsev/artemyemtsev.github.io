<script setup lang="ts">
const { locale } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__column">
            <NuxtLink :to="`/${locale}`" class="footer__logo">
              <img src="~/assets/images/brand-logo.svg" :alt="$t('a11y.brandLogo')">
            </NuxtLink>
          </div>

          <div class="footer__column">
            <div class="footer__contacts">
              <NuxtLink :to="`https://t.me/yemtsev_a`" :target="'_blank'" class="footer__contact-link">
                <svg>
                  <use :xlink:href="`/sprite.svg#telegram-icon`"></use>
                </svg>
              </NuxtLink>
              <NuxtLink :to="`https://www.linkedin.com/in/artem-yemtsev-b18330274/`" :target="'_blank'"
                class="footer__contact-link">
                <svg>
                  <use :xlink:href="`/sprite.svg#linkedin-icon`"></use>
                </svg>
              </NuxtLink>
              <NuxtLink :to="`https://www.instagram.com/artem_frontend_dev/`" :target="'_blank'"
                class="footer__contact-link">
                <svg>
                  <use :xlink:href="`/sprite.svg#instagram-icon`"></use>
                </svg>
              </NuxtLink>
              <NuxtLink :to="`mailto:tema2201@gmail.com`" class="footer__contact-link">
                <svg>
                  <use :xlink:href="`/sprite.svg#email-icon`"></use>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          © {{ year }} Artem Yemtsev — {{ $t('footer.role') }}. {{ $t('footer.rights') }}
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid rgb(226, 232, 240);
  padding: 3.2rem 0;
  margin-top: 6rem;

  &__inner {}

  &__logo {
    display: block;
    height: 5.6rem;

    img {
      height: 100%;
      object-fit: contain;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
  }

  &__bottom {
    border-top: 0.1rem solid var(--font-main);
    padding-top: 2.4rem;
    margin-top: 2.4rem;
  }

  &__contacts {
    display: flex;
    gap: 2.4rem;
  }

  &__contact-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--font-main);
    border: 0.1rem solid var(--font-main);
    padding: 1rem;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--font-accent);
      border-color: var(--font-accent);
    }

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

}
</style>