import React, { useState } from "react";
import axios, { AxiosError } from "axios";

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

type DeleteTableProps = {
  tableId: string;
  tableTitle: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  tables: TableProps[];
  setCurrentTable: React.Dispatch<string>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

const DeleteTable: React.FC<DeleteTableProps> = ({
  tableId,
  tableTitle,
  setRerenderSignal,
  tables,
  setCurrentTable,
  setColumns,
}) => {
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [isDeleteResponseModalOpen, setIsDeleteResponseModalOpen] =
    useState(false);
  const [deleteModalAction, setDeleteModalAction] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteModalAction = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (deleteModalAction) {
      // Perform the action and update the current table and rerender
      setRerenderSignal((prevSignal) => !prevSignal);
      if (tableId !== tables[0]._id) {
        setCurrentTable(tables[0]._id);
      } else {
        setCurrentTable(tables.length > 1 ? tables[1]._id : "");
      }
    }

    // Close the modal and reset the action state
    setIsDeleteResponseModalOpen(false);
    setDeleteModalAction(false);
  };

  const openDeleteTableModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteTableModal = () => {
    setIsDeleteModalOpen(false);
  };

  const performDelete = async () => {
    console.log(tableId);

    if (!tableId) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/tables/delete/${tableId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setDeleteModalMessage("Table deleted succesfully");
        setIsDeleteResponseModalOpen(true);
        setDeleteModalAction(true);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setDeleteModalMessage("Table not found");
        setIsDeleteResponseModalOpen(true);
        setDeleteModalAction(false);
      } else {
        setDeleteModalMessage(`Something went wrong, try again`);
        setIsDeleteResponseModalOpen(true);
        setDeleteModalAction(false);
      }
    }
  };
  return (
    <>
      <img
        className="w-1/6 cursor-pointer"
        src={process.env.PUBLIC_URL + "/icon-trash.svg"}
        alt="Trash Icon"
        onClick={openDeleteTableModal}
      ></img>
      {isDeleteModalOpen && (
        <div
          className="w-screen h-screen bg-black bg-opacity-30 absolute top-0 left-0 flex justify-center items-center z-10"
          onClick={closeDeleteTableModal}
        >
          <div className="bg-white rounded-md">
            <div className="p-6 text-center">
              <p className="font-400">
                Do you want to delete table{" "}
                <span className="font-700">{tableTitle}</span>?
              </p>
              <div className="grid grid-cols-2 mt-6 gap-12">
                <button
                  onClick={performDelete}
                  className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                >
                  Yes
                </button>
                <button
                  onClick={closeDeleteTableModal}
                  className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isDeleteResponseModalOpen && (
        <div className="w-screen h-screen bg-black bg-opacity-30 absolute top-0 left-0 flex justify-center items-center z-10">
          <div className="bg-white rounded-md">
            <div className="p-6 text-center">
              <p>{deleteModalMessage}</p>
              <button
                onClick={(e) => handleDeleteModalAction(e)}
                className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTable;
