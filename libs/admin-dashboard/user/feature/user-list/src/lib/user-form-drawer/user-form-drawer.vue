<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { ref } from 'vue';
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

const initialValues = ref({
  email: user?.email || '',
  password: '',
  role: user?.role || '',
});

const store = useUserStore();
const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string(),
    role: z.string().min(1, { message: 'Role is required' }),
  }),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { email, password, role } = event.states;

  const body = {
    email: email.value,
    password: password.value,
    role: role.value as Role,
  };

  (user ? store.updateUser(user, body) : store.addUser(body))
    .then(() => {
      visible.value = false;
    })
    .catch((error) => {
      console.error('Error adding user:', error);
    });
}
</script>

<template>
  <Button
    text
    v-tooltip.left="!!user ? 'Update' : 'Add'"
    :icon="!!user ? 'pi pi-pencil' : 'pi pi-plus'"
    severity="primary"
    :title="!!user ? 'Update book' : 'Add book'"
    @click="visible = true"
  />
  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full rounded-r-base">
    <Form
      :resolver="resolver"
      :initial-values="initialValues"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem]"
      @submit="submit"
    >
      <div class="flex flex-col gap-4">
        <FormField v-slot="$field" class="flex flex-col gap-1" name="email">
          <label class="text-muted-color">Email</label>
          <InputText id="email" fluid />
          <Message
            v-if="$field.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ $field.error.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" class="flex flex-col gap-1" name="password">
          <label class="text-muted-color">Password</label>
          <InputText id="password" type="password" fluid />
          <Message
            v-if="$field.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ $field.error.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" class="flex flex-col gap-1" name="role">
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
        :label="(!!user ? 'Update' : 'Add') + ' user'"
        type="submit"
        :loading="store.popupLoading"
      />
    </Form>
  </Drawer>
</template>
