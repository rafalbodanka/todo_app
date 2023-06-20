import React, { useState } from "react";
import axios from "axios";

import DeleteTable from "./DeleteTable";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface User {
  _id: string;
  __v: number;
}

interface Column {
  _id: string;
  title: string;
  pendingTasks: Task[];
  completedTasks: Task[];
  showCompletedTasks: boolean;
}

interface TableProps {
  columns: Column[];
  title: string;
  users: User[];
  __v: number;
  _id: string;
}

type EditTableProps = {
  tableId: string;
  currentTable: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  tables: TableProps[];
  setCurrentTable: React.Dispatch<string>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  tableTitle: string;
};

const EditTable: React.FC<EditTableProps> = ({
  tableId,
  currentTable,
  setRerenderSignal,
  tables,
  setCurrentTable,
  setColumns,
  tableTitle,
}) => {
  const [isEditTableModalOpen, setIsEditTableOpen] = useState(false);
  const [EditTableModalMessage, setEditTableModalMessage] = useState("");
  const [prevTableName, setPrevTableName] = useState(tableTitle);
  const [tableName, setTableName] = useState(tableTitle);

  const handleNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableId: string
  ) => {
    const text = event.target.value;
    const sanitizedValue = text.replace(/(\r\n|\n|\r)/gm, "");
    const truncatedValue = sanitizedValue.substring(0, 50);
    setTableName(truncatedValue);
  };

  const updateTableName = async (newTitle: string, tableId: string) => {
    if (prevTableName === tableName) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/tables/${tableId}/name`,
        {
          newTitle: newTitle,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setPrevTableName(tableName);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  const openEditTaskModal = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      setIsEditTableOpen(true);
    }
  };

  const closeEditTaskModal = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      setTableName(prevTableName);
      setIsEditTableOpen(false);
    }
  };

  return (
    <div className="flex item-center">
      <img
        className={`w-4 cursor-pointer ${
          currentTable === tableId ? "fill-white" : ""
        }`}
        src={
          currentTable === tableId
            ? "./edit-symbol-white.svg"
            : "./edit-symbol.svg"
        }
        onClick={openEditTaskModal}
      ></img>
      {isEditTableModalOpen && (
        <>
          <div
            className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20 cursor-default"
            onMouseDown={closeEditTaskModal}
          >
            <div
              className="bg-white p-6 rounded-md cursor-default"
              onClick={(event) => event.stopPropagation()}
            >
              <div>
                <div className="flex justify-end">
                  <DeleteTable
                    tableId={tableId}
                    tableTitle={tableTitle}
                    setRerenderSignal={setRerenderSignal}
                    tables={tables}
                    setCurrentTable={setCurrentTable}
                    setColumns={setColumns}
                  ></DeleteTable>
                </div>
                <p>Name</p>
                <input
                  value={tableName}
                  maxLength={50}
                  onChange={(event) => handleNameOnChange(event, tableId)}
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      updateTableName(tableName, tableId);
                    }
                  }}
                  onBlur={() => updateTableName(tableName, tableId)}
                  className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ></input>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditTable;