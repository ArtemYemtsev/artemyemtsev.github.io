/**
 * Навигация текущей локали. Один источник на шапку и футер — раньше запрос
 * с разбором дерева жил только в Header, и футер пришлось бы дублировать.
 *
 * Узел локали ('/ru') — контейнер. @nuxt/content кладёт саму страницу-раздел
 * первым дочерним узлом (self-index), поэтому children уже начинается с главной
 * ('/ru', title из index.json) и содержит все подстраницы. Сам root вручную НЕ
 * добавляем: его path совпадает с self-index (был бы дубль ссылки на главную),
 * а title — имя папки ('Ru'), а не из index.json.
 */
export function useLocaleNav() {
  const { locale } = useI18n()

  const { data } = useAsyncData('navigation', () => {
    return queryCollectionNavigation('content').order('path', 'ASC')
  })

  return computed(() => {
    const root = data.value?.find(item => item.path === `/${locale.value}`)
    return root?.children ?? []
  })
}
