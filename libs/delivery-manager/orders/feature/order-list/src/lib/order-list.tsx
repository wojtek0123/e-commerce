import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetails } from '@e-commerce/shared/api-models';
import axios from 'axios';
import OrderDetailsComponent from './components/order-details/order-details';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';

const socket = io(import.meta.env.VITE_API_URL);

export function OrderList() {
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const orderDetailsDialog = useRef<HTMLDialogElement | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderDetails['id'] | null
  >(null);
  const [newOrders, setNewOrders] = useState<OrderDetails[]>([]);
  const {
    isLoading,
    isError,
    data: orders,
  } = useQuery<OrderDetails[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get<OrderDetails[]>(
        `${import.meta.env.VITE_API_URL}/order-details`,
        {
          params: {
            status: (
              [
                'NEW',
                'PACKING',
                'PREPARED_FOR_SHIPPING',
              ] satisfies OrderStatus[]
            ).join(','),
          },
        },
      );
      return data;
    },
    staleTime: Infinity,
  });

  function addOrder(order: OrderDetails) {
    setNewOrders((prevState) => [...prevState, order]);
  }

  const onError = useCallback(() => {
    toast.show('WebSocket encounters an error. Reload page.');
  }, [toast]);

  function openOrderDetailsDialog(order: OrderDetails) {
    setSelectedOrderId(order.id);
    orderDetailsDialog.current?.showModal();

    if (order.status !== OrderStatus.NEW) return;
  }

  function updateStatus(status: OrderStatus) {
    if (!orders) return;

    const updatedData = orders.map((order) =>
      order.id === selectedOrderId ? { ...order, status } : { ...order },
    );

    queryClient.setQueryData(['orders'], updatedData);
  }
  useEffect(() => {
    socket.on('order', addOrder);
    socket.on('exception', onError);

    return () => {
      socket.off('order', addOrder);
      socket.off('exception', onError);
    };
  }, [onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-base">
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
        <div className="skeleton h-10 w-full rounded-base"></div>
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
      {!toast.hidden && (
        <div className="toast toast-top toast-end z-[1001]">
          <div className="alert alert-success">
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <dialog ref={orderDetailsDialog} className="modal">
        <div className="modal-box rounded-base flex flex-col gap-8 max-w-[868px]">
          <h3 className="text-center text-xl">Order no. {selectedOrderId}</h3>
          <div className="w-full h-[1px] bg-neutral-content"></div>
          <OrderDetailsComponent
            orderId={selectedOrderId}
            dialogRef={orderDetailsDialog}
            onStatusChange={updateStatus}
          />
        </div>
      </dialog>

      <div className="w-full">
        {orders?.length !== 0 && (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Order no.</th>
                  <th>Created at</th>
                  <th>Status</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {orders?.length &&
                  [...newOrders, ...orders].map((order, index) => (
                    <tr key={order.id}>
                      <th>{index + 1}</th>
                      <td>{order.id}</td>
                      <td>{order.createdAt}</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => openOrderDetailsDialog(order)}
                        >
                          pack order
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        <h2>New orders</h2>
        {newOrders?.length !== 0 && (
          <ul>
            {newOrders?.map((order) => <li key={order.id}>{order.id}</li>)}
          </ul>
        )}
      </div>
    </>
  );
}

export default OrderList;
