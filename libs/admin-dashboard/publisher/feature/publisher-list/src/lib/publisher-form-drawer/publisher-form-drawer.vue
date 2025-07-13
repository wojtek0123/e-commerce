<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import { ref } from 'vue';

import { usePublisherStore } from '@e-commerce/admin-dashboard/publisher/data-access';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import { Publisher } from '@e-commerce/shared/api-models';

const store = usePublisherStore();

const { publisher } = defineProps<{ publisher?: Publisher }>();

const visible = ref(false);

const initialValues = ref({
  name: publisher?.name || '',
});

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, { message: 'Name is required' }),
    }),
  ),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name } = event.states;

  (publisher
    ? store.updatePublisher(publisher.id, { name: name.value })
    : store.addPublisher({ name: name.value })
  ).then(() => {
    visible.value = false;
  });

  store;
}
</script>

<template>
  <Button
    text
    v-tooltip.left="!!publisher ? 'Update' : 'Add'"
    :icon="!!publisher ? 'pi pi-pencil' : 'pi pi-plus'"
    :severity="!!publisher ? 'secondary' : 'primary'"
    :title="publisher ? 'Update publisher' : 'Add publisher'"
    @click="visible = true"
  />

  <Drawer
    v-model:visible="visible"
    header="Add publisher"
    class="max-w-[40rem] w-full rounded-r-base"
  >
    <Form
      :resolver="resolver"
      :initial-values="initialValues"
      class="flex flex-col min-h-full justify-between gap-4 w-full max-w-[120rem]"
      @submit="submit"
    >
      <div class="flex flex-col gap-4 h-full">
        <FormField v-slot="$field" class="flex flex-col gap-1" name="name">
          <label class="text-muted-color">Name *</label>
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
        class="min-h-max"
        :label="(!!publisher ? 'Update' : 'Add') + ' publisher'"
        :loading="store.drawerLoading"
        type="submit"
      />
    </Form>
  </Drawer>
</template>
