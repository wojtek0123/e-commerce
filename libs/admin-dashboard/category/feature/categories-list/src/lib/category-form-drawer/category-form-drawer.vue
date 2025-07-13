<script setup lang="ts">
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import Message from 'primevue/message';
import { useCategoriesStore } from '@e-commerce/admin-dashboard/category/data-access';
import { Category } from '@e-commerce/shared/api-models';

const store = useCategoriesStore();

const visible = ref(false);

const { category } = defineProps<{
  category?: Category;
}>();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }).toLowerCase(),
  }),
);

const initialValues = ref({
  name: category?.name ?? '',
});

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name } = event.states;

  (category
    ? store.updateCategory(category.id, { name: name.value })
    : store.addCategory({ name: name.value })
  ).then(() => {
    visible.value = false;
  });
}
</script>

<template>
  <Button
    text
    v-tooltip.left="!!category ? 'Update' : 'Add'"
    :icon="!!category ? 'pi pi-pencil' : 'pi pi-plus'"
    severity="primary"
    :title="category ? 'Update category' : 'Add category'"
    @click="visible = true"
  />
  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full rounded-r-base">
    <Form
      :initial-values="initialValues"
      :resolver="resolver"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem]"
      @submit="submit"
    >
      <div class="flex flex-col gap-4">
        <FormField v-slot="$field" class="flex flex-col gap-1" name="name">
          <label class="text-muted-color">Name</label>
          <InputText id="name" fluid />
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
        :loading="store.popupLoading"
        class="min-h-max"
        :label="(category ? 'Update' : 'Add') + ' category'"
        type="submit"
      />
    </Form>
  </Drawer>
</template>
