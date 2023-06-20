import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { Button } from "@material-tailwind/react";

import Login from "./components/Login";
import Register from "./components/Register";
import Auth from "./components/Auth";
import Column from "./components/Column";
import Set from "./components/Set";
import { table } from "console";
import EditTable from "./components/EditTable";
import UserNav from "./components/UserNav";

type ColumnData = {
  _id: string;
  title: string;
  pendingTasks: Task[];
  completedTasks: Task[];
  showCompletedTasks: boolean;
};

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [rerenderSignal, setRerenderSignal] = useState(false);
  const [currentTable, setCurrentTable] = useState("");

  const [tables, setTables] = useState([]);

  const getUserSet = async () => {
    if (!username) return;
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
  }, [username, rerenderSignal]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Register} />
          <Route
            path="/"
            element={
              <Auth setUsername={setUsername}>
                <div className="w-screen h-screen font-Roboto font-500">
                  <div className="">
                    <div className="p-4">
                      <div className="grid grid-cols-8">
                        <div className="col-span-6 items-end">
                          <div className="scrollable-container overflow-x-auto whitespace-nowrap h-full">
                            <Set
                              tables={tables}
                              setColumns={setColumns}
                              setRerenderSignal={setRerenderSignal}
                              currentTable={currentTable}
                              setCurrentTable={setCurrentTable}
                            ></Set>
                          </div>
                        </div>
                        <div className="col-span-2 p-6 flex justify-center">
                          <UserNav username={username}></UserNav>
                        </div>
                      </div>
                    </div>
                    {currentTable && (
                      <div className="flex max-w-full">
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
              </Auth>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
