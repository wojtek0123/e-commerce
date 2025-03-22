export type SortBy = 'createdAt' | 'status';
export type SortByMode = 'asc' | 'desc';

export const Sort = ({
  by,
  sort,
  changeSort,
}: {
  by: SortBy;
  sort: { by: SortBy; mode: SortByMode };
  changeSort: (by: SortBy) => void;
}) => {
  return (
    <>
      {by && (
        <button className="btn btn-ghost" onClick={() => changeSort(by)}>
          <span
            className={`pi pi-sort-amount-up-alt  ${sort.mode === 'asc' && sort.by === by ? 'rotate-0' : ' rotate-180'} ${sort.by === by ? 'text-primary' : 'text-primary-content'}`}
          />
        </button>
      )}
    </>
  );
};

export default Sort;
