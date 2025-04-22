import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetails, Paginated } from '@e-commerce/shared/api-models';
import axios from 'axios';
import OrderDetailsComponent from './components/order-details/order-details';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import SortButton from './components/sort-header/sort-header';
import { useOrdersStore } from '@e-commerce/deliery-manager/orders/data-access';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

const socket = io(import.meta.env.VITE_API_URL);

export type SortBy = 'createdAt' | 'status';

export function OrderList() {
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const store = useOrdersStore();
  const orderDetailsDialog = useRef<HTMLDialogElement | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderDetails['id'] | null
  >(null);
  const {
    isLoading,
    isError,
    isRefetching,
    data: orders,
  } = useQuery<OrderDetails[]>({
    queryKey: ['orders', store.sort.by, store.sort.mode],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<OrderDetails>>(
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
            sortBy: store.sort.by,
            sortByMode: store.sort.mode,
          },
        },
      );
      return data.items;
    },
    staleTime: Infinity,
    cacheTime: 0,
    keepPreviousData: true,
  });

  const addOrder = (order: OrderDetails) => {
    queryClient.setQueryData(
      ['orders', store.sort.by, store.sort.mode],
      (oldData?: OrderDetails[]) => {
        const newOrders = [order, ...(oldData ?? [])];

        const sortedOrders = newOrders.toSorted((a, b) => {
          const aValue = a[store.sort.by];
          const bValue = b[store.sort.by];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue);
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return aValue - bValue;
          }

          return String(aValue).localeCompare(String(bValue));
        });

        return store.sort.mode === 'asc'
          ? sortedOrders.toReversed()
          : sortedOrders;
      },
    );
  };

  const onError = useCallback(() => {
    toast.show('WebSocket encounters an error. Reload page.', 'error');
  }, [toast]);

  function openOrderDetailsDialog(order: OrderDetails) {
    setSelectedOrderId(order.id);
    orderDetailsDialog.current?.showModal();

    if (order.status !== OrderStatus.NEW) return;
  }

  function statusToBadgeClass(status: OrderStatus) {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'PACKING':
        return 'danger';
      case 'PREPARED_FOR_SHIPPING':
        return 'warning';
      case 'SHIPPED':
        return 'success';
    }
  }

  const changeSort = (by: SortBy) => {
    store.setSort(by);
  };

  function updateStatus(status: OrderStatus) {
    if (!orders) return;

    const updatedData = orders.map((order) =>
      order.id === selectedOrderId ? { ...order, status } : { ...order },
    );

    queryClient.setQueryData(
      ['orders', store.sort.by, store.sort.mode],
      updatedData,
    );
  }

  useEffect(() => {
    socket.on('order', addOrder);
    socket.on('exception', onError);

    return () => {
      socket.off('order', addOrder);
      socket.off('exception', onError);
    };
  }, []);

  if (isLoading && !orders) {
    const skeletons = new Array(20).fill(0, 0, 19);

    return (
      <div className="flex flex-col gap-base w-full">
        {skeletons.map((_, index) => (
          <div className="grid grid-cols-4 gap-12" key={index}>
            <div className="skeleton h-10 w-full rounded-base"></div>
            <div className="skeleton h-10 w-full rounded-base"></div>
            <div className="skeleton h-10 w-full rounded-base"></div>
            <div className="skeleton h-10 w-full rounded-base"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong! Try later!</div>;
  }

  const changeStatusTemplate = () => {
    return <Button label="Open" />;
  };

  const statusBadgeTemplate = (rowData: OrderDetails) => {
    return <Badge severity={statusToBadgeClass(rowData.status)} />;
  };

  return (
    <>
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

      <div className="w-full p-base bg-content-background rounded-base min-h-content">
        <div className="overflow-x-auto ">
          <DataTable value={orders}>
            <Column header="Order no" />
            <Column header="Created at" field="creaedAt" sortable />
            <Column
              header="Status"
              field="status"
              sortable
              body={statusBadgeTemplate}
            />
            <Column header="" body={changeStatusTemplate} />
          </DataTable>

          <div className="w-full py-12 text-center text-4xl font-bold">
            Not found any orders!
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderList;
