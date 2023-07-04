import React, { useEffect, useState } from "react";
import axios from "axios";
import Set from "./Set";
import Column from "./Column";
import UserNav from "./UserNav";

type ColumnData = {
  _id: string;
  title: string;
  pendingTasks: TaskData[];
  completedTasks: TaskData[];
  showCompletedTasks: boolean;
};

type TaskData = {
  _id: string;
  title: string;
  completed: boolean;
  column: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  responsibleUsers: User[];
};

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
  createdAt: string;
  updatedAt: string;
}

interface TableProps {
  user: User;
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Table: React.FC<TableProps> = ({
  user,
  rerenderSignal,
  setRerenderSignal,
}) => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [currentTable, setCurrentTable] = useState("");

  const [tables, setTables] = useState([]);

  const getUserSet = async () => {
    if (!user.email) return;
    try {
      const response = await axios.get("https://todo-app-ten-ivory.vercel.app/tables/tables", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setTables(response.data);
        let newColumns; // Define newColumns variable
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
          // Check if newColumns is defined
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
      <div className="">
        <div className="p-4">
          <div className="grid grid-cols-8">
            <div className="col-span-6 items-end">
              <div className="scrollable-container overflow-x-auto whitespace-nowrap h-full">
                <Set
                  user={user}
                  tables={tables}
                  setColumns={setColumns}
                  setRerenderSignal={setRerenderSignal}
                  currentTable={currentTable}
                  setCurrentTable={setCurrentTable}
                ></Set>
              </div>
            </div>
            <div className="col-span-2 p-6 flex justify-center">
              {user.email && <UserNav user={user}></UserNav>}
            </div>
          </div>
        </div>
        {currentTable && (
          <div className="flex max-w-screen overflow-x-auto scrollbar-thin">
            <Column
              columns={columns}
              setColumns={setColumns}
              setRerenderSignal={setRerenderSignal}
              currentTable={currentTable}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
