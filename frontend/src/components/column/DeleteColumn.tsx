import React, { useState } from "react";
import axios from "axios";
import { setCurrentTable } from "../../redux/currentTable";
import { useAppDispatch } from "../../redux/hooks";
import ConnectionErrorModal from "../utils/ConnectionErrorModal";

type DeleteColumnProps = {
  columnTitle: string;
  columnId: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteColumn: React.FC<DeleteColumnProps> = ({
  columnId,
  columnTitle,
  setRerenderSignal,
}) => {
  const dispatch = useAppDispatch()
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [deleteColumnMessage, setDeleteColumnMessage] = useState("");
  const [isDeleteErrorModalVisible, setIsDeleteErrorModalVisible] = useState(false)
  const [deleteErrorModalMessage, setDeleteErrorModalMessage] = useState("Something went wrong.")

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
    closeDeleteColumnModal()
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
        dispatch(setCurrentTable(response.data.data));
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      setIsDeleteErrorModalVisible(true)
      if (err.response && err.response.status === 404) {
        setDeleteErrorModalMessage("Column not found");
      } else {
        setDeleteErrorModalMessage(`Something went wrong with deleting column "${columnTitle}"`);
      }
    }
  };

  return (
    <>
      <button
        className="cursor-pointer"
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
            <div className="grid grid-cols-2 gap-8 text-white">
              <button
                className="bg-purple-900 p-2 pl-6 pr-6 rounded-md mt-4"
                onClick={(e) => deleteColumn(e)}
              >
                Yes
              </button>
              <button
                className="bg-purple-900 p-2 pl-6 pr-6 rounded-md mt-4"
                onClick={closeDeleteColumnModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteErrorModalVisible && <ConnectionErrorModal message={deleteErrorModalMessage} setIsError={setIsDeleteErrorModalVisible}></ConnectionErrorModal>}
    </>
  );
};

export default DeleteColumn;
