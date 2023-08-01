import React from "react";

import classes from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  pageSize,
  pageSizes,
  totalPages,
  onPageSizeChange,
}) => {

  const maxButtonsToShow = 4;
  let startPage = currentPage - Math.floor(maxButtonsToShow / 2);
  let endPage = currentPage + Math.floor(maxButtonsToShow / 2);

  if (startPage <= 0) {
    endPage -= startPage - 1;
    startPage = 1;
  }
  if (endPage > totalItems) {
    startPage -= endPage - totalItems;
    endPage = totalItems;
  }

  const pageNumbersToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const pageNumbers = Math.ceil(totalItems / itemsPerPage);

  if (pageNumbers === 1) {
    return null;
  }
  const renderPageNumbers = () => {
    return pageNumbersToShow.map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={`${classes.paginationButton} ${
          currentPage === pageNumber ? classes.active : ""
        }`}
      >
        {pageNumber}
      </button>
    ));
  };
  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    onPageSizeChange(newPageSize);
  };
  return (
    <div className={classes.pagination}>
      <div className={classes.pageSizeSelect}>
        <span className={classes.text}>Page Size:</span>
        <select value={pageSize} onChange={handlePageSizeChange}>
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        {currentPage > 1 && (
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            className={classes.paginationButton}
          >
            First
          </button>
        )}
        {currentPage > 1 && (
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={classes.paginationButton}
          >
            Prev
          </button>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages && (
          <button
            disabled={currentPage === pageNumbers}
            onClick={() => onPageChange(currentPage + 1)}
            className={classes.paginationButton}
          >
            Next
          </button>
        )}
      </div>
      
    </div>
  );
};

export default Pagination;
