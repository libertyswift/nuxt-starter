<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// Для SSR: сначала загружаем данные через useFetch
const { data: initialPosts } = await useFetch<Post[]>('/api/posts', {
  query: { limit: 10 },
})

// Затем используем TanStack Query для кэширования и управления данными на клиенте
const {
  data: posts,
  refetch,
  isFetching,
} = useQuery({
  queryKey: ['posts', { limit: 10 }],
  queryFn: async () => {
    const response = await $fetch<Post[]>('/api/posts', {
      query: { limit: 10 },
    })
    return response
  },
  initialData: initialPosts.value ?? undefined,
})

// Состояние для просмотра конкретного поста
const selectedPostId = ref<number | null>(null)

// Загружаем детали поста с помощью useQuery
// Запрос активируется только когда selectedPostId не null
const {
  data: selectedPost,
  isPending: isLoadingPost,
} = useQuery({
  queryKey: ['post', selectedPostId],
  queryFn: async () => {
    if (!selectedPostId.value) return null
    const response = await $fetch<Post>(`/api/posts/${selectedPostId.value}`)
    return response
  },
  enabled: computed(() => selectedPostId.value !== null),
})

// Функция для выбора поста (query автоматически загрузит данные)
const loadPost = (id: number) => {
  selectedPostId.value = id
}

// Закрыть детали поста
const closePost = () => {
  selectedPostId.value = null
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Посты из JSONPlaceholder API</h1>
      <p class="text-muted-foreground">
        Пример реальных API запросов через Nuxt server endpoints
      </p>
      <button
        @click="refetch()"
        :disabled="isFetching"
        class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {{ isFetching ? 'Обновление...' : 'Обновить' }}
      </button>
    </div>

    <!-- Список постов -->
    <div v-if="posts && posts.length > 0" class="grid gap-4 md:grid-cols-2">
      <div
        v-for="post in posts"
        :key="post.id"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        :class="{ 'ring-2 ring-primary': selectedPostId === post.id }"
        @click="loadPost(post.id)"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-lg line-clamp-2">
            {{ post.title }}
          </h3>
          <span class="text-xs text-muted-foreground ml-2 flex-shrink-0">
            #{{ post.id }}
          </span>
        </div>
        <p class="text-sm text-muted-foreground line-clamp-3">
          {{ post.body }}
        </p>
        <div class="mt-3 flex items-center text-xs text-muted-foreground">
          <Icon name="lucide:user" class="w-4 h-4 mr-1" />
          User {{ post.userId }}
        </div>
      </div>
    </div>

    <!-- Детали выбранного поста (модальное окно) -->
    <div
      v-if="selectedPostId"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="closePost"
    >
      <div
        class="bg-background border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-2xl font-bold">Детали поста #{{ selectedPostId }}</h2>
          <button
            @click="closePost"
            class="text-muted-foreground hover:text-foreground"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div v-if="isLoadingPost" class="text-center py-12 text-muted-foreground">
          Загрузка...
        </div>

        <div v-else-if="selectedPost" class="space-y-4">
          <div>
            <div class="text-sm text-muted-foreground mb-1">Заголовок</div>
            <h3 class="text-xl font-semibold">{{ selectedPost.title }}</h3>
          </div>

          <div>
            <div class="text-sm text-muted-foreground mb-1">Содержание</div>
            <p class="text-foreground">{{ selectedPost.body }}</p>
          </div>

          <div class="flex gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">Post ID:</span>
              <span class="font-medium ml-1">{{ selectedPost.id }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">User ID:</span>
              <span class="font-medium ml-1">{{ selectedPost.userId }}</span>
            </div>
          </div>

          <div class="pt-4 border-t">
            <div class="text-xs text-muted-foreground">
              <strong>API Endpoint:</strong> GET /api/posts/{{ selectedPost.id }}
              <br>
              <strong>External API:</strong> https://jsonplaceholder.typicode.com/posts/{{ selectedPost.id }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о реализации -->
    <div class="mt-8 border rounded-lg p-6 bg-muted/30">
      <h2 class="text-xl font-semibold mb-4">Как это работает</h2>
      <div class="space-y-3 text-sm">
        <div>
          <strong class="text-foreground">1. Server API endpoints:</strong>
          <ul class="list-disc list-inside ml-4 mt-1 space-y-1 text-muted-foreground">
            <li><code class="bg-muted px-2 py-0.5 rounded">server/api/posts/index.get.ts</code> - список постов</li>
            <li><code class="bg-muted px-2 py-0.5 rounded">server/api/posts/[id].get.ts</code> - детали поста</li>
          </ul>
        </div>

        <div>
          <strong class="text-foreground">2. Внешний API:</strong>
          <p class="text-muted-foreground ml-4 mt-1">
            JSONPlaceholder (https://jsonplaceholder.typicode.com) - бесплатный fake REST API для тестирования
          </p>
        </div>

        <div>
          <strong class="text-foreground">3. TanStack Query с SSR:</strong>
          <ul class="list-disc list-inside ml-4 mt-1 space-y-1 text-muted-foreground">
            <li><code class="bg-muted px-2 py-0.5 rounded">useFetch</code> для SSR + <code class="bg-muted px-2 py-0.5 rounded">useQuery</code> с initialData</li>
            <li>Данные загружаются на сервере, затем управляются TanStack Query</li>
            <li>Умный кэш с автоматической инвалидацией (staleTime: 5 секунд)</li>
            <li>При повторном клике на тот же пост - данные из кэша (мгновенно!)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>