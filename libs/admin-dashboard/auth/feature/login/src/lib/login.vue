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
  <div class="flex flex-col w-full mb-8">
    <h2 class="text-3xl xl:text-4xl">Welcome!</h2>
    <div class="flex items-center text-base">
      <span>You can log in into admin dashboard if you have access</span>
    </div>
  </div>
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
      <label class="text-muted-color">What is your email address?</label>
      <InputText type="text" fluid placeholder="Email" />
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
      <label class="text-muted-color">What is your password?</label>
      <Password
        name="password"
        :feedback="false"
        :toggle-mask="true"
        fluid
        placeholder="Password"
      />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>
    <Button class="mt-2" type="submit" label="Log in" fluid />
  </Form>
</template>
