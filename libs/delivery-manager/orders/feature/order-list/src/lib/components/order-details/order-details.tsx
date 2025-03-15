import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  OrderDetails as Order,
  OrderDetailsItem,
} from '@e-commerce/shared/api-models';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';

export function OrderDetails({
  orderId,
  dialogRef,
}: {
  orderId: Order['id'] | null;
  dialogRef: React.RefObject<HTMLDialogElement>;
}) {
  const toast = useToastStore();
  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hasLabel, setHasLabel] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<
    OrderDetailsItem[]
  >([]);
  const queryClient = useQueryClient();
  const { isLoading, isError, data, refetch } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await axios.get<Order>(
        `http://localhost:3000/order-details/${orderId}`,
      );

      return data;
    },
    staleTime: Infinity,
    enabled: orderId !== null,
  });
  const mutation = useMutation<
    void,
    Error,
    { orderId: Order['id']; status: OrderStatus }
  >({
    mutationFn: ({ orderId, status }) =>
      axios.post(`http://localhost:3000/order-details/${orderId}`, { status }),
    onSuccess(_, { status }) {
      if (data) {
        const updatedData = { ...data, status };
        queryClient.setQueryData(['order', orderId], updatedData);
      }
      toast.show(
        `Status has been updated to ${status} for order no. ${orderId}`,
      );
    },
    onError() {
      toast.show('Something went wrong!');
      // On error, refetch to ensure data consistency
      refetch();
    },
  });

  function toggleAllOrderItemsSelection() {
    setSelectedOrderItems((prevState) =>
      prevState.length !== 0 ? [] : (data?.orderItems ?? []),
    );
  }

  function toggleOrderItemSelection(orderItem: OrderDetailsItem) {
    const isSelected = selectedOrderItems.find(({ id }) => id === orderItem.id);

    const updatedSelectedOrderItems = isSelected
      ? selectedOrderItems.filter(({ id }) => id !== orderItem.id)
      : [...selectedOrderItems, orderItem];

    setSelectedOrderItems(updatedSelectedOrderItems);

    if (!selectAllCheckboxRef.current) return;

    selectAllCheckboxRef.current.indeterminate =
      updatedSelectedOrderItems.length !== data?.orderItems.length &&
      updatedSelectedOrderItems.length !== 0;
  }

  function generateLabel() {
    setHasLabel(true);
  }

  function printLabel() {
    console.log('Label has been printed');
  }

  function markAsPrepareForShipping() {
    setSubmitted(true);

    if (!orderId) return;

    mutation.mutate({ orderId, status: OrderStatus.PREPARED_FOR_SHIPPING });
  }

  function close() {
    dialogRef.current?.close();
  }

  function markAsShipped() {
    if (!orderId) return;

    mutation.mutate({ orderId, status: OrderStatus.SHIPPED });
  }

  useEffect(() => {
    setHasLabel(false);
    setSubmitted(false);
    setSelectedOrderItems([]);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-base">
        <div className="skeleton h-32 w-full rounded-base"></div>
        <div className="skeleton h-32 w-full rounded-base"></div>
        <div className="skeleton h-32 w-full rounded-base"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong! Try later!</div>;
  }

  return (
    <>
      {data.status === OrderStatus.PREPARED_FOR_SHIPPING && (
        <div className="flex flex-col gap-base">
          <p className="text-center">
            Once you hand over the package to the courier, you can mark this
            order as 'Shipped' in the system.
          </p>

          <button
            className="btn btn-secondary max-w-[50%] min-w-fit w-full mx-auto"
            onClick={markAsShipped}
          >
            Mark as shipped
          </button>
        </div>
      )}
      {data.status === OrderStatus.PACKING && (
        <div className="flex flex-col gap-4 w-full">
          <div className="wrapper flex flex-col gap-base">
            <span className="text-lg font-bold">Shipping method</span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Name
              </span>
              <span className="text-base !text-start">
                {data.shippingMethod.name}
              </span>
            </span>

            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Price
              </span>
              <span className="text-base !text-start">
                {data.shippingMethod.price}
              </span>
            </span>
          </div>

          <div className="wrapper flex flex-col items-start !justify-start gap-4 pr-14">
            <span className="text-lg font-bold">Order address</span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Phone
              </span>
              <span className="text-base !text-start">
                {data.orderAddress.phone}
              </span>
            </span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Name
              </span>
              <span className="text-base flex justify-start">
                {data.orderAddress.firstName}
                {data.orderAddress.lastName}
              </span>
            </span>
            <span className="flex gap-4">
              <span className="text-sm text-muted-color font-semibold min-w-24 text-start">
                Address
              </span>
              <span className="flex flex-col items-start">
                <span className="text-base !text-start">
                  {data.orderAddress.street} {data.orderAddress.homeNumber}
                  {data.orderAddress.houseNumber
                    ? '/ ' + data.orderAddress.houseNumber
                    : ''}
                  , {data.orderAddress.postcode}, {data.orderAddress.city},
                  {data.orderAddress.country.name}
                </span>
              </span>
            </span>

            {hasLabel ? (
              <button
                className="btn btn-secondary max-w-[50%] min-w-fit w-full mx-auto"
                onClick={printLabel}
              >
                Print label
              </button>
            ) : (
              <button
                className="btn btn-secondary max-w-[50%] min-w-fit w-full mx-auto"
                onClick={generateLabel}
              >
                Generate label
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-box wrapper">
            <span className="text-lg font-bold">Books to packed</span>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        ref={selectAllCheckboxRef}
                        checked={
                          selectedOrderItems.length === data.orderItems.length
                        }
                        onChange={toggleAllOrderItemsSelection}
                      />
                    </label>
                  </th>
                  <th>Image</th>
                  <th>Authors</th>
                  <th>Favorite Color</th>
                </tr>
              </thead>
              <tbody>
                {data.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={() => toggleOrderItemSelection(item)}
                          checked={
                            !!selectedOrderItems.find(
                              ({ id }) => id === item.id,
                            )
                          }
                        />
                      </label>
                    </th>
                    <td>
                      <img
                        className="max-h-48"
                        src={item.book.coverImage}
                        alt={item.book.title + ' cover image'}
                      />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {item.book.authors?.map((author) => (
                          <span key={crypto.randomUUID()}>{author.name}</span>
                        ))}
                      </div>
                    </td>
                    <td>Blue</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-center items-center gap-base">
            {submitted &&
              selectedOrderItems.length !== data.orderItems.length && (
                <span className="text-error text-base">
                  Not all book are packed
                </span>
              )}

            {submitted && !hasLabel && (
              <span className="text-error text-base">
                Order does NOT have a label generated
              </span>
            )}

            <button
              className="btn btn-primary max-w-[50%] min-w-fit w-full"
              onClick={markAsPrepareForShipping}
            >
              Mark as packed
            </button>
          </div>
        </div>
      )}
      {data.status === OrderStatus.SHIPPED && (
        <div className="flex flex-col gap-base">
          <div className="text-center">Delivery process is finished!</div>
          <button
            className="btn btn-secondary max-w-[50%] min-w-fit w-full mx-auto"
            onClick={close}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default OrderDetails;
