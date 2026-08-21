<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value.filter((l) => l.code !== locale.value))

const currentLocale = computed(() => locales.value.find((l) => l.code === locale.value))

const switchLocale = () => {
  const nextLocale = availableLocales.value[0]
  if (nextLocale) {
    setLocale(nextLocale.code)
  }
}
</script>

<template>
  <Button
    data-testid="language-switcher"
    variant="ghost"
    size="sm"
    class="gap-2"
    @click="switchLocale"
  >
    <Icon name="lucide:languages" class="size-4" />
    <span class="text-sm font-medium">{{ currentLocale?.code.toUpperCase() }}</span>
  </Button>
</template>