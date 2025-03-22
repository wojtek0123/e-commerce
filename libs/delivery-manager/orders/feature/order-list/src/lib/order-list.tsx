import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetails } from '@e-commerce/shared/api-models';
import axios from 'axios';
import OrderDetailsComponent from './components/order-details/order-details';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import SortButton from './components/sort-header/sort-header';

const socket = io(import.meta.env.VITE_API_URL);

export type SortBy = 'createdAt' | 'status';

export function OrderList() {
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const orderDetailsDialog = useRef<HTMLDialogElement | null>(null);
  const [sort, setSort] = useState<{ by: SortBy; mode: 'asc' | 'desc' }>({
    by: 'createdAt',
    mode: 'desc',
  });
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderDetails['id'] | null
  >(null);
  const {
    isLoading,
    isError,
    data: orders,
  } = useQuery<OrderDetails[]>({
    queryKey: ['orders', sort.by, sort.mode],
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
            sortBy: sort.by,
            sortByMode: sort.mode,
          },
        },
      );
      return data;
    },
    staleTime: Infinity,
    cacheTime: 0,
  });

  const addOrder = useCallback(
    () => (order: OrderDetails) => {
      queryClient.setQueryData(
        ['orders'],
        (oldData: OrderDetails[] | undefined) => {
          return [order, ...(oldData ?? [])];
        },
      );
    },
    [queryClient],
  );

  const onError = useCallback(() => {
    toast.show('WebSocket encounters an error. Reload page.');
  }, [toast]);

  function openOrderDetailsDialog(order: OrderDetails) {
    setSelectedOrderId(order.id);
    orderDetailsDialog.current?.showModal();

    if (order.status !== OrderStatus.NEW) return;
  }

  function statusToBadgeClass(status: OrderStatus) {
    let severity = '';

    switch (status) {
      case 'NEW':
        severity = 'badge-warning';
        break;
      case 'PACKING':
        severity = 'badge-secondary';
        break;
      case 'PREPARED_FOR_SHIPPING':
        severity = 'badge-neutral';
        break;
      case 'SHIPPED':
        severity = 'badge-accent';
        break;
    }

    return `badge badge-xl ${severity}`;
  }

  const changeSort = (by: SortBy) => {
    if (sort.by === by) {
      setSort((prevState) => ({
        ...prevState,
        mode: prevState.mode === 'desc' ? 'asc' : 'desc',
      }));
    } else {
      setSort({ by, mode: 'desc' });
    }
  };

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
  }, [onError, addOrder]);

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
                  <th className="text-lg"></th>
                  <th className="text-lg">Order no.</th>
                  <th className="text-lg">
                    <span> Created at </span>
                    <SortButton
                      by="createdAt"
                      sort={sort}
                      changeSort={(event) => changeSort(event)}
                    />
                  </th>
                  <th className="text-lg">
                    <span>Status</span>

                    <SortButton
                      by="status"
                      sort={sort}
                      changeSort={(event) => changeSort(event)}
                    />
                  </th>
                  <th className="text-lg"></th>
                </tr>
              </thead>
              <tbody>
                {orders?.length &&
                  orders.map((order, index) => (
                    <tr key={order.id}>
                      <th className="text-lg">{index + 1}</th>
                      <td className="text-lg">{order.id}</td>
                      <td className="text-lg">
                        {new Date(order.createdAt).toUTCString()}
                      </td>
                      <td>
                        <span className={statusToBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
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
      </div>
    </>
  );
}

export default OrderList;
