type PaginationProps = {
  total: number;
  page: number;
  size: number;
  setPage: (page: number) => void;
};
export const Paginator = ({ total, page, size, setPage }: PaginationProps) => {
  const maxPage = Math.ceil(total / size);

  const visibleItems = {
    from: Math.max((page - 1) * size + 1, 1),
    to: Math.min(page * size, total),
  };

  const visiblePages = {
    from: Math.max(
      1,
      page - (maxPage - page <= 2 ? Math.abs(page - maxPage + 4) : 2),
    ),
    to: Math.min(maxPage, Math.max(page + 2, 5)),
  };

  const pageNumbers = Array.from(
    { length: visiblePages.to - visiblePages.from + 1 },
    (_, i) => visiblePages.from + i,
  );

  return (
    <div className="flex flex-col-reverse items-center md:flex-row gap-base">
      <div className="flex items-center gap-1" aria-label="Showing items range">
        <span>
          {visibleItems.from}/{visibleItems.to}
        </span>
        <span>of</span>
        <span>{total}</span>
      </div>

      <div className="flex items-center gap-1 ">
        <button
          className={`btn btn-ghost hidden md:block ${page === 1 ? 'btn-disabled' : ''}`}
          onClick={() => setPage(1)}
          aria-label="First page"
          disabled={page === 1}
        >
          <span className="pi pi-angle-double-left"></span>
        </button>

        <button
          className={`btn btn-ghost ${page === 1 ? 'btn-disabled' : ''}`}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
          disabled={page === 1}
        >
          <span className="pi pi-angle-left"></span>
        </button>

        <div
          className="flex gap-1 max-w-[400px] snap-x-mandatory overflow-hidden"
          role="navigation"
        >
          {pageNumbers.map((pageNum) => (
            <button
              className={`btn ${page === pageNum ? 'btn-primary' : ''}`}
              key={pageNum}
              onClick={() => setPage(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={page === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          className={`btn btn-ghost ${page === maxPage ? 'btn-disabled' : ''}`}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
          disabled={page === maxPage}
        >
          <span className="pi pi-angle-right"></span>
        </button>

        <button
          className={`btn hidden md:block btn-ghost ${page === maxPage ? 'btn-disabled' : ''}`}
          onClick={() => setPage(maxPage)}
          aria-label="Last page"
          disabled={page === maxPage}
        >
          <span className="pi pi-angle-double-right"></span>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
