import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetails, Paginated } from '@e-commerce/shared/api-models';
import axios from 'axios';
import OrderDetailsComponent from './components/order-details/order-details';
import { OrderStatus } from '@prisma/client';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { useOrdersStore } from '@e-commerce/deliery-manager/orders/data-access';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';

const socket = io(import.meta.env.VITE_API_URL);

export type SortBy = 'createdAt' | 'status';

export function OrderList() {
  const toast = useToastStore();
  const queryClient = useQueryClient();
  const store = useOrdersStore();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderDetails['id'] | null
  >(null);
  const {
    isLoading,
    isError,
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
    toast.show({
      detail: 'WebSocket encounters an error. Reload page.',
      severity: 'error',
      summary: 'Error',
    });
  }, [toast]);

  function openOrderDetailsDialog(order: OrderDetails) {
    setSelectedOrderId(order.id);
    setIsDialogVisible(true);

    if (order.status !== OrderStatus.NEW) return;
  }

  function statusToSeverityClass(status: OrderStatus) {
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

  const changeStatusTemplate = (order: OrderDetails) => {
    return (
      <Button
        text={true}
        icon="pi pi-shopping-cart"
        className="h-fit"
        onClick={() => openOrderDetailsDialog(order)}
      />
    );
  };

  const statusTagTemplate = (rowData: OrderDetails) => {
    return (
      <Tag
        severity={statusToSeverityClass(rowData.status)}
        value={rowData.status}
      />
    );
  };

  if (isError) {
    return <div>Error occurred while getting orders</div>;
  }

  return (
    <>
      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        className="max-w-[868px]"
      >
        <div className="flex flex-col gap-8">
          <h3 className="text-center text-xl">Order no. {selectedOrderId}</h3>
          <div className="w-full h-[1px] bg-neutral-content"></div>
          <OrderDetailsComponent
            orderId={selectedOrderId}
            onStatusChange={updateStatus}
            onClose={() => setIsDialogVisible(false)}
          />
        </div>
      </Dialog>

      <div className="w-full p-base bg-content-background rounded-base">
        <div className="overflow-x-auto ">
          <DataTable className='rounded-base overflow-hidden' tableClassName='rounded-base overflow-hidden' sortOrder={-1} sortField='createdAt' value={orders} loading={isLoading}>
            <Column header="Order no" field="id" />
            <Column header="Created at" field="createdAt" sortable />
            <Column
              header="Status"
              field="status"
              sortable
              body={statusTagTemplate}
            />
            <Column
              header=""
              body={(rowData) => changeStatusTemplate(rowData)}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}

export default OrderList;
