import React from "react";
import AddTable from "./AddTable";
import EditTable from "./EditTable";

import { ColumnType, User, TableType } from "./Types";

interface SetProps {
  user: User;
  tables: TableType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTable: string;
  setCurrentTable: React.Dispatch<string>;
  isMobile: boolean;
}

const Set: React.FC<SetProps> = ({
  user,
  tables,
  setColumns,
  setRerenderSignal,
  currentTable,
  setCurrentTable,
  isMobile,
}) => {
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
                user={user}
                table={table}
                currentTable={currentTable}
                setRerenderSignal={setRerenderSignal}
                tables={tables}
                setCurrentTable={setCurrentTable}
                setColumns={setColumns}
                isMobile={isMobile}
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
