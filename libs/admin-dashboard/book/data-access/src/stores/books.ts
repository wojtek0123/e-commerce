import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Author, Book, Category } from '@e-commerce/shared/api-models';
import axios, { AxiosError } from 'axios';
import { Publisher } from '@prisma/client';

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const categories = ref<Category[]>([]);
  const authors = ref<Author[]>([]);
  const publishers = ref<Publisher[]>([]);

  async function getBooks() {
    loading.value = true;

    try {
      const response = await axios.get<{ items: Book[]; total: number }>(
        'http://localhost:3000/books',
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

  async function getCategories(search: string | undefined) {
    try {
      const response = await axios.get<Category[]>(
        `http://localhost:3000/categories`,
        {
          params: {
            titleLike: search,
          },
        },
      );

      categories.value = response.data;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  async function getAuthors(search: string | undefined) {
    try {
      const response = await axios.get<Author[]>(
        'http://localhost:3000/authors',
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
        'http://localhost:3000/publishers',
        { params: { nameLike: search } },
      );

      publishers.value = response.data;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  return {
    books,
    loading,
    error,
    getBooks,
    getCategories,
    categories,
    getAuthors,
    authors,
    getPublishers,
    publishers,
  };
});
