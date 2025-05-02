import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import {
  Author,
  BookTag,
  Category,
  Inventory,
} from '@e-commerce/shared/api-models';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'cally';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { InputTextarea } from 'primereact/inputtextarea';
import { useSuppliesStore } from '@e-commerce/delivery-manager/supplies/data-access';
import { useForm, SubmitHandler } from 'react-hook-form';

type AddInventoryForm = {
  title: string;
  price: number;
  pageCount: number;
  coverImage: string;
  language: string;
  pages: number;
  publishedDate: Nullable<Date>;
  publisherId: string;
  category: Category;
  quantity: number;
  tag: BookTag;
  authors: Author[];
};

export const AddBookDialog = () => {
  const toast = useToastStore();
  const suppliesStore = useSuppliesStore();
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [authorSearchText, setAuthorSearchText] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddInventoryForm>();

  const [tags] = useState<BookTag[]>([
    BookTag.NEW,
    BookTag.DISCOUNT,
    BookTag.INCOMING,
    BookTag.BESTSELLER,
    BookTag.PREMIERE_OF_THE_MONTH,
  ]);
  const [filteredTags, setFilteredTags] = useState<BookTag[]>([
    BookTag.NEW,
    BookTag.DISCOUNT,
    BookTag.INCOMING,
    BookTag.BESTSELLER,
    BookTag.PREMIERE_OF_THE_MONTH,
  ]);
  const [selectedTag, setSelectedTag] = useState<BookTag | null>(null);

  const { mutate } = useMutation<void, Error, AddInventoryForm>({
    mutationFn: () => axios.post(`${import.meta.env.VITE_API_URL}/inventories`),
  });

  const { data } = useQuery<Author[]>({
    queryKey: [authorSearchText],
    queryFn: async () => {
      const response = await axios.get<Author[]>(
        `${import.meta.env.VITE_API_URL}/authors`,
        {
          params: { nameLike: authorSearchText },
        },
      );

      setFilteredAuthors(response.data);
      return response.data;
    },
    enabled: isDialogVisible,
  });

  useEffect(() => {
    // Workaround to fix the autocomplete searching
    setAuthors(data ?? []);
    setFilteredAuthors(data ?? []);
  }, [data]);

  const searchAuthor = (event: AutoCompleteCompleteEvent) => {
    setFilteredAuthors(
      authors.filter((author) =>
        author.name.toLowerCase().includes(event.query.toLowerCase().trim()),
      ),
    );
  };

  const searchTag = (event: AutoCompleteCompleteEvent) => {
    setFilteredTags(
      tags.filter((tag) =>
        tag.toLowerCase().includes(event.query.toLowerCase().trim()),
      ) ?? [],
    );
  };

  const updateAddInventoryForm = (form: AddInventoryForm) => {
    suppliesStore.modifyAddInventoryForm(form);
  };

  const onSubmit: SubmitHandler<AddInventoryForm> = (state) => {
    console.log(state);
    // mutation.mutate({ email, password });

    mutate({ ...state });
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <Button
        className="btn btn-primary h-fit min-w-max"
        onClick={() => setIsDialogVisible(true)}
        label="Add book"
      />

      <Dialog
        visible={isDialogVisible}
        header="Add book"
        onHide={() => setIsDialogVisible(false)}
        className="max-w-[648px] w-full"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-base flex flex-col gap-8 w-full max-w-[648px]"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title">What is the book title?</label>
            <InputText
              type="text"
              id="title"
              placeholder="Type title"
              invalid={!!errors.title}
              {...register('title', { required: true })}
            />
            {errors.title && (
              <span className="text-red-300 text-base">Title is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="price">What is the book price?</label>
            <InputText
              {...(register('price'), { min: 0, required: true })}
              type="number"
              placeholder="Type price"
            />

            {errors.price && (
              <span className="text-red-300 text-base">Price is required</span>
            )}
            {errors.price?.type === 'required' && (
              <span className="text-red-300 text-base">Price is required</span>
            )}
            {errors.price?.type === 'min' && (
              <span className="text-red-300 text-base">
                Price should be at least 0
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="page">How many pages?</label>
            <InputText
              type="number"
              {...register('pages', { required: true, min: 0 })}
              id="page"
              placeholder="Type page"
            />
            {errors.pages && (
              <span className="text-red-300 text-base">Pages is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="author">What are the authors?</label>
            <AutoComplete
              inputId="author"
              value={selectedAuthor}
              className="w-full"
              field="name"
              suggestions={filteredAuthors}
              completeMethod={searchAuthor}
              multiple
              onChange={(e) => setSelectedAuthor(e.value)}
              dropdown
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="published">
              When the book was or will be published
            </label>
            <Calendar
              inputId="published"
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="publisher">What is the publisher?</label>
            <InputText id="publisher" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category">What is the category?</label>
            <InputText
              type="text"
              id="category"
              className="input"
              placeholder="Type category"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tag">What is the tag?</label>
            <AutoComplete
              id="tag"
              placeholder="Select tag"
              value={selectedTag}
              completeMethod={searchTag}
              suggestions={filteredTags}
              onChange={(e) => setSelectedTag(e.value)}
              dropdown
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tag">What is the tag?</label>
            <InputTextarea value="" />
          </div>

          <div className="grid grid-cols-2 gap-base mt-4">
            <Button
              outlined
              type="button"
              severity="secondary"
              label="Cancel"
              onClick={() => setIsDialogVisible(false)}
            />
            <Button
              type="submit"
              severity="secondary"
              label="Add book"
              onClick={(e) => handleSubmit(e)}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default AddBookDialog;
