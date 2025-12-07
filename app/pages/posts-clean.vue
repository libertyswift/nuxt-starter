<script setup lang="ts">
import { fetchPostsCached } from '@/api/posts'
import { usePostsQuery, usePostQuery, useCreatePostMutation, useUpdatePostMutation } from '@/composables/usePosts'
import type { Post, CreatePostData } from '@/api/posts'

// SSR: загружаем начальные данные на сервере через useAsyncData
// Используем fetchPostsCached, который идёт через server endpoint с кэшем
const { data: initialData } = await useAsyncData('posts', () => fetchPostsCached(5))

// Используем TanStack Query, передаём данные из SSR через initialData
const { data: posts, isFetching, refetch } = usePostsQuery(5, initialData.value ?? undefined)

// Выбранный пост
const selectedPostId = ref<number | null>(null)
const { data: selectedPost, isPending: isLoadingPost } = usePostQuery(selectedPostId)

// Mutations
const createMutation = useCreatePostMutation()
const updateMutation = useUpdatePostMutation()

// Форма создания
const newPost = ref<CreatePostData>({ title: '', body: '' })

const handleCreate = () => {
  createMutation.mutate(newPost.value, {
    onSuccess: () => {
      newPost.value = { title: '', body: '' }
    },
  })
}

// Редактирование
const editingPost = ref<Post | null>(null)
const editForm = ref<CreatePostData>({ title: '', body: '' })

const startEdit = (post: Post) => {
  editingPost.value = post
  editForm.value = { title: post.title, body: post.body }
}

const handleUpdate = () => {
  if (!editingPost.value) return

  updateMutation.mutate(
    { id: editingPost.value.id, data: editForm.value },
    {
      onSuccess: () => {
        editingPost.value = null
      },
    }
  )
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Чистая архитектура с TanStack Query</h1>
      <p class="text-muted-foreground">
        API функции → Composables → Компоненты
      </p>
      <button
        @click="refetch()"
        :disabled="isFetching"
        class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {{ isFetching ? 'Обновление...' : 'Обновить' }}
      </button>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Форма создания -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Создать пост</h2>

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
              placeholder="Введите текст"
            />
          </div>

          <button
            @click="handleCreate"
            :disabled="createMutation.isPending || !newPost.title || !newPost.body"
            class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ createMutation.isPending ? 'Создание...' : 'Создать' }}
          </button>

          <div v-if="createMutation.isSuccess" class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded">
            ✓ Пост создан! ID: {{ createMutation.data?.id }}
          </div>

          <div v-if="createMutation.isError" class="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded">
            Ошибка при создании
          </div>
        </div>
      </section>

      <!-- Список постов -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Посты ({{ posts?.length || 0 }})</h2>

        <div v-if="posts" class="space-y-3">
          <div
            v-for="post in posts"
            :key="post.id"
            class="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow cursor-pointer"
            @click="selectedPostId = post.id"
          >
            <div class="flex items-start justify-between">
              <h3 class="font-semibold">{{ post.title }}</h3>
              <button
                @click.stop="startEdit(post)"
                class="text-sm text-primary hover:underline"
              >
                Изменить
              </button>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ post.body }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Модальное окно для просмотра поста -->
    <div
      v-if="selectedPostId && !editingPost"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="selectedPostId = null"
    >
      <div
        class="bg-background border rounded-lg p-6 max-w-2xl w-full"
        @click.stop
      >
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-2xl font-bold">Пост #{{ selectedPostId }}</h2>
          <button
            @click="selectedPostId = null"
            class="text-muted-foreground hover:text-foreground"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div v-if="isLoadingPost" class="text-center py-12">Загрузка...</div>

        <div v-else-if="selectedPost" class="space-y-4">
          <div>
            <div class="text-sm text-muted-foreground mb-1">Заголовок</div>
            <h3 class="text-xl font-semibold">{{ selectedPost.title }}</h3>
          </div>
          <div>
            <div class="text-sm text-muted-foreground mb-1">Содержание</div>
            <p>{{ selectedPost.body }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div
      v-if="editingPost"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="editingPost = null"
    >
      <div
        class="bg-background border rounded-lg p-6 max-w-2xl w-full"
        @click.stop
      >
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-2xl font-bold">Редактировать #{{ editingPost.id }}</h2>
          <button
            @click="editingPost = null"
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
            >
          </div>

          <div>
            <label class="text-sm font-medium">Содержание</label>
            <textarea
              v-model="editForm.body"
              class="w-full mt-1 px-3 py-2 border rounded-md min-h-[150px]"
            />
          </div>

          <div class="flex gap-3">
            <button
              @click="handleUpdate"
              :disabled="updateMutation.isPending"
              class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {{ updateMutation.isPending ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              @click="editingPost = null"
              class="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Отмена
            </button>
          </div>

          <div v-if="updateMutation.isSuccess" class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded">
            ✓ Пост обновлён!
          </div>
        </div>
      </div>
    </div>

    <!-- Архитектура -->
    <div class="mt-8 border rounded-lg p-6 bg-muted/30">
      <h2 class="text-xl font-semibold mb-4">Архитектура</h2>
      <div class="space-y-3 text-sm">
        <div>
          <strong>1. API функции</strong> (<code>app/api/posts.ts</code>)
          <p class="text-muted-foreground ml-4 mt-1">
            Обычные async функции. Работают везде: SSR, client, server endpoints
          </p>
        </div>

        <div>
          <strong>2. Composables</strong> (<code>app/composables/usePosts.ts</code>)
          <p class="text-muted-foreground ml-4 mt-1">
            Обёртки над TanStack Query. useQuery + useMutation + инвалидация кэша
          </p>
        </div>

        <div>
          <strong>3. Компоненты</strong>
          <p class="text-muted-foreground ml-4 mt-1">
            Используют composables. Чистый UI код без логики запросов
          </p>
        </div>

        <div>
          <strong>SSR:</strong>
          <p class="text-muted-foreground ml-4 mt-1">
            <code>useAsyncData</code> + API функция → данные на сервере<br>
            <code>useQuery</code> с начальными данными → TanStack Query на клиенте
          </p>
        </div>
      </div>
    </div>
  </div>
</template>