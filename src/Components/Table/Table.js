import { useTable, useSortBy, usePagination } from "react-table";
import { IoMdArrowDropleft, IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import styled from "styled-components";
import getData from "../getData";
import "./Table.css";

const Styles = styled.div`
  padding: 1rem;
  width: 80%;

  table {
    border: 1px solid black;
    border-spacing: 0;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;

      :last-child {
        border-right: 0;
      }
    }
  }
`;
//==================================================================
// Define a custom Cell component for the "status" column

//==================================================================
const SimpleCell = ({ value: initialValue }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <span className="table-cell">{value}</span>;
};
//==================================================================
// Set our editable cell render as the default Cell render
const defaultColumn = {
  Cell: SimpleCell,
};

function Table({ columns, data, updateMyData, skipPageReset,ClickHandler }) {
  const [PaginationBar, setPaginationBar] = useState(false);
  

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    useSortBy,
    usePagination
  );
  const PaginationBarHandler = () => {
    setPaginationBar(!PaginationBar);
  };
  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className="main-table">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className={`table-header-${index}`}
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            // function ClickHandler(ID) {
            //   if(window.location.pathname.split('/').includes("customers")){
            //     const params = new URLSearchParams();
            //     params.append("ID", ID);
            //     const newUrl = `${
            //       window.location.origin
            //     }/profile?${params.toString()}`;
            //     window.location.href = newUrl;
            //   }
            return (
              <tr
                {...row.getRowProps()}
                className={i % 2 === 0 ? "table-row" : "table-row-mark"}
                onClick={() => ClickHandler(row.cells[0].value)}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={`pagination ${PaginationBar ? "" : "pagination-close"}`}>
        <div className="opening-button-box" onClick={PaginationBarHandler}>
          {PaginationBar ? <IoMdClose /> : <IoMdArrowDropleft />}
        </div>
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          {"<"}
        </button>{" "}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="pagination-button"
        >
          {">"}
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="pagination-button"
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span className="go-to-input">
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function App(props) {
  const [data, setData] = React.useState([]);
  
  React.useState(() =>
  getData(props.DataType).then((result) => {
      setTableColumns(result.columns)
      setData(result.Data);
    })
  );
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [TableColumns, setTableColumns] = React.useState([]);

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  return (
    <Styles>
      <Table
        columns={TableColumns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        ClickHandler={props.ClickHandler}
      />
    </Styles>
  );
}

export default App;
