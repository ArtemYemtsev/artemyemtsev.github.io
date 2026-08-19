export interface SiteContact {
  title?: string
  icon?: string
  link?: string
}

interface ContentBlock {
  type?: string
  contacts?: SiteContact[]
}

/**
 * Контакты и соцсети — один источник истины: блок `contacts` со страницы
 * /<locale>/contacts. Раньше футер и hero держали свои хардкод-копии, которые
 * успели разойтись с контентом (в hero был GitHub, в футере — Instagram).
 */
export function useSiteContacts() {
  const { locale } = useI18n()

  const { data } = useAsyncData(
    () => `site-contacts-${locale.value}`,
    () => queryCollection('content').path(`/${locale.value}/contacts`).first(),
    { watch: [locale] },
  )

  const contacts = computed<SiteContact[]>(() => {
    const body = data.value?.body as unknown as ContentBlock[] | undefined
    return body?.find(block => block.type === 'contacts')?.contacts ?? []
  })

  // Почта нужна футеру отдельно — крупной ссылкой в CTA.
  const email = computed(() => {
    const item = contacts.value.find(contact => contact.link?.startsWith('mailto:'))
    return item?.link?.replace('mailto:', '') ?? ''
  })

  return { contacts, email }
}
