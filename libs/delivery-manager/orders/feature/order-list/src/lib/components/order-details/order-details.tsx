import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  OrderDetails as Order,
  OrderDetailsItem,
} from '@e-commerce/shared/api-models';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { Button } from 'primereact/button';
import { DataTable, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Steps } from 'primereact/steps';
import { MenuItem } from 'primereact/menuitem';
import { Skeleton } from 'primereact/skeleton';

export function OrderDetails({
  orderId,
  onStatusChange,
  onClose,
}: {
  orderId: Order['id'] | null;
  onStatusChange: (status: OrderStatus) => void;
  onClose: () => void;
}) {
  const toast = useToastStore();
  const [orderSteps] = useState<MenuItem[]>([
    { label: 'NEW' },
    { label: 'PACKING' },
    { label: 'PREPARED_FOR_SHIPPING' },
    { label: 'SHIPPED' },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [label, setLabel] = useState<{
    isGenerated: boolean;
    isPrinted: boolean;
  }>({ isGenerated: false, isPrinted: false });
  const [selectedOrderItems, setSelectedOrderItems] =
    useState<DataTableValueArray>([]);
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

  const { mutate, isPending: isUpdating } = useMutation<
    void,
    Error,
    { orderId: Order['id']; status: OrderStatus }
  >({
    mutationFn: ({ orderId, status }) =>
      axios.post(`${import.meta.env.VITE_API_URL}/order-details/${orderId}`, {
        status,
      }),
    onSuccess(_, { status }) {
      queryClient.setQueryData(['order', orderId], { ...order, status });

      toast.show({
        detail: `Status has been updated to ${status} for order no. ${orderId}`,
        summary: 'Success',
        severity: 'success',
      });

      onStatusChange(status);
    },
    onError() {
      toast.show({
        detail: 'Something went wrong!',
        summary: 'Error',
        severity: 'error',
      });
    },
  });

  function generateLabel() {
    setLabel((prevState) => ({ ...prevState, isGenerated: true }));

    toast.show({
      detail: 'Label has been generated',
      summary: 'Success',
      severity: 'success',
    });
  }

  function printLabel() {
    setLabel((prevState) => ({ ...prevState, isPrinted: true }));

    toast.show({
      detail: 'Label has been printed',
      summary: 'Success',
      severity: 'success',
    });
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
    onClose();
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
        <Skeleton className="!h-10 w-full" borderRadius="1rem" />
        <Skeleton className="!h-10 w-full" borderRadius="1rem" />
        <Skeleton className="!h-10 w-full" borderRadius="1rem" />
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong! Try later!</div>;
  }

  const imageTemplate = (orderItem: OrderDetailsItem) => {
    return (
      <img
        className="max-h-48"
        src={orderItem.book.coverImage}
        alt={orderItem.book.title + ' cover image'}
      />
    );
  };

  const authorsTemplate = (orderItem: OrderDetailsItem) => {
    return (
      <div className="flex flex-wrap gap-2">
        {orderItem.book.authors?.map((author) => (
          <span key={crypto.randomUUID()}>{author.name}</span>
        ))}{' '}
      </div>
    );
  };

  return (
    <>
      Status: {order.status}
      <Steps
        readOnly
        model={orderSteps}
        activeIndex={orderSteps.findIndex((o) => order.status === o.label)}
      />
      {order.status === 'NEW' && (
        <div className="flex flex-col gap-8">
          <p className="text-center text-xl">Order is ready to be packed</p>

          <Button
            className="max-w-[50%] min-w-fit w-full mx-auto"
            onClick={markAsPacking}
            label="Prepare this order"
          />
        </div>
      )}
      {order.status === 'PREPARED_FOR_SHIPPING' && (
        <div className="flex flex-col gap-base">
          <p className="text-center text-xl">
            Once you hand over the package to the courier, you can mark this
            order as 'Shipped' in the system.
          </p>

          <Button
            className="max-w-[50%] min-w-fit w-full mx-auto"
            onClick={markAsShipped}
            label="Mark as shipped"
          />
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
                {order.orderShippingMethod.name}
              </span>
            </span>

            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Price
              </span>
              <span className="text-base !text-start">
                {order.orderShippingMethod.price}
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
                {order.orderUserInformation.phone}
              </span>
            </span>
            <span className="flex gap-4 justify-start">
              <span className="text-sm text-muted-color font-semibold w-24 text-start">
                Name
              </span>
              <span className="text-base flex justify-start">
                {order.orderUserInformation.firstName}
                {order.orderUserInformation.lastName}
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
              <Button
                severity="secondary"
                className="max-w-[50%] min-w-fit w-full mx-auto"
                onClick={printLabel}
                label="Print label"
              />
            ) : (
              <Button
                severity="secondary"
                className="max-w-[50%] min-w-fit w-full mx-auto"
                onClick={generateLabel}
                label="Generate label"
              />
            )}
          </div>

          <div className="overflow-x-auto rounded-box wrapper">
            <span className="text-lg font-bold">Books to packed</span>
            <DataTable
              value={order.orderItems}
              selection={selectedOrderItems}
              onSelectionChange={(event) => setSelectedOrderItems(event.value)}
              selectionMode="checkbox"
              dataKey="id"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: '3rem' }}
              ></Column>
              <Column header="Authors" field="book" body={authorsTemplate} />
              <Column header="Cover" field="book" body={imageTemplate} />
            </DataTable>
            {
              // <table className="table">
              //   <thead>
              //     <tr>
              //       <th>
              //         <label>
              //           <input
              //             type="checkbox"
              //             className="checkbox"
              //             ref={selectAllCheckboxRef}
              //             checked={
              //               selectedOrderItems.length ===
              //               order.orderItems.length
              //             }
              //             onChange={toggleAllOrderItemsSelection}
              //           />
              //         </label>
              //       </th>
              //       <th>Image</th>
              //       <th>Authors</th>
              //       <th>Favorite Color</th>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     {order.orderItems?.map((item) => (
              //       <tr key={item.id}>
              //         <th>
              //           <label>
              //             <input
              //               type="checkbox"
              //               className="checkbox"
              //               onChange={() => toggleOrderItemSelection(item)}
              //               checked={
              //                 !!selectedOrderItems.find(
              //                   ({ id }) => id === item.id,
              //                 )
              //               }
              //             />
              //           </label>
              //         </th>
              //         <td>
              //           <img
              //             className="max-h-48"
              //             src={item.book.coverImage}
              //             alt={item.book.title + ' cover image'}
              //           />
              //         </td>
              //         <td>
              //           <div className="flex flex-wrap gap-2">
              //             {item.book.authors?.map((author) => (
              //               <span key={crypto.randomUUID()}>{author.name}</span>
              //             ))}
              //           </div>
              //         </td>
              //         <td>Blue</td>
              //       </tr>
              //     ))}
              //   </tbody>
              // </table>
            }
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

            <Button
              className="max-w-[50%] min-w-fit w-full"
              onClick={markAsPrepareForShipping}
              label="Mark as packed"
            />
          </div>
        </div>
      )}
      {order.status === 'SHIPPED' && (
        <div className="flex flex-col gap-base">
          <div className="text-center text-xl">
            Delivery process is finished!
          </div>
          <Button
            className="max-w-[50%] min-w-fit w-full mx-auto"
            onClick={close}
            label="Close"
          />
        </div>
      )}
    </>
  );
}

export default OrderDetails;
