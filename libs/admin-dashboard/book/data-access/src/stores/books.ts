import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Book } from '@e-commerce/shared/api-models';

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getBooks() {
    loading.value = true;

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'get',
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(data);
      }

      books.value = data.items;
    } catch (error) {
      // error.value = error?.['error']?.message;
    } finally {
      loading.value = false;
    }
  }

  return { books, loading, error, getBooks };
});
