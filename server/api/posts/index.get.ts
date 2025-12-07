import { fetchPosts } from '../../../app/api/posts'

/**
 * Кэшированный endpoint для списка постов
 *
 * ПРИМЕР серверного кэширования:
 * - Кэш живёт 5 минут для ВСЕХ пользователей
 * - Экономит запросы к внешнему API
 * - SWR: отдаёт старые данные, обновляет в фоне
 *
 * В реальном проекте используй для:
 * - API с секретными ключами
 * - Дорогих запросов к БД
 * - API с лимитами запросов
 */
export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event)
    const limit = Number(query.limit) || 10

    // Используем API функцию вместо прямого вызова
    return await fetchPosts(limit)
  },
  {
    maxAge: 60 * 5, // Кэш на 5 минут
    swr: true, // Stale-While-Revalidate: отдаёт старые данные, обновляет в фоне
    getKey: (event) => {
      const query = getQuery(event)
      return `posts:${query.limit || 10}`
    },
  }
)