import React, { useEffect, useState } from "react";
import axios from "axios";
import Set from "./Set";
import Column from "./Column";
import UserNav from "./UserNav";
import { ColumnType, Filters, User } from "./Types";
import FunnelIcon from "@rsuite/icons/Funnel";
import ColumnFilter from "./ColumnFilter";

interface TableProps {
  user: User;
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const Table: React.FC<TableProps> = ({
  user,
  rerenderSignal,
  setRerenderSignal,
  isMobile,
}) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [currentTable, setCurrentTable] = useState("");
  const [tables, setTables] = useState([]);

  const [filters, setFilters] = useState<Filters>({
    isEstimated: [], // ["", "true", "false"]
    difficulty: [], // ["easy", "medium", "hard"]
    assignment: [], // e.g. ["user._id"]
    finishStatus: [], // ["exceeded", "today", "in-progress", "planned"]
  });

  const [searchValue, setSearchValue] = useState("");

  const getUserSet = async () => {
    if (!user.email) return;
    try {
      const response = await axios.get("http://localhost:5000/tables/tables", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setTables(response.data);
        let newColumns;
        if (currentTable) {
          const table = response.data.find(
            (table: any) => table._id === currentTable
          );
          if (table) {
            newColumns = table.columns;
          }
        } else {
          setCurrentTable(response.data[0]._id);
          newColumns = response.data[0].columns;
        }
        if (newColumns) {
          setColumns(newColumns);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    getUserSet();
  }, [user, rerenderSignal]);

  return (
    <div className="w-full h-full font-Roboto font-500">
      <div>
        <div>
          <div className="grid lg:grid-cols-8 grid-flow-row lg:grid-flow-col w-full">
            <div className="lg:col-span-6 lg:items-end order-2 overflow-x-auto scrollbar-thin p-2">
              <div className="scrollable-container whitespace-nowrap h-full">
                <Set
                  user={user}
                  tables={tables}
                  setColumns={setColumns}
                  setRerenderSignal={setRerenderSignal}
                  currentTable={currentTable}
                  setCurrentTable={setCurrentTable}
                  isMobile={isMobile}
                ></Set>
              </div>
            </div>
            <div className="lg:col-span-2 p-6 flex justify-end gap-8 lg:order-2 w-full lg:w-full overflow-none">
              <div className="flex items-center">
                <ColumnFilter
                  currentTable={currentTable}
                  filters={filters}
                  setFilters={setFilters}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                ></ColumnFilter>
              </div>
              <div>{user.email && <UserNav user={user}></UserNav>}</div>
            </div>
          </div>
        </div>
        {currentTable && (
          <div className="flex max-w-screen overflow-x-auto scrollbar-thin lg:mt-0 mt-4">
            <Column
              isMobile={isMobile}
              columns={columns}
              setColumns={setColumns}
              setRerenderSignal={setRerenderSignal}
              currentTable={currentTable}
              filters={filters}
              searchValue={searchValue}
              setFilters={setFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
