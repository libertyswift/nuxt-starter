import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import {
  fetchPostsCached,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  type Post,
  type CreatePostData,
} from '@/api/posts'

/**
 * Query для получения списка постов (через server кэш)
 */
export const usePostsQuery = (
  limit: MaybeRef<number> = 10,
  initialData?: Post[]
) => {
  return useQuery({
    queryKey: ['posts', { limit }],
    queryFn: () => fetchPostsCached(unref(limit)),
    initialData,
  })
}

/**
 * Query для получения конкретного поста
 */
export const usePostQuery = (id: MaybeRef<number | null>) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => {
      const postId = unref(id)
      if (!postId) throw new Error('Post ID is required')
      return fetchPostById(postId)
    },
    enabled: computed(() => unref(id) !== null),
  })
}

/**
 * Mutation для создания поста
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      // Инвалидируем кэш списка постов
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Mutation для обновления поста
 */
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePostData }) =>
      updatePost(id, data),
    onSuccess: (_, variables) => {
      // Инвалидируем кэш конкретного поста и списка
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Mutation для удаления поста
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, id) => {
      // Инвалидируем кэш
      queryClient.invalidateQueries({ queryKey: ['post', id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}