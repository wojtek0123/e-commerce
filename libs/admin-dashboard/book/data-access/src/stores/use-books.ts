import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  Author,
  Book,
  BookTag,
  Category,
  Paginated,
} from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';
import { Publisher } from '@prisma/client';
import { supabase } from './supabase';
import { useToast } from 'primevue/usetoast';

export const useBooksStore = defineStore('books', () => {
  const toast = useToast();

  const books = ref<Book[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const addLoading = ref(false);
  const deleteLoading = ref(false);
  const search = ref<string | null>(null);

  const categories = ref<Category[]>([]);
  const authors = ref<Author[]>([]);
  const publishers = ref<Publisher[]>([]);

  const bucket = 'image-covers';

  const coverImageUrl = ref<string>('');
  const uploadLoading = ref<boolean>(false);

  async function getBooks() {
    loading.value = true;
    books.value = [];
    error.value = null;

    try {
      const response = await axios.get<{ items: Book[]; total: number }>(
        `${import.meta.env.VITE_API_URL}/books`,
        { params: { titleLike: search.value ?? '' } },
      );
      books.value = response.data.items;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value =
          e.response?.data?.message ?? 'Error occurred while fetching books';
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  async function addAuthor(body: { name: string }) {
    addLoading.value = true;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/authors`, body);
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while adding book';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function addPublisher(body: { name: string }) {
    addLoading.value = true;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/publishers`, body);
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while adding book';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function addCategory(body: { name: string }) {
    addLoading.value = true;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/categories`, body);
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while adding book';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function addBook(body: {
    title: string;
    description: string;
    language: string;
    pages: number;
    price: number;
    publishedDate?: string;
    publisherId?: Publisher['id'];
    categoryId: Category['id'];
    quantity: number;
    tag?: BookTag;
    authorsId: string[];
    publisherName?: string;
  }) {
    addLoading.value = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/books`,
        {
          ...body,
          coverImage: coverImageUrl.value,
        },
      );

      books.value = [...books.value, response.data];
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while adding book';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function updateBook(
    id: Book['id'],
    body: {
      title: string;
      description: string;
      language: string;
      pages: number;
      price: number;
      publishedDate?: string;
      publisherId?: Publisher['id'];
      categoryId: Category['id'];
      quantity: number;
      tag?: BookTag;
      authorsId: string[];
      publisherName?: string;
      coverImage?: string;
    },
  ) {
    addLoading.value = true;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/books/${id}`,
        {
          ...body,
          coverImage: coverImageUrl.value || body.coverImage,
        },
      );

      books.value = books.value.map((book) =>
        book.id === id ? { ...book, ...response.data } : book,
      );
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ?? 'Error occurred while updating book';
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
      });
    } finally {
      addLoading.value = false;
    }
  }

  async function deleteBook({ id, coverImage }: Book) {
    loading.value = true;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/books/${id}`);

      const coverImagePath = coverImage;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([coverImagePath || '']);

      if (error) {
        return;
      }

      books.value = books.value.filter((book) => book.id !== id);
    } catch (e: unknown) {
      let message: string;
      if (e instanceof AxiosError) {
        message =
          e.response?.data?.message ??
          `Error occurred while deleting the book with id ${id}`;
      } else {
        message = 'An unexpected error occurred';
      }

      toast.add({
        summary: 'Error',
        detail: message,
        severity: 'error',
        life: 5000,
      });
    } finally {
      loading.value = false;
    }
  }

  async function getCategories(search: string | undefined) {
    try {
      const { data } = await axios.get<Paginated<Category>>(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          params: {
            nameLike: search,
          },
        },
      );

      categories.value = data.items;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  async function getAuthors(search: string | undefined) {
    try {
      const response = await axios.get<Author[]>(
        `${import.meta.env.VITE_API_URL}/authors`,
        {
          params: {
            nameLike: search,
          },
        },
      );

      authors.value = response.data;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  async function getPublishers(search: string | undefined) {
    try {
      const response = await axios.get<Publisher[]>(
        `${import.meta.env.VITE_API_URL}/publishers`,
        { params: { nameLike: search } },
      );

      publishers.value = response.data;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  async function uploadCoverImage(image: File) {
    if (deleteLoading.value) return;

    uploadLoading.value = true;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${image.name}`, image, { upsert: true });

    if (error) {
      uploadLoading.value = false;
      toast.add({
        summary: 'Error',
        detail: error.message ?? 'Error occurred while uploading image',
        severity: 'error',
      });
      return;
    }

    const { data: response, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 50, {
        transform: { width: 280, height: 384 },
      });

    if (signedUrlError) {
      uploadLoading.value = false;
      toast.add({
        summary: 'Error',
        detail:
          signedUrlError.message ??
          'Error occurred while creating a url to view image',
        severity: 'success',
      });
      return;
    }

    toast.add({
      summary: 'Success',
      detail: 'Uploaded image and generated url to view image',
      severity: 'success',
    });
    coverImageUrl.value = response.signedUrl;
    uploadLoading.value = false;
  }

  async function deleteUploadedCoverImage() {
    if (uploadLoading.value) return;

    deleteLoading.value = true;

    const { error, data } = await supabase.storage
      .from(bucket)
      .remove([coverImageUrl.value]);

    if (error) {
      deleteLoading.value = false;
      toast.add({
        summary: 'Error',
        detail: error.message ?? 'Error occurred while deleting the image',
        severity: 'success',
      });
      return;
    }

    if (!data) return;

    coverImageUrl.value = '';

    deleteLoading.value = false;
    toast.add({
      summary: 'Success',
      detail: 'Image has been deleted',
      severity: 'success',
    });
  }

  return {
    books,
    loading,
    search,
    error,
    getBooks,
    addAuthor,
    addBook,
    getCategories,
    categories,
    getAuthors,
    authors,
    getPublishers,
    publishers,
    uploadCoverImage,
    uploadLoading,
    deleteUploadedCoverImage,
    addLoading,
    deleteLoading,
    deleteBook,
    addPublisher,
    addCategory,
    updateBook,
  };
});
