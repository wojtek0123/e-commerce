import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Category } from '@e-commerce/shared/api-models';

type AddCategoryBody = {
  name: string;
};

export default function AddBookDialogCategoryForm({
  onClose,
}: {
  onClose: (category?: Category) => void;
}) {
  const toast = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const { mutate, isLoading } = useMutation<Category, Error, AddCategoryBody>({
    mutationFn: (body) =>
      axios
        .post(`${import.meta.env.VITE_API_URL}/categories`, body)
        .then(({ data }) => data),
    onSuccess(category) {
      toast.show({
        detail: 'Book has been added',
        summary: 'Success',
        severity: 'success',
      });
      onClose(category);
    },
  });

  const onAddCategory: SubmitHandler<{ name: string }> = (state) => {
    const formErrors = Object.values(errors);

    if (formErrors.some((e) => !!e)) return;

    mutate({ name: state.name });
  };

  return (
    <form
      className="rounded-base flex flex-col gap-8 w-full max-w-[648px]"
      onSubmit={handleSubmit(onAddCategory)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name">What is the category name?</label>
        <InputText
          {...register('name', { required: true })}
          placeholder="Enter name"
          id="name"
          invalid={!!errors.name}
        />
        {errors.name && (
          <span className="text-red-300 text-base">Name is required</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-base mt-4">
        <Button
          outlined
          type="button"
          label="Cancel"
          onClick={() => onClose()}
        />
        <Button label="Add category" type="submit" loading={isLoading} />
      </div>
    </form>
  );
}
