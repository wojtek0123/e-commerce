<script setup lang="ts">
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext';

const store = useBooksStore();

const formVisibility = ref(false);

const categoryResolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  }),
);

function addCategory(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name } = event.values;

  store.addCategory({ name }).then(() => {
    formVisibility.value = false;
  });
}
</script>


<template>

  <Button class="h-fit mt-7" aria-label="Add category" v-tooltip="'Add category'" icon="pi pi-plus"
    @click="formVisibility = true" severity="secondary" />

  <Drawer header="Add category" v-model:visible="formVisibility" class="max-w-[40rem] w-full rounded-r-base">
    <Form @submit="addCategory" :resolver="categoryResolver"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem] pb-4">
      <div class="flex flex-col gap-4">
        <FormField v-slot="$field" class="flex flex-col gap-1" name="name">
          <label class="text-muted-color">Name</label>
          <InputText fluid id="name" />
          <Message v-if="$field.invalid" severity="error" variant="simple" size="small">
            {{ $field.error.message }}
          </Message>
        </FormField>
      </div>
      <Button :loading="store.addLoading" type="submit">Add category</Button>
    </Form>
  </Drawer>
</template>
