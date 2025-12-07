<script setup lang="ts">
import { useField } from 'vee-validate'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { contactSchema, type ContactInput } from '~/lib/schemas'

const { handleSubmit, errors } = useForm<ContactInput>(contactSchema)
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: subject } = useField<string>('subject')
const { value: message } = useField<string>('message')

const loading = ref(false)
const success = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    // Send form data to API
    await $fetch('/api/contact', {
      method: 'POST',
      body: values
    })
    success.value = true
  } catch (error) {
    console.error('Failed to submit form:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div v-if="success" class="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
      Message sent successfully!
    </div>

    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input
        id="name"
        v-model="name"
        :class="{ 'border-destructive': errors.name }"
        placeholder="Your name"
      />
      <p v-if="errors.name" class="text-sm text-destructive">
        {{ errors.name }}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        :class="{ 'border-destructive': errors.email }"
        placeholder="your@email.com"
      />
      <p v-if="errors.email" class="text-sm text-destructive">
        {{ errors.email }}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="subject">Subject</Label>
      <Input
        id="subject"
        v-model="subject"
        :class="{ 'border-destructive': errors.subject }"
        placeholder="What is this about?"
      />
      <p v-if="errors.subject" class="text-sm text-destructive">
        {{ errors.subject }}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="message">Message</Label>
      <Textarea
        id="message"
        v-model="message"
        :class="{ 'border-destructive': errors.message }"
        placeholder="Your message..."
        rows="5"
      />
      <p v-if="errors.message" class="text-sm text-destructive">
        {{ errors.message }}
      </p>
    </div>

    <Button type="submit" :disabled="loading" class="w-full">
      {{ loading ? 'Sending...' : 'Send Message' }}
    </Button>
  </form>
</template>