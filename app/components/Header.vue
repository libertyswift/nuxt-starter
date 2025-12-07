<script setup lang="ts">
import { Button } from '~/components/ui/button'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 max-w-screen-2xl items-center justify-between px-8">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-bold">
          {{ $t('header.title') }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          @click="toggleTheme"
          :aria-label="isDark ? $t('header.theme.light') : $t('header.theme.dark')"
        >
          <Icon v-if="isDark" name="lucide:sun" class="size-5" />
          <Icon v-else name="lucide:moon" class="size-5" />
        </Button>
      </div>
    </div>
  </header>
</template>