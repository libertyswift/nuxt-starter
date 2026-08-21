import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'

export interface ApiError {
  message: string
  statusCode?: number
}

/**
 * Тонкая обёртка над vue-query с типом ошибки проекта.
 *
 * Ключ передавай реактивным (ref/computed) там, где он зависит от состояния,
 * иначе запрос не перезапросится при его изменении.
 */
export const useApi = () => {
  const queryClient = useQueryClient()

  const createQuery = <TData = unknown, TError = ApiError>(
    key: MaybeRef<QueryKey>,
    fetcher: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TData, TError>({
      queryKey: key,
      queryFn: fetcher,
      ...options
    })
  }

  const createMutation = <TData = unknown, TVariables = unknown, TError = ApiError>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables>
  ) => {
    return useMutation<TData, TError, TVariables>({
      mutationFn,
      ...options
    })
  }

  return {
    createQuery,
    createMutation,
    queryClient
  }
}
