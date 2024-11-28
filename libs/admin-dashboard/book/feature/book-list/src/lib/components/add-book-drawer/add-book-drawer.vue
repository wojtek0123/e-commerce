<script setup lang="ts">
import ButtonGroup from 'primevue/buttongroup';
import SelectButton from 'primevue/selectbutton';
import FileUpload, {
  FileUploadRemoveEvent,
  FileUploadSelectEvent,
} from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import AutoComplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import {
  Category,
  BookTag,
  Author,
  allBookTags,
} from '@e-commerce/shared/api-models';
import { ref } from 'vue';

import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { createClient } from '@supabase/supabase-js';
import { Publisher } from '@prisma/client';

const store = useBooksStore();

const title = ref<string | null>(null);
const coverImage = ref<string | null>(null);
const description = ref<string | null>(null);
const language = ref<string | null>(null);
const pages = ref<number | null>(null);
const price = ref<number | null>(null);
const publishDate = ref<Date | null>(null);
const category = ref<Category | null>(null);
const quantity = ref<number | null>(null);
const tag = ref<BookTag | null>(null);
const authors = ref<Author[]>([]);
const publisherName = ref<string | null>(null);
const publisher = ref<Publisher | null>(null);
const file = ref<File | null>(null);

type PublisherOption = 'Add' | 'Select';

const publisherOptions = ref<PublisherOption[]>(['Add', 'Select']);

const publisherInputType = ref<PublisherOption>('Select');

// const publisher = ref<Publisher

const visible = ref(false);

const bookTags = ref(allBookTags);

function searchTag(event: AutoCompleteCompleteEvent) {
  bookTags.value = allBookTags.filter((tag) =>
    tag.toLowerCase().includes(event.query.toLowerCase()),
  );
}

console.log(import.meta.env.VITE_API_SUPABASE_URL);
const supbase = createClient(
  import.meta.env.VITE_API_SUPABASE_URL,
  import.meta.env.VITE_API_SUPABASE_KEY,
  {},
);

function searchCategories(event: AutoCompleteCompleteEvent) {
  store.getCategories(event.query);
}

function searchAuthors(event: AutoCompleteCompleteEvent) {
  store.getAuthors(event.query);
}

function searchPublisher(event: AutoCompleteCompleteEvent) {
  store.getPublishers(event.query);
}

function submit(event: Event) {
  event.preventDefault();
}

function selectImage(event: FileUploadSelectEvent) {
  file.value = event.files[0];
}

async function onCoverUpload() {
  if (!file.value) return;

  const { data, error } = await supbase.storage
    .from('image-covers')
    .upload(`${file.value?.name}`, file.value);

  if (!data?.path) return;

  if (error) {
    console.log(error);
    return;
  }

  const path = `image-cover/${file.value.name}`;

  const { data: response } = supbase.storage
    .from('image-cover')
    .getPublicUrl(path);

  coverImage.value = response.publicUrl;
}

async function onDeleteCover() {
  if (!coverImage.value) return;
  const { data, error } = await supbase.storage
    .from('image-cover')
    .remove([coverImage.value]);

  console.log(data, error);
}

function clearImage() {}

function removeImage(event: FileUploadRemoveEvent) {
  console.log(event.file);
}
</script>

<template>
  <Button @click="visible = true" label="Add" />
  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full">
    <form
      @submit="submit"
      class="flex flex-col h-full justify-between gap-4 w-full max-w-[120rem]"
    >
      <div class="flex flex-col gap-4">
        <FloatLabel variant="in">
          <InputText id="title" v-model="title" />
          <label for="title">Title *</label>
        </FloatLabel>
        <FloatLabel variant="in">
          <InputNumber id="pages" v-model="pages" />
          <label for="pages">Pages *</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputNumber id="price" v-model="price" />
          <label for="price">Price *</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <DatePicker
            id="publish_date"
            name="date"
            fluid
            v-model="publishDate"
          />
          <label for="publish_date">Publish date</label>
        </FloatLabel>

        <SelectButton
          :options="publisherOptions"
          v-model="publisherInputType"
        />

        <FloatLabel v-if="publisherInputType === 'Select'" variant="in">
          <AutoComplete
            id="publishers"
            name="Publisher"
            :suggestions="store.publishers"
            fluid
            v-model="publisher"
            option-label="name"
            @complete="searchPublisher"
            dropdown
          />
          <label for="publishers">Publisher</label>
        </FloatLabel>

        <FloatLabel v-if="publisherInputType === 'Add'" variant="in">
          <InputText id="publisher_name" v-model="publisherName" />
          <label for="publisher_name">Publisher name</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <AutoComplete
            id="tag"
            dropdown
            v-model="tag"
            :suggestions="bookTags"
            @complete="searchTag"
          />
          <label for="tag">Tag</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <AutoComplete
            id="category"
            name="category"
            :suggestions="store.categories"
            fluid
            v-model="category"
            option-label="name"
            @complete="searchCategories"
            dropdown
          />
          <label for="category">Category</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputText id="language" v-model="language" />
          <label for="language">Language</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <AutoComplete
            id="author"
            name="author"
            :suggestions="store.authors"
            fluid
            v-model="authors"
            option-label="name"
            @complete="searchAuthors"
            dropdown
            multiple
          />
          <label for="author">Author</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <Textarea id="description" v-model="description" />
          <label for="description">Description</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputNumber id="quanity" v-model="quantity" />
          <label for="quantity">Quantity</label>
        </FloatLabel>

        <div>
          <FileUpload
            mode="basic"
            name="file"
            ref="file"
            accept="image/*"
            :maxFileSize="1000000"
            @select="selectImage"
            @remove="removeImage"
          />
          <ButtonGroup>
            <Button
              icon="pi pi-upload"
              severity="secondary"
              label="Upload"
              @click="onCoverUpload"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              @click="onDeleteCover"
              severity="danger"
              outlined
            />

            <Button
              label="Clear"
              icon="pi pi-trash"
              severity="danger"
              @click="clearImage"
              outlined
            />
          </ButtonGroup>
        </div>
      </div>
      <Button type="submit">Add book</Button>
    </form>
  </Drawer>
</template>
