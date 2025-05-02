import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Inventory, Paginated } from '@e-commerce/shared/api-models';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';
import {
  SortBy,
  useSuppliesStore,
} from '@e-commerce/delivery-manager/supplies/data-access';
import { FormEvent, useState } from 'react';
import ChangeQuantityDialog from './components/change-quantity-dialog/change-quantity-dialog';
import AddBookDialog from './components/add-book-dialog/add-book-dialog.component';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

export function SupplyList() {
  const [searchText, setSearchText] = useState('');
  const store = useSuppliesStore();
  const queryClient = useQueryClient();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { isInitialLoading, isError, isRefetching, data } = useQuery<
    Paginated<Inventory>
  >({
    queryKey: [
      'inventories',
      store.sort.by,
      store.sort.mode,
      store.page,
      store.size,
      searchText,
    ],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<Inventory>>(
        `${import.meta.env.VITE_API_URL}/inventories`,
        {
          params: {
            titleLike: searchText,
            sortBy: store.sort.by,
            sortByMode: store.sort.mode,
            size: store.size,
            page: store.page,
          },
        },
      );

      return data;
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const increaseQuantity = (inventoryId: Inventory['id'], by: number) => {
    const updatedInventories = data?.items.map((inventory) =>
      inventory.id === inventoryId
        ? { ...inventory, quantity: inventory.quantity + by }
        : { ...inventory },
    );

    queryClient.setQueryData<Paginated<Inventory>>(
      [
        'inventories',
        store.sort.by,
        store.sort.mode,
        store.page,
        store.size,
        searchText,
      ],
      (prevState) => ({ ...prevState!, items: updatedInventories ?? [] }),
    );
  };

  const changeSort = (by: SortBy) => {
    store.setSort(by);
  };

  const setPage = (page: number) => {
    store.setPage(page);
  };

  if (isInitialLoading) {
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

  const searchSupplies = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    const value = (event.target as HTMLInputElement)?.value ?? null;

    if (timer) {
      clearTimeout(timer);
    }

    const delay = setTimeout(() => {
      setSearchText(value);
    }, 300);

    setTimer(delay);
  };

  const titleTemplate = (inventory: Inventory) => {
    return <span>{inventory.book.title}</span>;
  };

  const changeQuantityTemplate = (inventory: Inventory) => {
    return (
      <ChangeQuantityDialog
        bookId={inventory.book.id}
        increseQuantity={(by) => increaseQuantity(inventory.id, by)}
      />
    );
  };

  return (
    <div className="w-full rounded-base flex flex-col gap-base xl:min-h-content">
      <div className="flex justify-between gap-base p-base rounded-base bg-content-background">
        <InputText
          type="text"
          onChange={(e) => searchSupplies(e)}
          placeholder="Type title"
          aria-label="Search book by title"
          className="input max-w-[440px] w-full py-0"
        />

        <AddBookDialog />
      </div>
      <div className="w-full rounded-base p-base bg-content-background">
        {!data?.items?.length && !isRefetching ? (
          <div className="flex flex-col gap-base items-center">
            <h2 className="text-xl font-bold">
              Not found any book! Do you want to add one?
            </h2>
            <AddBookDialog />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable loading={isRefetching} value={data?.items}>
              <Column header="ID" field="id" />
              <Column header="Title" field="book" body={titleTemplate} />
              <Column header="Quantity" field="quantity" />
              <Column body={changeQuantityTemplate} />
            </DataTable>
          </div>
        )}
      </div>

      {data?.items?.length && (
        <div
          className={`p-base rounded-base bg-content-background gap-base flex items-center justify-center ${isRefetching && 'animate-pulse pointer-events-none'}`}
        >
          <Paginator
            className="p-0 border-none"
            totalRecords={data.total}
            first={store.page}
            rows={store.size}
            onPageChange={(event) => setPage(event.first)}
          />
        </div>
      )}
    </div>
  );
}

export default SupplyList;
