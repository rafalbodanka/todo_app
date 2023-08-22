import React from "react";
import AddTable from "../table/AddTable";
import EditTable from "../table/EditTable";
import { TableType } from "../utils/Types";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectTables } from "../../redux/tables";
import { selectCurrentTable, setCurrentTable } from "../../redux/currentTable";

interface SetProps {
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Set: React.FC<SetProps> = ({
  setRerenderSignal,
}) => {
  const tables = useAppSelector(selectTables)
  const currentTable = useAppSelector(selectCurrentTable)
  const dispatch = useAppDispatch()

  const switchTable = (table: TableType) => {
    dispatch(setCurrentTable(table));
  };

  return (
    <div className="w-full h-full flex justify-left items-center">
      <div className="grid grid-flow-col gap-8">
        {tables.map((table) => {
          return (
            <div
              key={table._id}
              className={`cursor-pointer p-2 pl-4 pr-4 hover:shadow-lg hover:bg-slate-200 rounded-md grid grid-col-2 grid-flow-col gap-6 md:gap-4 ${
                currentTable._id === table._id ? "bg-purple-900 text-white" : ""
              }`}
              onClick={() => {
                if (currentTable._id !== table._id) {
                  switchTable(table);
                }
              }}
            >
              <div>{table.title}</div>
              <EditTable
                table={table}
                setRerenderSignal={setRerenderSignal}
                tables={tables}
              ></EditTable>
            </div>
          );
        })}
        <AddTable setRerenderSignal={setRerenderSignal} switchTable={switchTable}></AddTable>
      </div>
    </div>
  );
};

export default Set;
