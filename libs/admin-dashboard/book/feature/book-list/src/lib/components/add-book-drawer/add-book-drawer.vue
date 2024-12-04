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
import Message from 'primevue/message';
import {
  Category,
  BookTag,
  Author,
  allBookTags,
} from '@e-commerce/shared/api-models';
import { ref } from 'vue';

import { useBooksStore } from '@e-commerce/admin-dashboard/book/data-access';
import { Publisher } from '@prisma/client';
import { onUnmounted } from 'vue';

const store = useBooksStore();

type PublisherOption = 'Add' | 'Select';

const title = ref<string | null>(null);
const description = ref<string | null>(null);
const language = ref<string | null>(null);
const pageCount = ref<number | null>(null);
const price = ref<number | null>(null);
const publishDate = ref<Date | null>(null);
const category = ref<Category | null>(null);
const quantity = ref<number | null>(null);
const tag = ref<BookTag | null>(null);
const authors = ref<Author[]>([]);
const publisherName = ref<string | null>(null);
const publisher = ref<Publisher | null>(null);
const file = ref<File | null>(null);

const publisherOptions = ref<PublisherOption[]>(['Add', 'Select']);
const publisherInputType = ref<PublisherOption>('Select');
const successed = ref(false);
const visible = ref(false);
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

function searchPublisher(event: AutoCompleteCompleteEvent) {
  store.getPublishers(event.query);
}

function selectImage(event: FileUploadSelectEvent) {
  file.value = event.files[0];
}

function removeImage(event: FileUploadRemoveEvent) {
  console.log(event.file);
}

function uploadImageCover() {
  if (!file.value) return;
  store.uploadCoverImage(file.value);
}

function submit(event: Event) {
  event.preventDefault();

  if (!title.value) return;
  if (!language.value) return;
  if (!pageCount.value) return;
  if (!price.value) return;
  if (!quantity.value) return;
  if (!category.value) return;
  if (!publishDate.value) return;

  store
    .addBook({
      title: title.value,
      categoryId: category.value?.id,
      description: description.value ?? '',
      language: language.value,
      pages: pageCount.value,
      price: price.value,
      publishedDate: publishDate.value.toISOString(),
      publisherId: publisher.value?.id,
      quantity: quantity.value,
      ...(tag.value && { tag: tag.value }),
      authorsId: authors.value.map(({ id }) => id),
      publisherName: publisherName.value ?? undefined,
    })
    .then(() => {
      visible.value = false;
      successed.value = true;
    });
}

onUnmounted(() => {
  if (!successed.value) {
    store.deleteUploadedCoverImage();
  }
});
</script>

<template>
  <Button @click="visible = true" label="Add" />
  <Drawer v-model:visible="visible" class="max-w-[40rem] w-full">
    <form
      @submit.prevent="submit"
      class="flex flex-col h-full justify-between gap-4 w-full max-w-[120rem]"
    >
      <div class="flex flex-col gap-4">
        <FloatLabel variant="in">
          <InputText fluid id="title" v-model="title" :invalid="!title" />
          <label for="title">Title *</label>
          <Message v-if="!title" severity="error" variant="simple" size="small">
            Title is required
          </Message>
        </FloatLabel>
        <FloatLabel variant="in">
          <InputNumber
            fluid
            id="pages"
            v-model="pageCount"
            :invalid="!pageCount"
          />
          <label for="pages">Page count *</label>
          <Message
            v-if="!pageCount"
            severity="error"
            variant="simple"
            size="small"
          >
            Page count is required
          </Message>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputNumber fluid id="price" v-model="price" :invalid="!price" />
          <label for="price">Price *</label>
          <Message v-if="!price" severity="error" variant="simple" size="small">
            Price is required
          </Message>
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
          <InputText fluid id="publisher_name" v-model="publisherName" />
          <label for="publisher_name">Publisher name</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <AutoComplete
            id="tag"
            dropdown
            v-model="tag"
            fluid
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
            :invalid="!category"
          />
          <label for="category">Category *</label>
          <Message
            v-if="!category"
            severity="error"
            variant="simple"
            size="small"
          >
            Category is required
          </Message>
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
            :invalid="!authors.length"
          />
          <label for="author">Author *</label>
          <Message
            v-if="!authors.length"
            severity="error"
            variant="simple"
            size="small"
          >
            Choose at least one author
          </Message>
        </FloatLabel>

        <FloatLabel variant="in">
          <Textarea id="description" fluid v-model="description" />
          <label for="description">Description</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputNumber
            id="quanity"
            :invalid="!quantity"
            fluid
            v-model="quantity"
          />
          <label for="quantity">Quantity</label>
          <Message
            v-if="!quantity"
            severity="error"
            variant="simple"
            size="small"
          >
            Quantity is required
          </Message>
        </FloatLabel>

        <div class="flex flex-col gap-4">
          <FileUpload
            mode="basic"
            class="mr-auto"
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
              :loading="store.uploadLoading"
              severity="secondary"
              label="Upload"
              @click="uploadImageCover"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              :loading="store.deleteLoading"
              @click="store.deleteUploadedCoverImage"
              severity="danger"
              outlined
            />
          </ButtonGroup>
        </div>
      </div>
      <Button :loading="store.addLoading" type="submit">Add book</Button>
    </form>
  </Drawer>
</template>
