<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import FileUpload, { FileUploadUploadEvent } from 'primevue/fileupload';
import Drawer from 'primevue/drawer';
import Textarea from 'primevue/textarea';
import AutoComplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import {
  Category,
  BookTag,
  Author,
  allBookTags,
} from '@e-commerce/shared/api-models';
import { ref } from 'vue';

import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';

const store = useBooksStore();

const title = ref<string | null>(null);
const coverImage = ref<File | null>(null);
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

const visible = ref(false);
// const publisher = ref<Publisher

const bookTags = ref(allBookTags);

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

function submit(event: Event) {
  event.preventDefault();
}

function onCoverUpload(event: FileUploadUploadEvent) {
  console.log(event.files);
}
</script>

<template>
  <Button @click="visible = true" label="Add" />
  <Drawer
    class="max-w-[40rem] w-full"
    v-model:visible="visible"
    header="Add book form"
  >
    <form @submit="submit" class="flex flex-col gap-4 w-full max-w-[120rem]">
      <FloatLabel variant="in">
        <InputText id="title" v-model="title" fluid />
        <label for="title">Title *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <InputNumber id="quanity" v-model="quantity" fluid />
        <label for="quantity">Quantity *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <InputNumber id="pages" v-model="pages" fluid />
        <label for="pages">Pages *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <InputNumber id="price" v-model="price" fluid />
        <label for="price">Price *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <InputText id="language" v-model="language" fluid />
        <label for="language">Language *</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <DatePicker id="publish_date" name="date" fluid v-model="publishDate" />
        <label for="publish_date">Publish date</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <InputText id="publisher_name" v-model="publisherName" fluid />
        <label for="publisher_name">Publisher name</label>
      </FloatLabel>

      <FloatLabel variant="in">
        <AutoComplete
          fluid
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
        <label for="category">Category *</label>
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
        <Textarea id="description" v-model="description" fluid />
        <label for="description">Description</label>
      </FloatLabel>

      <FileUpload
        ref="fileupload"
        mode="basic"
        name="demo[]"
        accept="image/*"
        :maxFileSize="1000000"
        @upload="onCoverUpload"
      />

      <Button type="submit">Add book</Button>
    </form>
  </Drawer>
</template>
