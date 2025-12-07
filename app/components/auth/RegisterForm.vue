<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const { signUp, loading } = useAuth()
const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.passwordMismatch')
    return
  }

  const result = await signUp(email.value, password.value, name.value)

  if (!result.success) {
    error.value = t('auth.registerError')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label for="name">{{ t('auth.name') }}</Label>
      <Input
        id="name"
        v-model="name"
        type="text"
        :placeholder="t('auth.namePlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <Label for="email">{{ t('auth.email') }}</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        :placeholder="t('auth.emailPlaceholder')"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="password">{{ t('auth.password') }}</Label>
      <Input
        id="password"
        v-model="password"
        type="password"
        :placeholder="t('auth.passwordPlaceholder')"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="confirmPassword">{{ t('auth.confirmPassword') }}</Label>
      <Input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        :placeholder="t('auth.confirmPasswordPlaceholder')"
        required
      />
    </div>

    <div v-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>

    <Button
      class="w-full"
      @click="handleSubmit"
      :disabled="loading"
    >
      {{ loading ? t('auth.loading') : t('auth.register') }}
    </Button>
  </div>
</template>