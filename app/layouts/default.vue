<script setup lang="ts">
const colorMode = useColorMode()

// Применяем класс dark к html элементу
watchEffect(() => {
  if (process.client) {
    if (colorMode.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <slot />
    </main>
  </div>
</template>