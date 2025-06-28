<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import { useCountryStore } from '@e-commerce/admin-dashboard/country/data-access';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { Country } from '@e-commerce/shared/api-models';

const visible = ref(false);
const { country } = defineProps<{ country?: Country }>();

const store = useCountryStore();
const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    code: z
      .string()
      .min(1, { message: 'Code is required' })
      .max(3, { message: 'Code must be 3 characters long' }),
  }),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name, code } = event.states;

  store
    .addCountry({
      name: name.value,
      code: code.value,
    })
    .then(() => {
      visible.value = false;
    })
    .catch((error) => {
      console.error('Error adding country:', error);
    });
}

onMounted(() => {});
</script>

<template>
  <Button
    text
    :icon="!!country ? 'pi pi-pencil' : 'pi pi-plus'"
    :severity="!!country ? 'secondary' : 'primary'"
    title="Add country"
    @click="visible = true"
  />
  <Drawer
    v-model:visible="visible"
    class="max-w-[40rem] w-full rounded-r-base"
  >
    <Form
      :resolver="resolver"
      :initial-value="{ name: country?.name || '', code: country?.code || '' }"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem]"
      @submit="submit"
    >
      <div class="flex flex-col gap-4">
        <FormField
          v-slot="$field"
          class="flex flex-col gap-1"
          name="name"
        >
          <label class="text-muted-color">Name</label>
          <InputText
            id="name"
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
          name="code"
        >
          <label class="text-muted-color">Code</label>
          <InputText
            id="code"
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
        label="Add country"
        type="submit"
        :loading="false"
      />
    </Form>
  </Drawer>
</template>
