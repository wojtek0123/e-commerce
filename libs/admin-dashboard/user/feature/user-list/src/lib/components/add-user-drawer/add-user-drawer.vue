<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import { useUserStore } from '@e-commerce/admin-dashboard/user/data-access';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Select from 'primevue/select';
import { Role } from '@e-commerce/shared/api-models';
import { User } from '@e-commerce/shared/api-models';

const visible = ref(false);
const { user } = defineProps<{ user?: User }>();
const roles = ref<{ name: string; value: Role }[]>([
  { name: 'Admin', value: 'ADMIN' },
  { name: 'User', value: 'USER' },
]);
console.log(user)
const store = useUserStore();
const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    role: z.string().min(1, { message: 'Role is required' }),
  }),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { email, password, role } = event.states;

  store
    .addUser({
      email: email.value,
      password: password.value,
      role: role.value,
    })
    .then(() => {
      visible.value = false;
    })
    .catch((error) => {
      console.error('Error adding user:', error);
    });
}

onMounted(() => {

})
</script>

<template>
  <Button
    text
    icon="pi pi-plus"
    @click="visible = true"
  />
  <Drawer
    v-model:visible="visible"
    class="max-w-[40rem] w-full rounded-r-base"
  >
    <Form
      :resolver="resolver"
      :initial-value="{email: user.email, password: '', role: user.role}"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem]"
      @submit="submit"
    >
      <div class="flex flex-col gap-4">
        <FormField
          v-slot="$field"
          class="flex flex-col gap-1"
          name="email"
        >
          <label class="text-muted-color">Email</label>
          <InputText
            id="email"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ $field.error.message }}
          </Message>
        </FormField>

        <FormField
          v-slot="$field"
          class="flex flex-col gap-1"
          name="password"
        >
          <label class="text-muted-color">Password</label>
          <InputText
            id="password"
            type="password"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ $field.error.message }}
          </Message>
        </FormField>

        <FormField
          v-slot="$field"
          class="flex flex-col gap-1"
          name="role"
        >
          <label class="text-muted-color">Role</label>
          <Select
            id="role"
            :options="roles"
            option-label="name"
            option-value="value"
            placeholder="Select a role"
            class="w-full"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ $field.error.message }}
          </Message>
        </FormField>
      </div>
      <Button
        class="min-h-max"
        label="Add User"
        type="submit"
        :loading="false"
      />
    </Form>
  </Drawer>
</template>
