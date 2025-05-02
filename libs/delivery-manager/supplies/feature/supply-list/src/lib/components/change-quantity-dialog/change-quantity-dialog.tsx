import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { Book } from '@e-commerce/shared/api-models';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

type ChangeQuantityDialogProps = {
  bookId: Book['id'];
  increseQuantity: (by: number) => void;
};

export const ChangeQuantityDialog = ({
  bookId,
  increseQuantity,
}: ChangeQuantityDialogProps) => {
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const toast = useToastStore();
  const { mutate, isLoading } = useMutation<
    void,
    Error,
    { bookId: Book['id']; quantity: number }
  >({
    mutationFn: ({ bookId, quantity }) =>
      axios.post(`${import.meta.env.VITE_API_URL}/inventories/${bookId}`, {
        quantity,
      }),
    onSuccess(_, { quantity }) {
      toast.show({
        severity: 'success',
        detail: `Available quanity of this book has been increased by ${quantity}`,
        summary: 'Success',
      });

      increseQuantity(quantity);

      setIsDialogVisible(false);
    },
    onError(error) {
      toast.show({
        detail: error.message || 'Something went wrong!',
        summary: 'Error',
        severity: 'error',
      });
    },
  });

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const quantity = Number((event.target as HTMLInputElement).value);

    if (quantity <= 0) {
      setError('The quantity must be at least 1.');
      return;
    }

    if (!Number.isInteger(quantity)) {
      setError('You should enter integer number.');
      return;
    }

    setError(null);
    setQuantity(quantity);
  };

  const changeQuantity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error || quantity === null) return;

    mutate({ bookId, quantity });
  };

  return (
    <>
      <Button
        className="btn btn-primary h-fit"
        onClick={() => setIsDialogVisible(true)}
        text={true}
        icon="pi pi-pencil"
        title="Update quantity"
      />

      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header="Update quantity"
        className="max-w-[648px] w-full"
      >
        <form
          onSubmit={(event) => changeQuantity(event)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-1">
            <label>How many books arrived?</label>
            <InputText
              onInput={(event) => onInput(event)}
              className={`input ${error !== null && 'border-error text-error'}`}
              placeholder="Enter number"
              type="number"
            />
            {error && <span className="text-error text-base">{error}</span>}
          </div>

          <Button loading={isLoading} label="Update quantity" />
        </form>
      </Dialog>
    </>
  );
};

export default ChangeQuantityDialog;
