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

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">{{ $t('buttons.title') }}</h2>
      <div class="flex flex-wrap gap-4">
        <Button>{{ $t('buttons.default') }}</Button>
        <Button variant="secondary">{{ $t('buttons.secondary') }}</Button>
        <Button variant="destructive">{{ $t('buttons.destructive') }}</Button>
        <Button variant="outline">{{ $t('buttons.outline') }}</Button>
        <Button variant="ghost">{{ $t('buttons.ghost') }}</Button>
        <Button variant="link">{{ $t('buttons.link') }}</Button>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">{{ $t('sizes.title') }}</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">{{ $t('sizes.small') }}</Button>
        <Button size="default">{{ $t('sizes.default') }}</Button>
        <Button size="lg">{{ $t('sizes.large') }}</Button>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">{{ $t('iconButtons.title') }}</h2>
      <div class="flex flex-wrap gap-4">
        <Button size="icon">
          <Icon name="lucide:search" />
        </Button>
        <Button size="icon-sm" variant="outline">
          <Icon name="lucide:heart" />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <Icon name="lucide:settings" />
        </Button>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">{{ $t('inputs.title') }}</h2>
      <div class="max-w-md space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('inputs.email') }}</label>
          <Input v-model="emailValue" type="email" :placeholder="$t('inputs.emailPlaceholder')" />
          <p v-if="emailValue" class="text-sm text-muted-foreground">{{ $t('inputs.value') }} {{ emailValue }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('inputs.password') }}</label>
          <Input v-model="passwordValue" type="password" :placeholder="$t('inputs.passwordPlaceholder')" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('inputs.search') }}</label>
          <Input v-model="searchValue" type="search" :placeholder="$t('inputs.searchPlaceholder')" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('inputs.disabled') }}</label>
          <Input disabled :placeholder="$t('inputs.disabledPlaceholder')" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('inputs.file') }}</label>
          <Input type="file" />
        </div>
      </div>
    </div>
  </div>
</template>
