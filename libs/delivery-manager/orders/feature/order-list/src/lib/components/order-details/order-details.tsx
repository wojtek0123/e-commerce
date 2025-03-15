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
  onStatusChange,
}: {
  orderId: Order['id'] | null;
  dialogRef: React.RefObject<HTMLDialogElement>;
  onStatusChange: (status: OrderStatus) => void;
}) {
  const toast = useToastStore();
  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [label, setLabel] = useState<{
    isGenerated: boolean;
    isPrinted: boolean;
  }>({ isGenerated: false, isPrinted: false });
  const [selectedOrderItems, setSelectedOrderItems] = useState<
    OrderDetailsItem[]
  >([]);
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: order,
  } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await axios.get<Order>(
        `http://localhost:3000/order-details/${orderId}`,
      );

      return data;
    },
    enabled: orderId !== null,
    staleTime: Infinity,
  });
  const mutation = useMutation<
    void,
    Error,
    { orderId: Order['id']; status: OrderStatus }
  >({
    mutationFn: ({ orderId, status }) =>
      axios.post(`http://localhost:3000/order-details/${orderId}`, { status }),
    onSuccess(_, { status }) {
      if (order) {
        const updatedOrder = { ...order, status };
        queryClient.setQueryData(['order', orderId], updatedOrder);
      }
      toast.show(
        `Status has been updated to ${status} for order no. ${orderId}`,
      );

      onStatusChange(status);
    },
    onError() {
      toast.show('Something went wrong!');
    },
  });

  function toggleAllOrderItemsSelection() {
    setSelectedOrderItems((prevState) =>
      prevState.length !== 0 ? [] : (order?.orderItems ?? []),
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
      updatedSelectedOrderItems.length !== order?.orderItems.length &&
      updatedSelectedOrderItems.length !== 0;
  }

  function generateLabel() {
    setLabel((prevState) => ({ ...prevState, isGenerated: true }));
  }

  function printLabel() {
    setLabel((prevState) => ({ ...prevState, isPrinted: true }));
  }

  function markAsPrepareForShipping() {
    setSubmitted(true);

    if (!orderId) return;

    if (
      !label.isPrinted ||
      !label.isGenerated ||
      selectedOrderItems.length !== order?.orderItems.length
    )
      return;

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
    setLabel({ isPrinted: false, isGenerated: false });
    setSubmitted(false);
    setSelectedOrderItems([]);

    if (orderId) {
      mutation.mutate({ orderId, status: OrderStatus.PACKING });
    }
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
      {order.status === OrderStatus.PREPARED_FOR_SHIPPING && (
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
      {order.status === OrderStatus.PACKING && (
        <div className="flex flex-col gap-4 w-full">
          <div className="wrapper flex flex-col gap-base">
            <span className="text-lg font-bold">Shipping method</span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Name
              </span>
              <span className="text-base !text-start">
                {order.shippingMethod.name}
              </span>
            </span>

            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Price
              </span>
              <span className="text-base !text-start">
                {order.shippingMethod.price}
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
                {order.orderAddress.phone}
              </span>
            </span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Name
              </span>
              <span className="text-base flex justify-start">
                {order.orderAddress.firstName}
                {order.orderAddress.lastName}
              </span>
            </span>
            <span className="flex gap-4">
              <span className="text-sm text-muted-color font-semibold min-w-24 text-start">
                Address
              </span>
              <span className="flex flex-col items-start">
                <span className="text-base !text-start">
                  {order.orderAddress.street} {order.orderAddress.homeNumber}
                  {order.orderAddress.houseNumber
                    ? '/ ' + order.orderAddress.houseNumber
                    : ''}
                  , {order.orderAddress.postcode}, {order.orderAddress.city},
                  {order.orderAddress.country.name}
                </span>
              </span>
            </span>

            {label.isGenerated ? (
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
                          selectedOrderItems.length === order.orderItems.length
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
                {order.orderItems?.map((item) => (
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
              selectedOrderItems.length !== order.orderItems.length && (
                <span className="text-error text-base">
                  Not all book are packed
                </span>
              )}

            {submitted && !label.isGenerated && !label.isPrinted && (
              <span className="text-error text-base">
                Order does NOT have a label generated
              </span>
            )}

            {submitted && !label.isPrinted && label.isGenerated && (
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
      {order.status === OrderStatus.SHIPPED && (
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
