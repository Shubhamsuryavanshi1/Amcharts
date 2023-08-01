import { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./TableData.module.css";
import Pagination from "./Pagination";
import { AiOutlineDown, AiOutlineSearch, AiOutlineUp } from "react-icons/ai";
import { useSelector } from "react-redux";

const pageSizes = [5, 7, 10, 12, 15];
const TableData = () => {
  const { data } = useSelector((state) => state.data);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (data.data.length > 0) {
      console.log("inside useEffect if");
      setFilteredData(data.data);
    }
  }, [data?.data]);
  const handleSearchChange = useCallback(
    (event) => {
      //   console.log("handleSearchChange");
      const query = event.target.value;
      setSearchQuery(query);
      setCurrentPage(1);
      const filteredResult = data.data.filter(
        (item) =>
          item.Company_Name.toLowerCase().includes(
            query.trim().toLowerCase()
          ) ||
          item.Level.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.Parent.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.Partner_Type.toLowerCase().includes(
            query.trim().toLowerCase()
          ) ||
          item.Source.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.Industry.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.NAICS_code == query ||
          item.HQ_Location.toLowerCase().includes(query.trim().toLowerCase())
      );
      setFilteredData(filteredResult);
    },
    [searchQuery]
  );

  const handleColumnHeaderClick = (columnName) => {
    //   console.log("handleColumnHeaderClick");
    if (sortBy == columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
    const sortedData = [...filteredData];
    sortedData.sort((a, b) => {
      const aValue = a[columnName];
      const bValue = b[columnName];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue, undefined, {
          sensitivity: "base",
        });
      } else {
        return aValue - bValue;
      }
    });

    if (sortOrder === "desc") {
      sortedData.reverse();
    }
    setFilteredData(sortedData);
    setCurrentPage(1);
  };

  const lastIndex = currentPage * pageSize;
  const firstIndex = lastIndex - pageSize;
  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / pageSize);
  const currentItems = filteredData.slice(firstIndex, lastIndex);

  const handlePageSizeChange = useCallback((newPageSize) => {
    // console.log("handlePageSizeChange");
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const paginate = useCallback((pageNo) => {
    // console.log("paginate");
    setCurrentPage(pageNo);
  }, []);

  console.log("tableData");

  return (
    <div className={classes.mainDiv}>
      <div className={classes.search}>
        <input
          type="text"
          placeholder="  Search"
          name="search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <AiOutlineSearch className={classes.searchIcon} />
        {/* <button>Search</button> */}
      </div>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>Index</th>
            <th onClick={() => handleColumnHeaderClick("Company_Name")}>
              Company Names
              {/* {getSortIcon("Company_Name")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("Level")}>
              Level
              {/* {getSortIcon("Level")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("Parent")}>
              Parent
              {/* {getSortIcon("Parent")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("Partner_Type")}>
              Partner Type
              {/* {getSortIcon("Partner_Type")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("Source")}>
              Source
              {/* {getSortIcon("Source")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("Industry")}>
              Industry
              {/* {getSortIcon("Industry")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("NAICS_code")}>
              NAICS_code
              {/* {getSortIcon("NAICS_code")} */}
            </th>
            <th onClick={() => handleColumnHeaderClick("HQ_Location")}>
              HQ_Location
              {/* {getSortIcon("HQ_Location")} */}
            </th>
          </tr>
        </thead>
        {currentItems.length > 0 ? (
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={firstIndex + index + 1}>
                <td>{firstIndex + index + 1}</td>
                <td>{item.Company_Name || "NA"}</td>
                <td>{item.Level || "NA"}</td>
                <td>{item.Parent || "NA"}</td>
                <td>{item.Partner_Type || "NA"}</td>
                <td>{item.Source || "NA"}</td>
                <td>{item.Industry || "NA"}</td>
                <td>{item.NAICS_code || "NA"}</td>
                <td>{item.HQ_Location || "NA"}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className={classes.notFound}>
            <tr>
              <td>Data not found.</td>
            </tr>
          </tbody>
        )}
      </table>
      {filteredData.length > pageSize && (
        <Pagination
          pageSize={pageSize}
          pageSizes={pageSizes}
          currentPage={currentPage}
          itemsPerPage={pageSize}
          totalPages={totalPages}
          totalItems={totalData}
          onPageChange={paginate}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default TableData;
