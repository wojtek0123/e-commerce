<script setup lang="ts">
import ButtonGroup from 'primevue/buttongroup';
import SelectButton from 'primevue/selectbutton';
import FileUpload, { FileUploadState } from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import AutoComplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import { Author, allBookTags } from '@e-commerce/shared/api-models';
import { ref } from 'vue';

import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { onUnmounted } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormSubmitEvent } from '@primevue/forms';

const store = useBooksStore();

type PublisherOption = 'Add' | 'Select';

const uploadFileState = ref<FileUploadState | null>(null);

const publisherOptions = ref<PublisherOption[]>(['Add', 'Select']);
const publisherInputType = ref<PublisherOption>('Select');
const successed = ref(false);
const visible = ref(false);
const authorFormVisibility = ref(false);
const bookTags = ref(allBookTags);

const authorsResolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  }),
);

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().optional(),
      language: z.string(),
      pageCount: z.number().nonnegative(),
      price: z.number().nonnegative(),
      publishedDate: z.date(),
      category: z.object({ id: z.string(), name: z.string().nonempty() }),
      quantity: z.number().nonnegative(),
      tag: z.string().optional(),
      authors: z
        .array(z.object({ id: z.string(), name: z.string() }))
        .min(1, { message: 'Select at least one author' }),
      publisherName: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (publisherInputType.value === 'Add') {
              return !!val;
            }
            return true;
          },
          { message: 'Publisher name is required when adding new publisher' },
        ),
      publisher: z
        .object({ id: z.string(), name: z.string() })
        .optional()
        .refine(
          (val) => {
            if (publisherInputType.value === 'Select') {
              return !!val;
            }
            return true;
          },
          {
            message:
              'Publisher selection is required when selecting existing publisher',
          },
        ),
    }),
  ),
);

function searchTag(event: AutoCompleteCompleteEvent) {
  bookTags.value = allBookTags.filter((tag) =>
    tag.toLowerCase().includes(event.query.toLowerCase()),
  );
}

function searchCategories(event: AutoCompleteCompleteEvent) {
  store.getCategories(event.query);
}

function searchAuthors(event: AutoCompleteCompleteEvent) {
  store.getAuthors(event.query);
}

function searchPublisher(event: AutoCompleteCompleteEvent) {
  store.getPublishers(event.query);
}

function uploadImageCover() {
  if (!uploadFileState.value) return;

  store.uploadCoverImage(uploadFileState.value.files[0]);
}

function deleteImageCover() {
  if (!uploadFileState.value) return;

  uploadFileState.value.files = [];

  store.deleteUploadedCoverImage();
}

function submit(event: FormSubmitEvent) {
  if (!event.valid) return;

  const {
    title,
    category,
    language,
    pageCount,
    price,
    publishedDate,
    publisher,
    quantity,
    tag,
    authors,
    publisherName,
    description,
  } = event.states;

  store
    .addBook({
      title: title.value,
      categoryId: category.value?.id,
      description: description.value ?? '',
      language: language.value,
      pages: pageCount.value,
      price: price.value,
      publishedDate: publishedDate.value.toISOString(),
      quantity: quantity.value,
      ...(tag.value && { tag: tag.value }),
      authorsId: authors.value.map((author: Author) => author.id),
      ...(publisherInputType.value === 'Add' && {
        publisherName: publisherName.value ?? undefined,
      }),
      ...(publisherInputType.value === 'Select' && {
        publisherId: publisher.value?.id,
      }),
    })
    .then(() => {
      visible.value = false;
      successed.value = true;
    });
}

function addAuthor(event: FormSubmitEvent) {
  if (!event.valid) return;

  const { name } = event.values;

  store.addAuthor({ name }).then(() => {
    authorFormVisibility.value = false;
  });
}

onUnmounted(() => {
  if (!successed.value && uploadFileState.value) {
    store.deleteUploadedCoverImage();
  }
});
</script>

<template>
  <Drawer
    v-model:visible="authorFormVisibility"
    class="max-w-[40rem] w-full rounded-r-base"
  >
    <Form
      @submit="addAuthor"
      :resolver="authorsResolver"
      class="flex flex-col h-full justify-between gap-2 w-full max-w-[120rem] pb-4"
    >
      <div class="flex flex-col gap-4">
        <FormField v-slot="$field" class="flex flex-col gap-1" name="name">
          <label class="text-muted-color">Name</label>
          <InputText fluid id="name" />
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
      <Button :loading="store.addLoading" type="submit">Add author</Button>
    </Form>
  </Drawer>

  <Button text icon="pi pi-plus" @click="visible = true" />

  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full rounded-r-base">
    <div>
      <Form
        @submit="submit"
        :resolver="resolver"
        class="flex flex-col h-full justify-between gap-4 w-full max-w-[120rem]"
      >
        <div class="flex flex-col gap-4">
          <FormField v-slot="$field" class="flex flex-col gap-1" name="title">
            <label class="text-muted-color">Title *</label>
            <InputText fluid id="title" />
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
            name="pageCount"
          >
            <label class="text-muted-color">Page count *</label>
            <InputNumber fluid id="pageCount" name="pageCount" />
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
            <label for="price" class="text-muted-color">Price *</label>
            <InputNumber
              fluid
              id="price"
              name="price"
              :min="0"
              :max-fraction-digits="2"
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
            name="quantity"
          >
            <label for="quantity" class="text-muted-color">Quantity *</label>
            <InputNumber id="quanity" name="quantity" fluid />
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
            name="publishedDate"
          >
            <label for="publish_date" class="text-muted-color">
              Published date
            </label>
            <DatePicker id="publish_date" name="publishedDate" fluid />
            <Message
              v-if="$field.invalid"
              severity="error"
              variant="simple"
              size="small"
            >
              {{ $field.error.message }}
            </Message>
          </FormField>

          <SelectButton
            :options="publisherOptions"
            v-model="publisherInputType"
          />

          <FormField
            v-if="publisherInputType === 'Select'"
            v-slot="$field"
            class="flex flex-col gap-1"
            name="publisher"
          >
            <label for="price" class="text-muted-color">Publisher</label>
            <AutoComplete
              id="publisher"
              dropdown
              fluid
              name="publisher"
              option-label="name"
              :suggestions="store.publishers"
              @complete="searchPublisher"
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
            v-if="publisherInputType === 'Add'"
            v-slot="$field"
            class="flex flex-col gap-1"
            name="publisherName"
          >
            <label for="publisherName" class="text-muted-color">
              Publisher name
            </label>
            <InputText fluid id="publisher-name" name="publisherName" />
            <Message
              v-if="$field.invalid"
              severity="error"
              variant="simple"
              size="small"
            >
              {{ $field.error.message }}
            </Message>
          </FormField>

          <FormField class="flex flex-col gap-1">
            <label for="tag" class="text-muted-color">Tag</label>
            <AutoComplete
              id="tag"
              dropdown
              fluid
              name="tag"
              :suggestions="bookTags"
              @complete="searchTag"
            />
          </FormField>

          <FormField
            v-slot="$field"
            class="flex flex-col gap-1"
            name="category"
          >
            <label for="category" class="text-muted-color">Category *</label>
            <AutoComplete
              id="category"
              name="category"
              :suggestions="store.categories"
              fluid
              option-label="name"
              @complete="searchCategories"
              dropdown
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
            name="language"
          >
            <label class="text-muted-color" for="language">Language *</label>
            <InputText fluid id="language" name="language" />
            <Message
              v-if="$field.invalid"
              severity="error"
              variant="simple"
              size="small"
            >
              {{ $field.error.message }}
            </Message>
          </FormField>

          <div class="flex gap-4">
            <FormField
              v-slot="$field"
              class="flex flex-col gap-1 w-full"
              name="authors"
            >
              <label for="authors" class="text-muted-color">Author *</label>
              <AutoComplete
                id="authors"
                name="authors"
                :suggestions="store.authors"
                fluid
                option-label="name"
                @complete="searchAuthors"
                dropdown
                multiple
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

            <Button
              class="h-fit mt-7"
              aria-label="Add author"
              v-tooltip="'Add author'"
              icon="pi pi-plus"
              @click="authorFormVisibility = true"
              severity="secondary"
            />
          </div>
          <FormField class="flex flex-col gap-1" name="description">
            <label for="description" class="text-muted-color"
              >Description</label
            >
            <Textarea
              id="description"
              name="description"
              class="min-h-56 max-h-[48rem]"
              fluid
            />
          </FormField>

          <div class="flex flex-col gap-4">
            <label for="file" class="text-muted-color">Cover image</label>
            <FileUpload
              id="file"
              mode="basic"
              class="mr-auto"
              name="file"
              ref="uploadFileState"
              accept="image/*"
              :maxFileSize="1000000"
            />
            <Message
              v-if="!!uploadFileState?.files.length"
              severity="warn"
              variant="simple"
            >
              Upload image to add cover
            </Message>
            <ButtonGroup class="flex items-center gap-4">
              <Button
                icon="pi pi-upload"
                :loading="store.uploadLoading"
                severity="secondary"
                label="Upload"
                @click="uploadImageCover"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                :loading="store.deleteLoading"
                @click="deleteImageCover"
                severity="danger"
                outlined
              />
            </ButtonGroup>
          </div>
        </div>
        <Divider />
        <Button class="min-h-max" :loading="store.addLoading" type="submit">
          Add book
        </Button>
      </Form>
    </div>
  </Drawer>
</template>
