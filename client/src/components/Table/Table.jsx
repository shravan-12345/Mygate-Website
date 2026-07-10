import React from 'react';
import './Table.css';

// columns: [{ key, header, render?(row) }]
// Generic enough to render any dashboard list (visitors, complaints, bills, ...)
// Pagination is presentational only — the parent page owns the actual page state
// and re-fetches data, keeping this component free of data-fetching concerns.
const Table = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  page = 1,
  totalPages = 1,
  onPageChange,
  keyField = '_id',
}) => {
  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="table__skeleton-row">
                  {columns.map((col) => (
                    <td key={col.key}>
                      <span className="skeleton-line" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="table__empty">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row) => (
                <tr key={row[keyField]}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="table__pagination">
          <button
            className="table__page-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="table__page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="table__page-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
