import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import UserSettings from "./UserSettings";
import Set from "./Set";
import Column from "./Column";
import UserNav from "./UserNav";
import Auth from "./Auth";
import Unauthorized from "./Unauthorized";

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

type AuthenticatedRoutesProps = {
  user: any;
  setUser: any;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthenticatedRoutes = ({
  user,
  setUser,
  isLoggedIn,
  setIsLoggedIn,
  rerenderSignal,
  setRerenderSignal,
}: AuthenticatedRoutesProps) => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [currentTable, setCurrentTable] = useState("");

  const [tables, setTables] = useState([]);

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
    <Auth
      setUser={setUser}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    >
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
        />
        <Route
          path="/user"
          element={
            isLoggedIn ? (
              <UserSettings user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Unauthorized />
            ) : (
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
                        {user.email && <UserNav user={user}></UserNav>}
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
            )
          }
        ></Route>
      </Routes>
    </Auth>
  );
};

export default AuthenticatedRoutes;
