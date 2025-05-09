import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Publisher } from '@e-commerce/shared/api-models';

type AddPublisherBody = {
  name: string;
};

export default function AddBookDialogPublisherForm({
  onClose,
}: {
  onClose: (publisher?: Publisher) => void;
}) {
  const toast = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const { mutate, isLoading } = useMutation<Publisher, Error, AddPublisherBody>(
    {
      mutationFn: (body) =>
        axios
          .post(`${import.meta.env.VITE_API_URL}/publishers`, body)
          .then(({ data }) => data),
      onSuccess(publisher) {
        toast.show({
          detail: 'Publisher has been added',
          summary: 'Success',
          severity: 'success',
        });
        onClose(publisher);
      },
    },
  );

  const { data: publishers } = useQuery<Publisher[]>({
    queryKey: ['publishers'],
    queryFn: async () => {
      const response = await axios.get<Publisher[]>(
        `${import.meta.env.VITE_API_URL}/publishers`,
      );

      return response.data;
    },
  });

  const onAddPublisher: SubmitHandler<{ name: string }> = (state) => {
    const formErrors = Object.values(errors);

    if (formErrors.some((e) => !!e)) return;

    mutate({ name: state.name });
  };

  return (
    <form
      className="rounded-base flex flex-col gap-8 w-full max-w-[648px]"
      onSubmit={handleSubmit(onAddPublisher)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name">What is the publisher name?</label>
        <InputText
          {...register('name', {
            required: true,
            validate: (value) =>
              publishers?.findIndex((c) =>
                c.name.toLowerCase().localeCompare(value.toLowerCase()),
              ) !== -1,
          })}
          placeholder="Enter name"
          id="name"
          invalid={!!errors.name}
        />
        {errors.name?.type === 'required' && (
          <span className="text-red-300 text-base">Name is required</span>
        )}
        {errors.name?.type === 'validate' && (
          <span className="text-red-300 text-base">
            This publishers is already added
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-base mt-4">
        <Button
          outlined
          type="button"
          label="Cancel"
          onClick={() => onClose()}
        />
        <Button label="Add publisher" type="submit" loading={isLoading} />
      </div>
    </form>
  );
}
