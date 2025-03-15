import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetails } from '@e-commerce/shared/api-models';
import axios from 'axios';
import OrderDetailsComponent from './components/order-details/order-details';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';

const socket = io('http://localhost:3000');

export function OrderList() {
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const orderDetailsDialog = useRef<HTMLDialogElement | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderDetails['id'] | null
  >(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newOrders, setNewOrders] = useState<OrderDetails[]>([]);
  const {
    isLoading,
    error,
    data: orders,
  } = useQuery<OrderDetails[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get<OrderDetails[]>(
        'http://localhost:3000/order-details',
      );
      return data;
    },
    staleTime: Infinity,
  });
  const mutation = useMutation<void, Error, { orderId: OrderDetails['id'] }>({
    mutationFn: ({ orderId }) =>
      axios.post(`http://localhost:3000/order-details/${orderId}`, {
        status: OrderStatus.PACKING,
      }),
    onSuccess(_, { orderId }) {
      if (orders) {
        const updatedData = orders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.PACKING }
            : { ...order },
        );
        queryClient.setQueryData(['orders'], updatedData);
      }
      toast.show(
        `Status has been updated to ${OrderStatus.PACKING} for order no. ${selectedOrderId}`,
      );
    },
    onError() {
      toast.show(`Something went wrong. Try again.`);
    },
  });

  function addOrder(order: OrderDetails) {
    setNewOrders((prevState) => [...prevState, order]);
  }

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function onError(error: unknown) {
    toast.show('WebSocket encounters an error. Reload page.');
  }

  function openOrderDetailsDialog(order: OrderDetails) {
    setSelectedOrderId(order.id);
    orderDetailsDialog.current?.showModal();

    if (order.status !== OrderStatus.NEW) return;

    // mutation.mutate({ orderId: order.id });
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
    socket.on('connect', onConnect);
    socket.on('exception', onError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('order', addOrder);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('exception', onError);
    };
  }, []);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error occurred while getting orders!</div>;
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
        <div className="modal-box rounded-base flex flex-col gap-base max-w-[868px]">
          <h3 className="text-center text-xl">Order packing</h3>
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
