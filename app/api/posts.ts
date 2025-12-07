/**
 * АРХИТЕКТУРА API ЗАПРОСОВ:
 *
 * 1. fetchPosts - через server/api/ с кэшем (пример серверного кэширования)
 * 2. Остальные функции - прямые запросы к API (без серверного кэша)
 *
 * Для реальных проектов:
 * - Используй server/api/ когда нужны секретные ключи или БД
 * - Для публичных API - прямые запросы проще
 */

// Типы
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface CreatePostData {
  title: string
  body: string
}

// Получаем BASE_URL из runtime config
const getBaseUrl = () => {
  const config = useRuntimeConfig()
  return config.public.apiBaseUrl
}

/**
 * Получить список постов (прямой запрос к API)
 * Используется в server endpoint для кэширования
 */
export const fetchPosts = async (limit: number = 10): Promise<Post[]> => {
  const baseUrl = getBaseUrl()
  return await $fetch<Post[]>(`${baseUrl}/posts`, {
    query: { _limit: limit },
  })
}

/**
 * Получить список постов через server endpoint (с кэшем)
 * Рекомендуется использовать в компонентах для получения серверного кэша
 */
export const fetchPostsCached = async (limit: number = 10): Promise<Post[]> => {
  return await $fetch<Post[]>('/api/posts', {
    query: { limit },
  })
}

/**
 * Получить пост по ID
 */
export const fetchPostById = async (id: number): Promise<Post> => {
  const baseUrl = getBaseUrl()
  return await $fetch<Post>(`${baseUrl}/posts/${id}`)
}

/**
 * Создать новый пост
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const baseUrl = getBaseUrl()
  return await $fetch<Post>(`${baseUrl}/posts`, {
    method: 'POST',
    body: data,
  })
}

/**
 * Обновить пост
 */
export const updatePost = async (id: number, data: CreatePostData): Promise<Post> => {
  const baseUrl = getBaseUrl()
  return await $fetch<Post>(`${baseUrl}/posts/${id}`, {
    method: 'PUT',
    body: {
      ...data,
      id,
      userId: 1,
    },
  })
}

/**
 * Удалить пост
 */
export const deletePost = async (id: number): Promise<void> => {
  const baseUrl = getBaseUrl()
  await $fetch(`${baseUrl}/posts/${id}`, {
    method: 'DELETE',
  })
}