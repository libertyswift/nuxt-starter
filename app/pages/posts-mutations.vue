<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface CreatePostData {
  title: string
  body: string
}

const queryClient = useQueryClient()

// Для SSR: сначала загружаем данные через useFetch
const { data: initialPosts } = await useFetch<Post[]>('/api/posts', {
  query: { limit: 5 },
})

// Затем используем TanStack Query для кэширования и управления данными на клиенте
const { data: posts } = useQuery({
  queryKey: ['posts', { limit: 5 }],
  queryFn: async () => {
    const response = await $fetch<Post[]>('/api/posts', {
      query: { limit: 5 },
    })
    return response
  },
  initialData: initialPosts.value ?? undefined,
})

// Форма для создания нового поста
const newPost = ref<CreatePostData>({
  title: '',
  body: '',
})

// Mutation для создания поста
const createPostMutation = useMutation({
  mutationFn: async (data: CreatePostData) => {
    return await $fetch<Post>('/api/posts/create', {
      method: 'POST',
      body: data,
    })
  },
  onSuccess: (data) => {
    // Инвалидируем кэш списка постов, чтобы они перезагрузились
    queryClient.invalidateQueries({ queryKey: ['posts'] })

    // Очищаем форму
    newPost.value = { title: '', body: '' }

    // Показываем уведомление
    console.log('Пост создан:', data)
  },
  onError: (error) => {
    console.error('Ошибка создания поста:', error)
  },
})

// Создать пост
const handleCreatePost = () => {
  if (!newPost.value.title || !newPost.value.body) {
    return
  }
  createPostMutation.mutate(newPost.value)
}

// Состояние для редактирования
const editingPost = ref<Post | null>(null)
const editForm = ref<CreatePostData>({
  title: '',
  body: '',
})

// Mutation для обновления поста
const updatePostMutation = useMutation({
  mutationFn: async (data: { id: number; post: CreatePostData }) => {
    return await $fetch<Post>(`/api/posts/${data.id}`, {
      method: 'PUT',
      body: data.post,
    })
  },
  onSuccess: (data) => {
    // Инвалидируем кэш
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    queryClient.invalidateQueries({ queryKey: ['post', data.id] })

    // Закрываем форму редактирования
    editingPost.value = null

    console.log('Пост обновлён:', data)
  },
  onError: (error) => {
    console.error('Ошибка обновления поста:', error)
  },
})

// Начать редактирование
const startEdit = (post: Post) => {
  editingPost.value = post
  editForm.value = {
    title: post.title,
    body: post.body,
  }
}

// Сохранить изменения
const handleUpdatePost = () => {
  if (!editingPost.value || !editForm.value.title || !editForm.value.body) {
    return
  }
  updatePostMutation.mutate({
    id: editingPost.value.id,
    post: editForm.value,
  })
}

// Отменить редактирование
const cancelEdit = () => {
  editingPost.value = null
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">TanStack Query Mutations</h1>
      <p class="text-muted-foreground">
        Примеры использования useMutation для создания и обновления данных
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Форма создания поста -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Создать новый пост</h2>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium">Заголовок</label>
            <input
              v-model="newPost.title"
              class="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Введите заголовок"
            >
          </div>

          <div>
            <label class="text-sm font-medium">Содержание</label>
            <textarea
              v-model="newPost.body"
              class="w-full mt-1 px-3 py-2 border rounded-md min-h-[100px]"
              placeholder="Введите текст поста"
            />
          </div>

          <button
            @click="handleCreatePost"
            :disabled="createPostMutation.isPending || !newPost.title || !newPost.body"
            class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ createPostMutation.isPending ? 'Создание...' : 'Создать пост' }}
          </button>

          <!-- Статус создания -->
          <div v-if="createPostMutation.isSuccess" class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded">
            Пост успешно создан! ID: {{ createPostMutation.data?.id }}
          </div>

          <div v-if="createPostMutation.isError" class="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded">
            Ошибка при создании поста
          </div>
        </div>
      </section>

      <!-- Список постов -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Список постов</h2>

        <div v-if="posts" class="space-y-3">
          <div
            v-for="post in posts"
            :key="post.id"
            class="border rounded-lg p-4 space-y-2"
          >
            <div class="flex items-start justify-between">
              <h3 class="font-semibold">{{ post.title }}</h3>
              <button
                @click="startEdit(post)"
                class="text-sm text-primary hover:underline"
              >
                Редактировать
              </button>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ post.body }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Модальное окно редактирования -->
    <div
      v-if="editingPost"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="cancelEdit"
    >
      <div
        class="bg-background border rounded-lg p-6 max-w-2xl w-full"
        @click.stop
      >
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-2xl font-bold">Редактировать пост #{{ editingPost.id }}</h2>
          <button
            @click="cancelEdit"
            class="text-muted-foreground hover:text-foreground"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium">Заголовок</label>
            <input
              v-model="editForm.title"
              class="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Введите заголовок"
            >
          </div>

          <div>
            <label class="text-sm font-medium">Содержание</label>
            <textarea
              v-model="editForm.body"
              class="w-full mt-1 px-3 py-2 border rounded-md min-h-[150px]"
              placeholder="Введите текст поста"
            />
          </div>

          <div class="flex gap-3">
            <button
              @click="handleUpdatePost"
              :disabled="updatePostMutation.isPending || !editForm.title || !editForm.body"
              class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {{ updatePostMutation.isPending ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              @click="cancelEdit"
              class="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Отмена
            </button>
          </div>

          <!-- Статус обновления -->
          <div v-if="updatePostMutation.isSuccess" class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded">
            Пост успешно обновлён!
          </div>

          <div v-if="updatePostMutation.isError" class="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded">
            Ошибка при обновлении поста
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о Mutations -->
    <div class="mt-8 border rounded-lg p-6 bg-muted/30">
      <h2 class="text-xl font-semibold mb-4">Преимущества useMutation</h2>
      <div class="space-y-3 text-sm">
        <div>
          <strong class="text-foreground">Автоматическое управление состоянием:</strong>
          <ul class="list-disc list-inside ml-4 mt-1 space-y-1 text-muted-foreground">
            <li><code class="bg-muted px-2 py-0.5 rounded">isPending</code> - отслеживание процесса выполнения</li>
            <li><code class="bg-muted px-2 py-0.5 rounded">isSuccess</code> / <code class="bg-muted px-2 py-0.5 rounded">isError</code> - статус выполнения</li>
            <li><code class="bg-muted px-2 py-0.5 rounded">data</code> - результат выполнения</li>
          </ul>
        </div>

        <div>
          <strong class="text-foreground">Инвалидация кэша:</strong>
          <p class="text-muted-foreground ml-4 mt-1">
            После успешного создания/обновления автоматически инвалидируем кэш с помощью
            <code class="bg-muted px-2 py-0.5 rounded">queryClient.invalidateQueries()</code>
          </p>
        </div>

        <div>
          <strong class="text-foreground">Callbacks:</strong>
          <ul class="list-disc list-inside ml-4 mt-1 space-y-1 text-muted-foreground">
            <li><code class="bg-muted px-2 py-0.5 rounded">onSuccess</code> - выполняется после успешного запроса</li>
            <li><code class="bg-muted px-2 py-0.5 rounded">onError</code> - выполняется при ошибке</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>