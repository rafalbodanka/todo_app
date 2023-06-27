import React, { useState } from "react";
import axios from "axios";

type DeleteColumnProps = {
  columns: any[];
  columnTitle: string;
  columnId: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteColumn: React.FC<DeleteColumnProps> = ({
  columnId,
  columnTitle,
  columns,
  setRerenderSignal,
}) => {
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [deleteColumnMessage, setDeleteColumnMessage] = useState("");

  const openDeleteColumnModalOpen = () => {
    setIsDeleteColumnModalOpen(true);
    setDeleteColumnMessage(columnTitle);
  };

  const closeDeleteColumnModal = () => {
    setIsDeleteColumnModalOpen(false);
    setDeleteColumnMessage("");
  };

  const deleteColumn = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/columns/delete/${columnId}`,
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
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        throw new Error("Column not found");
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <button
        className="absolute top-0 right-0 pl-2 pr-2 cursor-pointer"
        onClick={(event) => {
          event.preventDefault();
          openDeleteColumnModalOpen();
        }}
      >
        &#8943;
      </button>
      {isDeleteColumnModalOpen && (
        <div
          className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20"
          onClick={closeDeleteColumnModal}
        >
          <div
            className="bg-white p-6 rounded-md"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-400">
              Do you want to delete column{" "}
              <span className="font-700">{deleteColumnMessage}</span>?
            </p>
            <div className="grid grid-cols-2 mt-6 gap-8">
              <button
                className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                onClick={(e) => deleteColumn(e)}
              >
                Yes
              </button>
              <button
                className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                onClick={closeDeleteColumnModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteColumn;
