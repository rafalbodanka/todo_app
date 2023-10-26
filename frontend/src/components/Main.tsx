import React, { useEffect, useState } from "react";
import axios from "axios";
import Set from "./nav/Set";
import Column from "./column/Column";
import UserNav from "./nav/UserNav";
import { ColumnType, Filters, User } from "./utils/Types";
import ColumnFilter from "./column/ColumnFilter";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { selectUser } from "../redux/user";
import { selectTables, setTables } from "../redux/tables";
import { selectCurrentTable, setCurrentTable, setColumns } from "../redux/currentTable";
import { Skeleton } from "@mui/material";
import { Button } from "rsuite";
import TableSkeleton from "./skeletons/TableSkeleton";

interface TableProps {
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Main: React.FC<TableProps> = ({
  rerenderSignal,
  setRerenderSignal,
}) => {
  const user: User = useAppSelector(selectUser);
  const dispatch = useAppDispatch()
  const tables = useAppSelector(selectTables)
  const currentTable = useAppSelector(selectCurrentTable)
  const [isFetching, setIsFetching] = useState(true)

  const [filters, setFilters] = useState<Filters>({
    isEstimated: [], // ["", "true", "false"]
    difficulty: [], // ["easy", "medium", "hard"]
    assignment: [], // ["user._id"]
    finishStatus: [], // ["exceeded", "today", "in-progress", "planned"]
  });

  const [searchValue, setSearchValue] = useState("");

  const getUserSet = async () => {
    if (!user.email) return;
    setIsFetching(true)
    try {
      const response = await axios.get("http://localhost:5000/tables/tables", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        dispatch(setTables(response.data));
        let newColumns;
        if (currentTable._id != "") {
          const table = response.data.find(
            (table: any) => table._id === currentTable
          );
          if (table) {
            newColumns = table.columns;
          }
        } else {
          dispatch(setCurrentTable(response.data[0]));
          newColumns = response.data[0].columns;
        }
        if (newColumns) {
          dispatch(setColumns(newColumns));
        }
      }
    } catch (err) {} finally {
      setIsFetching(false)
    }
  };

  useEffect(() => {
    getUserSet();
  }, [user]);

  return (
    <div>
      <div className="fixed bottom-0 left-0 bg-black"><Button onClick={()=> setIsFetching((prev) => !prev)}>xdd</Button></div>
    {isFetching ?
      <TableSkeleton />
      :
      <div className="w-full h-full font-Roboto font-500">
        <div>
          <div>
            <div className="grid lg:grid-cols-8 grid-flow-row lg:grid-flow-col w-full">
              <div className="lg:col-span-6 lg:items-end order-2 overflow-x-auto scrollbar-thin p-2">
                <div className="scrollable-container whitespace-nowrap h-full">
                  <Set
                    setRerenderSignal={setRerenderSignal}
                  ></Set>
                </div>
              </div>
              <div className="lg:col-span-2 p-6 flex justify-end gap-8 lg:order-2 w-full lg:w-full overflow-none">
                <div className="flex items-center">
                  <ColumnFilter
                    filters={filters}
                    setFilters={setFilters}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                  ></ColumnFilter>
                </div>
                <div>{user.email && <UserNav></UserNav>}</div>
              </div>
            </div>
          </div>
          {currentTable && tables.length > 0 && (
            <div className="flex max-w-screen overflow-x-auto scrollbar-thin lg:mt-0 mt-4">
              <Column
                setRerenderSignal={setRerenderSignal}
                filters={filters}
                searchValue={searchValue}
              />
            </div>
          )}
        </div>
      </div>
    }
    </div>
  );
};

export default Main;
