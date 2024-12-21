<script setup lang="ts">
import { z } from 'zod';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField, Form, FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useAuthStore } from '@e-commerce/admin-dashboard/auth/data-access';

const authStore = useAuthStore();

const resolver = zodResolver(
  z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
);

function onSubmit(event: FormSubmitEvent) {
  if (!event.valid) return;

  authStore.login({
    email: event.states.email.value,
    password: event.states.password.value,
  });
}
</script>

<template>
  <Form
    @submit="onSubmit"
    :resolver="resolver"
    class="w-full flex flex-col gap-2"
  >
    <FormField
      v-slot="$field"
      initial-value=""
      class="flex flex-col gap-1"
      name="email"
    >
      <label class="text-muted-color">Email</label>
      <InputText type="text" fluid />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>

    <FormField
      v-slot="$field"
      initial-value=""
      class="flex flex-col gap-1"
      name="password"
    >
      <label class="text-muted-color">Password</label>
      <Password name="password" :feedback="false" :toggle-mask="true" fluid />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>
    <Button type="submit" label="Log in" fluid />
  </Form>
</template>
