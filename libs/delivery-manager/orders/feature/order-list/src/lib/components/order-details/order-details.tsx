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
  const [orderSteps] = useState<OrderStatus[]>([
    'NEW',
    'PACKING',
    'PREPARED_FOR_SHIPPING',
    'SHIPPED',
  ]);
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
        `${import.meta.env.VITE_API_URL}/order-details/${orderId}`,
      );

      return data;
    },
    enabled: orderId !== null,
    staleTime: Infinity,
  });

  const { mutate, isLoading: isUpdating } = useMutation<
    void,
    Error,
    { orderId: Order['id']; status: OrderStatus }
  >({
    mutationFn: ({ orderId, status }) =>
      axios.post(`${import.meta.env.VITE_API_URL}/order-details/${orderId}`, {
        status,
      }),
    onSuccess(_, { status }) {
      if (order) {
        const updatedOrder = { ...order, status };
        queryClient.setQueryData(['order', orderId], { updatedOrder });
      }
      toast.show(
        `Status has been updated to ${status} for order no. ${orderId}`,
        'success',
      );

      onStatusChange(status);
    },
    onError() {
      toast.show('Something went wrong!', 'error');
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

    toast.show('Label has been generated', 'success');
  }

  function printLabel() {
    setLabel((prevState) => ({ ...prevState, isPrinted: true }));

    toast.show('Label has been printed', 'success');
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

    mutate({ orderId, status: 'PREPARED_FOR_SHIPPING' });
  }

  function close() {
    dialogRef.current?.close();
  }

  function markAsShipped() {
    if (!orderId) return;

    mutate({ orderId, status: 'SHIPPED' });
  }

  function markAsPacking() {
    if (!orderId) return;

    mutate({ orderId, status: 'PACKING' });
  }

  useEffect(() => {
    setLabel({ isPrinted: false, isGenerated: false });
    setSubmitted(false);
    setSelectedOrderItems([]);
  }, [orderId]);

  if (isLoading || isUpdating) {
    return (
      <div className="flex flex-col gap-base">
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong! Try later!</div>;
  }

  return (
    <>
      <ul className="steps">
        {orderSteps.map((step) => (
          <li
            key={step}
            className={`step ${
              step === order.status ? 'step-primary' : ''
            } ${orderSteps.indexOf(step) < orderSteps.indexOf(order.status) ? '' : 'disabled'}`}
          >
            {step.replaceAll('_', ' ')}
          </li>
        ))}
      </ul>

      {order.status === 'NEW' && (
        <div className="flex flex-col gap-8">
          <p className="text-center text-xl">Order is ready to be packed</p>

          <button
            className="btn btn-primary max-w-[50%] min-w-fit w-full mx-auto"
            onClick={markAsPacking}
          >
            Prepare this order
          </button>
        </div>
      )}
      {order.status === 'PREPARED_FOR_SHIPPING' && (
        <div className="flex flex-col gap-base">
          <p className="text-center text-xl">
            Once you hand over the package to the courier, you can mark this
            order as 'Shipped' in the system.
          </p>

          <button
            className="btn btn-primary max-w-[50%] min-w-fit w-full mx-auto"
            onClick={markAsShipped}
          >
            Mark as shipped
          </button>
        </div>
      )}
      {order.status === 'PACKING' && (
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
                Order does NOT have a generated label
              </span>
            )}

            {submitted && !label.isPrinted && label.isGenerated && (
              <span className="text-error text-base">
                Order does NOT have a printed label
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
      {order.status === 'SHIPPED' && (
        <div className="flex flex-col gap-base">
          <div className="text-center text-xl">
            Delivery process is finished!
          </div>
          <button
            className="btn btn-primary max-w-[50%] min-w-fit w-full mx-auto"
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
