import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import {
  Author,
  BookTag,
  Publisher,
  Category,
  Inventory,
  Paginated,
} from '@e-commerce/shared/api-models';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
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
import {
  supabase,
  useSuppliesStore,
} from '@e-commerce/delivery-manager/supplies/data-access';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { format } from 'path';

type AddInventoryForm = {
  title: string;
  price: number;
  pageCount: number;
  authors: Author[];
  quantity: number;
  publishedDate: Date;
  publisher: Publisher;
  category: Category;
  tag: BookTag;
  description: string;
  language: string;
};

type AddInventoryBody = {
  title: string;
  coverImage?: string;
  description: string;
  language: string;
  pages: number;
  price: number;
  publishedDate: string;
  publisherId: Publisher['id'];
  categoryId: Category['id'];
  quantity: number;
  tag?: BookTag;
  authorsId: Author['id'][];
};

export const AddBookDialog = () => {
  const toast = useToastStore();
  const suppliesStore = useSuppliesStore();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [imageCoverUrl, setImageCoverUrl] = useState<string | null>(null);

  const [filterdPublishers, setFilteredPublishers] = useState<Publisher[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  const { mutate, isLoading } = useMutation<void, Error, AddInventoryBody>({
    mutationFn: (body) =>
      axios.post(`${import.meta.env.VITE_API_URL}/inventories`, body),
    onSuccess() {
      toast.show({
        detail: 'Book has been added',
        summary: 'Success',
        severity: 'success',
      });
      setIsDialogVisible(false);
    },
  });

  const { data: authors } = useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: async () => {
      const response = await axios.get<Author[]>(
        `${import.meta.env.VITE_API_URL}/authors`,
      );

      setFilteredAuthors(response.data);

      return response.data;
    },
    enabled: isDialogVisible,
  });

  const { data: publishers } = useQuery<Publisher[]>({
    queryKey: ['publishers'],
    queryFn: async () => {
      const response = await axios.get<Publisher[]>(
        `${import.meta.env.VITE_API_URL}/publishers`,
      );

      setFilteredPublishers(response.data);

      return response.data;
    },
    enabled: isDialogVisible,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<Paginated<Category>>(
        `${import.meta.env.VITE_API_URL}/categories`,
      );

      setFilteredCategories(response.data.items);

      return response.data.items;
    },
    enabled: isDialogVisible,
  });

  const uploadImageCover = async ({ files }: FileUploadHandlerEvent) => {
    if (files.length > 1) return;

    const file = files.at(0);

    if (!file) return;

    const { data, error } = await supabase.storage
      .from('image-covers')
      .upload(`${file.name}`, file, { upsert: true });

    if (error) {
      // uploadLoading.value = false;
      toast.show({
        summary: 'Error',
        detail: error.message ?? 'Error occurred while uploading image',
        severity: 'error',
      });
      return;
    }

    const { data: response, error: signedUrlError } = await supabase.storage
      .from('image-covers')
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 50, {
        transform: { width: 280, height: 384 },
      });

    if (signedUrlError) {
      // uploadLoading.value = false;
      toast.show({
        summary: 'Error',
        detail:
          signedUrlError.message ??
          'Error occurred while creating a url to view image',
        severity: 'success',
      });
      return;
    }

    toast.show({
      summary: 'Success',
      detail: 'Uploaded image and generated url to view image',
      severity: 'success',
    });

    console.log(response);
    setImageCoverUrl(response.signedUrl);
  };

  const searchAuthor = (event: AutoCompleteCompleteEvent) => {
    setFilteredAuthors(
      authors?.filter((author) =>
        author.name.toLowerCase().includes(event.query.toLowerCase().trim()),
      ) ?? [],
    );
  };

  const searchTag = (event: AutoCompleteCompleteEvent) => {
    setFilteredTags(
      tags.filter((tag) =>
        tag.toLowerCase().includes(event.query.toLowerCase().trim()),
      ) ?? [],
    );
  };

  const searchPublisher = (event: AutoCompleteCompleteEvent) => {
    setFilteredPublishers(
      publishers?.filter((publisher) =>
        publisher.name.toLowerCase().includes(event.query.toLowerCase().trim()),
      ) ?? [],
    );
  };

  const searchCategory = (event: AutoCompleteCompleteEvent) => {
    setFilteredCategories(
      categories?.filter((category) =>
        category.name.toLowerCase().includes(event.query.toLowerCase().trim()),
      ) ?? [],
    );
  };

  const updateAddInventoryForm = (form: AddInventoryForm) => {
    suppliesStore.modifyAddInventoryForm(form);
  };

  const onSubmit: SubmitHandler<AddInventoryForm> = (state) => {
    console.log(state);

    mutate({
      title: state.title,
      coverImage: imageCoverUrl ?? undefined,
      description: state.description,
      language: state.language,
      pages: +state.pageCount,
      price: +state.price,
      publishedDate: state.publishedDate.toISOString(),
      publisherId: state.publisher.id,
      categoryId: state.category.id,
      quantity: +state.quantity,
      tag: state.tag,
      authorsId: state.authors.map(({ id }) => id),
    });
  };

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
              placeholder="Enter title"
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
              type="number"
              invalid={!!errors.price}
              {...register('price', { required: true, min: 0 })}
              placeholder="Enter price"
            />

            {errors.price?.type === 'required' && (
              <span className="text-red-300 text-base">Price is required</span>
            )}
            {errors.price?.type === 'min' && (
              <span className="text-red-300 text-base">Min price is 0</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="page">How many pages?</label>
            <InputText
              type="number"
              id="page"
              invalid={!!errors.pageCount}
              {...register('pageCount', { required: true, min: 1 })}
              placeholder="Enter page"
            />

            {errors.pageCount?.type === 'required' && (
              <span className="text-red-300 text-base">
                Page count is required
              </span>
            )}
            {errors.pageCount?.type === 'min' && (
              <span className="text-red-300 text-base">
                Min page count is 1
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="page">How many books will be available?</label>
            <InputText
              type="number"
              id="page"
              invalid={!!errors.quantity}
              {...register('quantity', { required: true, min: 0 })}
              placeholder="Enter quantity"
            />

            {errors.quantity?.type === 'required' && (
              <span className="text-red-300 text-base">
                Quantity count is required
              </span>
            )}
            {errors.quantity?.type === 'min' && (
              <span className="text-red-300 text-base">
                Min quantity count is 0
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="language">What is the book language?</label>
            <InputText
              type="text"
              id="language"
              placeholder="Enter language"
              invalid={!!errors.language}
              {...register('language', { required: true })}
            />
            {errors.title && (
              <span className="text-red-300 text-base">
                Language is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="author">What are the authors?</label>
            <Controller
              name="authors"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  invalid={!!errors.authors}
                  field="name"
                  placeholder="Select authors"
                  showEmptyMessage={true}
                  pt={{ container: { className: 'w-full' } }}
                  suggestions={filteredAuthors}
                  completeMethod={searchAuthor}
                  multiple
                  onChange={(e) => field.onChange(e.value)}
                  dropdown
                />
              )}
            />

            {errors.authors?.type === 'required' && (
              <span className="text-red-300 text-base">
                Select at least one author
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="published">
              When the book was or will be published
            </label>
            <Controller
              name="publishedDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  id={field.name}
                  inputId="published"
                  placeholder="Select published date"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  showIcon
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="publisher">What is the publisher?</label>
            <Controller
              name="publisher"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AutoComplete
                  id="publisher"
                  inputId={field.name}
                  value={field.value}
                  invalid={!!errors.publisher}
                  showEmptyMessage={true}
                  field="name"
                  placeholder="Select publisher"
                  pt={{ container: { className: 'w-full' } }}
                  suggestions={filterdPublishers}
                  completeMethod={searchPublisher}
                  onChange={(e) => field.onChange(e.value)}
                  dropdown
                />
              )}
            />

            {errors.publisher?.type === 'required' && (
              <span className="text-red-300 text-base">
                Publisher is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="category">What is the category?</label>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AutoComplete
                  id="publisher"
                  inputId={field.name}
                  value={field.value}
                  invalid={!!errors.category}
                  showEmptyMessage={true}
                  placeholder="Select category"
                  field="name"
                  pt={{ container: { className: 'w-full' } }}
                  suggestions={filteredCategories}
                  completeMethod={searchCategory}
                  onChange={(e) => field.onChange(e.value)}
                  dropdown
                />
              )}
            />

            {errors.category?.type === 'required' && (
              <span className="text-red-300 text-base">
                Category is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tag">What is the tag?</label>
            <Controller
              name="tag"
              control={control}
              render={({ field }) => (
                <AutoComplete
                  id="tag"
                  inputId={field.name}
                  value={field.value}
                  showEmptyMessage={true}
                  placeholder="Select tag"
                  invalid={!!errors.tag}
                  pt={{ container: { className: 'w-full' } }}
                  suggestions={filteredTags}
                  completeMethod={searchTag}
                  onChange={(e) => field.onChange(e.value)}
                  dropdown
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tag">How the cover looks like?</label>
            <FileUpload
              id="file"
              mode="basic"
              className="mr-auto"
              name="file"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              uploadHandler={uploadImageCover}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">What is the description?</label>
            <InputTextarea
              id="description"
              {...register('description')}
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-base mt-4">
            <Button
              outlined
              type="button"
              label="Cancel"
              onClick={() => setIsDialogVisible(false)}
            />
            <Button type="submit" label="Add book" loading={isLoading} />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default AddBookDialog;
