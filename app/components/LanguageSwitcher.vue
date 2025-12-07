<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter((l: any) => l.code !== locale.value)
})

const currentLocale = computed(() => {
  return locales.value.find((l: any) => l.code === locale.value)
})

const switchLocale = () => {
  const nextLocale = availableLocales.value[0]
  if (nextLocale) {
    setLocale(nextLocale.code)
  }
}
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    @click="switchLocale"
    class="gap-2"
  >
    <Icon name="lucide:languages" class="size-4" />
    <span class="text-sm font-medium">{{ currentLocale?.code.toUpperCase() }}</span>
  </Button>
</template>