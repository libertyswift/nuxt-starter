<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const { signIn, loading } = useAuth()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  const result = await signIn(email.value, password.value)

  if (!result.success) {
    error.value = t('auth.loginError')
  }
}
</script>

<template>
  <div class="space-y-4">
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

    <div v-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>

    <Button
      class="w-full"
      @click="handleSubmit"
      :disabled="loading"
    >
      {{ loading ? t('auth.loading') : t('auth.login') }}
    </Button>
  </div>
</template>