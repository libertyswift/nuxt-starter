<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const emailValue = ref('')
const passwordValue = ref('')
const searchValue = ref('')
</script>

<template>
  <div class="container mx-auto p-8 space-y-8">
    <h1 class="text-4xl font-bold">{{ $t('welcome') }}</h1>
  </div>
</template>
