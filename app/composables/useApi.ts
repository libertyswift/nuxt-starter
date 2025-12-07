import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/vue-query'

interface ApiError {
  message: string
  statusCode?: number
}

export const useApi = () => {
  const queryClient = useQueryClient()

  const createQuery = <TData = unknown, TError = ApiError>(
    key: string[],
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

// Example API composables
export const useUsers = () => {
  const { createQuery } = useApi()

  return createQuery(
    ['users'],
    () => $fetch('/api/users')
  )
}

export const useUser = (id: MaybeRef<string>) => {
  const { createQuery } = useApi()
  const userId = computed(() => unref(id))

  return createQuery(
    ['user', userId.value],
    () => $fetch(`/api/users/${userId.value}`),
    {
      enabled: computed(() => !!userId.value)
    }
  )
}

export const useCreateUser = () => {
  const { createMutation, queryClient } = useApi()

  return createMutation(
    (userData: { name: string; email: string }) =>
      $fetch('/api/users', {
        method: 'POST',
        body: userData
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
    }
  )
}

export const useUpdateUser = () => {
  const { createMutation, queryClient } = useApi()

  return createMutation(
    ({ id, data }: { id: string; data: Partial<{ name: string; email: string }> }) =>
      $fetch(`/api/users/${id}`, {
        method: 'PATCH',
        body: data
      }),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      }
    }
  )
}

export const useDeleteUser = () => {
  const { createMutation, queryClient } = useApi()

  return createMutation(
    (id: string) =>
      $fetch(`/api/users/${id}`, {
        method: 'DELETE'
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
    }
  )
}