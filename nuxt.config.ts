// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/i18n'],
  components: true,
  css: ['@/assets/styles/main.scss'],

  // SCSS: делаем миксины (min-width, aspect-ratio и т.д.) глобально доступными
  // в scoped-стилях компонентов — без ручного @use в каждом файле.
  // Инжект нельзя лить в сам abstracts/ (иначе mixins.scss заимпортит себя).
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData(content: string, filename: string) {
            const f = filename.replace(/\\/g, '/')
            if (f.includes('/assets/styles/abstracts/')) return content
            return `@use "@/assets/styles/abstracts/mixins" as *;\n${content}`
          },
        },
      },
    },
  },

  // Рендеринг — universal (SSR). На GitHub Pages сервера нет, поэтому деплой
  // идёт через `nuxt generate`: SSR-рендер отрабатывает на этапе сборки
  // (prerender) и на выходе — готовый HTML. Тот же `ssr: true` при переезде
  // на Vercel даст per-request SSR без правок кода.
  ssr: true,

  app: {
    // Репо artemyemtsev.github.io — user-страница, отдаётся с корня домена.
    baseURL: '/',
    head: {
      // Пока сайт не готов и не анонсируется (NDA) — закрыт от индексации.
      // Снять при выходе в прод. См. память deploy-domain-plan.
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
      // Фавикон = брендовое лого (монограмма AY). SVG — основной для
      // современных браузеров, .ico — фолбэк, apple-touch-icon — для iOS.
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Прелоад основного шрифта — убирает мигание текста (FOUT) на первой отрисовке.
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/InterVariable.woff2', crossorigin: '' },
      ],
    },
  },

  nitro: {
    // Статический пресет под GitHub Pages (добавляет .nojekyll и SPA-fallback).
    preset: 'github-pages',
    prerender: {
      crawlLinks: true,
      // Стартовые точки — корни локалей; дальше краулер идёт по ссылкам навигации.
      // Чистый '/' не генерим — за него отвечает статический public/index.html.
      // ВАЖНО: ignore матчит по префиксу, поэтому строка '/' срезала бы ВСЕ
      // маршруты. Точный матч только корня — через regex.
      routes: ['/en', '/ru', '/uk'],
      ignore: [/^\/$/],
    },
  },

  // Мультиязычность: en (основной) / ru / uk.
  // strategy 'prefix' — у всех языков префикс в URL (/en, /ru, /uk).
  // Контент зеркалится по папкам content/<locale>/** — путь маршрута совпадает с путём документа.
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'uk', language: 'uk-UA', name: 'Українська', file: 'uk.json' },
    ],
    // UI-строки: i18n/locales/<code>.json
    langDir: 'locales',
    // Автоопределение языка на клиенте (сайт статический — серверного редиректа нет):
    // при заходе на '/' выбирает язык по navigator.language и запоминает в cookie.
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },
})
