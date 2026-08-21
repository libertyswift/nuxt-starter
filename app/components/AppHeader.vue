<script setup lang="ts">
import { Button } from '~/components/ui/button'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 max-w-[96rem] items-center justify-between px-8">
      <div class="flex items-center gap-6">
        <span class="text-xl font-bold">
          {{ $t('header.title') }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <LanguageSwitcher />

        <Button
          data-testid="theme-toggle"
          variant="ghost"
          size="icon"
          :aria-label="isDark ? $t('header.theme.light') : $t('header.theme.dark')"
          @click="toggleTheme"
        >
          <Icon v-if="isDark" name="lucide:sun" class="size-5" />
          <Icon v-else name="lucide:moon" class="size-5" />
        </Button>
      </div>
    </div>
  </header>
</template>