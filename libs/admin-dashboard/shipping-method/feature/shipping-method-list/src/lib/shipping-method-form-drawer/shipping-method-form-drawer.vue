<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { ref } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';
import { useShippingMethodStore } from '@e-commerce/admin-dashboard/shipping-method/data-access';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { ShippingMethod } from '@e-commerce/shared/api-models';
import InputNumber from 'primevue/inputnumber';

const visible = ref(false);
const { shippingMethod } = defineProps<{ shippingMethod?: ShippingMethod }>();

const store = useShippingMethodStore();
const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    deliveryTime: z.string().min(1, { message: 'Delivery time is required' }),
  }),
);

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name, price, deliveryTime } = event.states;

  console.log('Submitting shipping method:', {
    name: name.value,
    price: price.value,
    deliveryTime: deliveryTime.value,
  });

  if (!!shippingMethod) {
    store
      .updateShippingMethod(shippingMethod.id, {
        name: name.value,
        price: price.value,
        deliveryTime: deliveryTime.value,
      })
      .then(() => {
        visible.value = false;
      })
      .catch((error) => {
        console.error('Error updating shipping method:', error);
      });
  } else {
    store
      .addShippingMethod({
        name: name.value,
        price: price.value,
        deliveryTime: deliveryTime.value,
      })
      .then(() => {
        visible.value = false;
      })
      .catch((error) => {
        console.error('Error adding shipping method:', error);
      });
  }
}

const initialValues = ref({
  name: shippingMethod?.name || '',
  price: shippingMethod?.price || 0,
  deliveryTime: shippingMethod?.deliveryTime || '',
});
</script>

<template>
  <Button
    text
    :icon="!!shippingMethod ? 'pi pi-pencil' : 'pi pi-plus'"
    :severity="!!shippingMethod ? 'secondary' : 'primary'"
    title="Add country"
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

        <FormField v-slot="$field" class="flex flex-col gap-1" name="price">
          <label class="text-muted-color">Price</label>
          <InputNumber
            id="code"
            currency="USD"
            :min-fraction-digits="0"
            :max-fraction-digits="2"
            :use-grouping="false"
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
          name="deliveryTime"
        >
          <label class="text-muted-color">Delivery time</label>
          <InputText id="code" fluid />
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
        :label="(shippingMethod ? 'Update ' : 'Add') + 'shipping method'"
        type="submit"
        :loading="store.popupLoading"
      />
    </Form>
  </Drawer>
</template>
