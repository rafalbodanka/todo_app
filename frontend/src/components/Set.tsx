import React from "react";
import AddTable from "./AddTable";
import EditTable from "./EditTable";
import { ColumnType, User, TableType } from "./Types";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/user";
import { isMobileValue } from "../redux/isMobile";

interface SetProps {
  tables: TableType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTable: string;
  setCurrentTable: React.Dispatch<string>;
}

const Set: React.FC<SetProps> = ({
  tables,
  setColumns,
  setRerenderSignal,
  currentTable,
  setCurrentTable,
}) => {
  const user = useAppSelector(selectUser)
  const isMobile = useAppSelector(isMobileValue)

  const switchTable = (tableId: string, columns: ColumnType[]) => {
    setColumns(columns);
    setCurrentTable(tableId);
  };

  return (
    <div className="w-full h-full flex justify-left items-center">
      <div className="grid grid-flow-col gap-8">
        {tables.map((table) => {
          return (
            <div
              key={table._id}
              className={`cursor-pointer p-2 pl-4 pr-4 hover:shadow-lg hover:bg-slate-200 rounded-md grid grid-col-2 grid-flow-col gap-6 md:gap-4 ${
                currentTable === table._id ? "bg-purple-900 text-white" : ""
              }`}
              onClick={() => {
                if (currentTable !== table._id) {
                  switchTable(table._id, table.columns);
                }
              }}
            >
              <div>{table.title}</div>
              <EditTable
                table={table}
                currentTable={currentTable}
                setRerenderSignal={setRerenderSignal}
                tables={tables}
                setCurrentTable={setCurrentTable}
                setColumns={setColumns}
              ></EditTable>
            </div>
          );
        })}
        <AddTable setRerenderSignal={setRerenderSignal}></AddTable>
      </div>
    </div>
  );
};

export default Set;
