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

const store = usePublisherStore();


const successed = ref(false);
const visible = ref(false);

const publisherResolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  }),
);

const initialValues = ref({
  name: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, { message: 'Name is required' }),
    }),
  ),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const {
    name,
  } = event.states;

  store
    .addPublisher({
      name: name.value,
    })
    .then(() => {
      visible.value = false;
      successed.value = true;
    });
}

</script>

<template>
  <Button text icon="pi pi-plus" @click="visible = true" />

  <Drawer header="Add publisher" v-model:visible="visible" class="max-w-[40rem] w-full rounded-r-base">
      <Form @submit="submit" :resolver="resolver" class="flex flex-col min-h-full justify-between gap-4 w-full max-w-[120rem]">
        <div class="flex flex-col gap-4 h-full">
          <FormField v-slot="$field" class="flex flex-col gap-1" name="name">
            <label class="text-muted-color">Name *</label>
            <InputText fluid id="name" />
            <Message v-if="$field.invalid" severity="error" variant="simple" size="small">
              {{ $field.error.message }}
            </Message>
          </FormField>


        </div>

        <div class="flex flex-col gap-4">
        <Divider />
        <Button class="min-h-max" :loading="store.addLoading" type="submit">
          Add publisher
        </Button>
          </div>
      </Form>
  </Drawer>
</template>
