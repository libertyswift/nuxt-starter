interface SeoOptions {
  title?: string
  description?: string
  image?: string
  path?: string
  locale?: string
}

export const useSeo = (options: SeoOptions = {}) => {
  const route = useRoute()
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()

  const siteUrl = runtimeConfig.public.siteUrl || 'http://localhost:3000'
  const currentPath = options.path || route.path
  const currentLocale = options.locale || locale.value
  const canonicalUrl = `${siteUrl}${currentPath}`

  useSeoMeta({
    title: options.title || 'Nuxt Starter',
    description: options.description || 'A modern Nuxt 3 starter with shadcn-vue, Tailwind CSS, and more',
    ogTitle: options.title || 'Nuxt Starter',
    ogDescription: options.description || 'A modern Nuxt 3 starter with shadcn-vue, Tailwind CSS, and more',
    ogImage: options.image || `${siteUrl}/og-image.png`,
    ogUrl: canonicalUrl,
    ogLocale: currentLocale,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title || 'Nuxt Starter',
    twitterDescription: options.description || 'A modern Nuxt 3 starter with shadcn-vue, Tailwind CSS, and more',
    twitterImage: options.image || `${siteUrl}/og-image.png`
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ]
  })
}