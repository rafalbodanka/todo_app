import React, { useState } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { ColumnType, TableType } from "../utils/Types";
import { useAppDispatch } from "../../redux/hooks";
import { setCurrentTable, setColumns } from "../../redux/currentTable";
import { setTables } from "../../redux/tables";

type DeleteTableProps = {
  tableId: string;
  tableTitle: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  tables: TableType[];
};

const DeleteTable: React.FC<DeleteTableProps> = ({
  tableId,
  tableTitle,
  setRerenderSignal,
  tables,
}) => {
  const dispatch = useAppDispatch();
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
        dispatch(setCurrentTable(tables[0]));
      } else {
        if (tables.length > 1) {
          dispatch(setCurrentTable(tables[1]));          
        }
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
        const tables = response.data.data
        dispatch(setTables(tables))
        tables.length > 1 &&
        dispatch(setCurrentTable(tables[0]))
        setDeleteModalMessage("Table deleted succesfully");
        setIsDeleteResponseModalOpen(true);
        setDeleteModalAction(true);
        if (tables.length === 0) {
          setColumns([])
        }
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
      <div
        className="flex justify-center items-center cursor-pointer text-black"
        onClick={openDeleteTableModal}
      >
        <p className="hover:text-red-400">Delete table</p>
      </div>
      {isDeleteModalOpen && (
        <div
          className="w-screen h-screen bg-black bg-opacity-30 fixed top-0 left-0 flex justify-center items-center z-10"
          onClick={closeDeleteTableModal}
        >
          <div className="bg-white rounded-md text-black">
            <div className="p-6 text-center">
              <p className="font-400">
                Do you want to delete table{" "}
                <span className="font-700">{tableTitle}</span>?
              </p>
              <div className="grid grid-cols-2 gap-12">
                <Button
                  onClick={performDelete}
                  className="bg-purple-900 p-2 pl-6 pr-6 rounded-md mt-4 text-white shadow-gray-400 hover:shadow-gray-400"
                >
                  Yes
                </Button>
                <Button
                  onClick={closeDeleteTableModal}
                  className="bg-purple-900 p-2 pl-6 pr-6 rounded-md mt-4 text-white shadow-gray-400 hover:shadow-gray-400"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isDeleteResponseModalOpen && (
        <div className="w-screen h-screen bg-black bg-opacity-30 fixed top-0 left-0 flex justify-center items-center z-10">
          <div className="bg-white rounded-md">
            <div className="p-6 text-center text-black">
              <p>{deleteModalMessage}</p>
              <Button
                onClick={(e) => handleDeleteModalAction(e)}
                className="bg-purple-900 p-2 pl-6 pr-6 rounded-md mt-4 text-white shadow-gray-400 hover:shadow-gray-400"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTable;
