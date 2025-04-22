import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { Book } from '@e-commerce/shared/api-models';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useRef, useState } from 'react';

type ChangeQuantityDialogProps = {
  bookId: Book['id'];
  increseQuantity: (by: number) => void;
};

export const ChangeQuantityDialog = ({
  bookId,
  increseQuantity,
}: ChangeQuantityDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
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
      toast.show(
        `Available quanity of this book has been increased by ${quantity}`,
        'success',
      );

      increseQuantity(quantity);

      closeDialog();
    },
    onError(error) {
      toast.show(error.message || 'Something went wrong!', 'error');
    },
  });

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

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
      <button className="btn btn-primary" onClick={openDialog}>
        Change quantity
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box rounded-base flex flex-col gap-8 max-w-[648px]">
          <div className="flex flex-col gap-base">
            <div className="flex items-center">
              <h3 className="text-center text-xl mx-auto">Update quantity</h3>
              <button className="btn btn-ghost seft-end" onClick={closeDialog}>
                <span className="pi pi-times"></span>
              </button>
            </div>
            <div className="w-full h-[1px] bg-neutral-content"></div>
          </div>

          <form
            onSubmit={(event) => changeQuantity(event)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-1">
              <label>How many books arrived?</label>
              <input
                onInput={(event) => onInput(event)}
                className={`input ${error !== null && 'border-error text-error'}`}
                placeholder="Enter number"
                type="number"
              />
              {error && <span className="text-error text-base">{error}</span>}
            </div>

            <button className="btn btn-primary btn-block">
              {isLoading && <span className="loading loading-spinner"></span>}
              <span> Update quantity</span>
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ChangeQuantityDialog;
