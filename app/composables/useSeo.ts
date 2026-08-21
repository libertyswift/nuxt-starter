interface SeoOptions {
  title?: string
  description?: string
  image?: string
}

/**
 * Тонкая обёртка над useSeoMeta для страниц.
 *
 * canonical, hreflang, og:site_name, twitter-фолбэки и og:image по умолчанию
 * уже проставляет @nuxtjs/seo — здесь только то, что специфично для страницы.
 */
export const useSeo = (options: SeoOptions = {}) => {
  useSeoMeta({
    title: () => options.title,
    description: () => options.description,
    ogTitle: () => options.title,
    ogDescription: () => options.description,
    ogImage: () => options.image
  })
}
