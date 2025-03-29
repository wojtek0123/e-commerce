import { useQuery } from '@tanstack/react-query';
import { Book, Paginated } from '@e-commerce/shared/api-models';
import axios from 'axios';
import { SortButton, Paginator } from '@e-commerce/delivery-manager/shared/ui';
import {
  SortBy,
  useSuppliesStore,
} from '@e-commerce/delivery-manager/supplies/data-access';
import { FormEvent, useRef, useState } from 'react';
import ChangeQuantityDialog from './components/change-quantity-dialog/change-quantity-dialog';

export function SupplyList() {
  const searchTextRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState('');
  const store = useSuppliesStore();
  const { isInitialLoading, isError, isRefetching, data } = useQuery<
    Paginated<Book>
  >({
    queryKey: [
      'books',
      store.sort.by,
      store.sort.mode,
      store.page,
      store.size,
      searchText,
    ],
    queryFn: async () => {
      const { data } = await axios.get<Paginated<Book>>(
        `${import.meta.env.VITE_API_URL}/books`,
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

  const changeSort = (by: SortBy) => {
    store.setSort(by);
  };

  const setPage = (page: number) => {
    store.setPage(page);
  };

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setSearchText(searchTextRef.current?.value ?? '');
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

  return (
    <div className="flex flex-col gap-base">
      <div className="flex justify-between gap-base p-base rounded-base bg-base-300">
        <form className="flex gap-base" onSubmit={(event) => search(event)}>
          <input
            type="text"
            ref={searchTextRef}
            placeholder="Type title"
            aria-label="Search book by title"
            className="input max-w-[440px] w-full"
          />
          <button className="btn btn-secondary !rounded-sm" type="submit">
            Search
          </button>
        </form>

        <button className="btn btn-primary">Add book</button>
      </div>
      <div className="w-full rounded-base p-base bg-base-300">
        {!data?.items?.length && !isRefetching ? (
          <div className="flex flex-col gap-base items-center">
            <h2 className="text-xl font-bold">
              Not found any book! Do you want to add one?
            </h2>
            <button className="btn btn-primary">Add book</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className={`table w-full ${isRefetching && 'animate-pulse pointer-events-none'}`}
            >
              <thead>
                <tr>
                  <th className="text-lg"></th>
                  <th className="text-lg">ID</th>
                  <th className="text-lg">
                    <span>Title</span>
                    <SortButton
                      by="title"
                      sort={store.sort}
                      changeSort={(event) => changeSort(event)}
                    />
                  </th>
                  <th className="text-lg"></th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((book, index) => (
                  <tr key={book.id}>
                    <th className="text-lg">
                      {index + store.size * (store.page - 1) + 1}
                    </th>
                    <td className="text-lg">{book.id}</td>
                    <td className="text-lg">{book.title}</td>
                    <td className="text-lg">
                      <ChangeQuantityDialog bookId={book.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data?.items?.length && (
        <div
          className={`p-base rounded-base bg-base-300 gap-base flex items-center justify-center ${isRefetching && 'animate-pulse pointer-events-none'}`}
        >
          <Paginator
            total={data.total}
            page={store.page}
            size={store.size}
            setPage={(event) => setPage(event)}
          />
        </div>
      )}
    </div>
  );
}

export default SupplyList;
