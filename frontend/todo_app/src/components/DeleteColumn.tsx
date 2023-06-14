import React from "react";

type DeleteColumnProps = {
    closeDeleteColumnModal: React.MouseEventHandler;
    columnSelectedToDelete: string;
    deleteColumnMessage: string;
    columns: any[];
    deleteColumn: (columnId: string) => void;
};

const DeleteColumn: React.FC<DeleteColumnProps> = ({ closeDeleteColumnModal, columnSelectedToDelete, deleteColumnMessage, deleteColumn }) => {

    return (
        <div className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-10" onClick={closeDeleteColumnModal}>
            <div className="bg-white p-6 rounded-md" onClick={(event) => event.stopPropagation()}>
                <p className="font-400">Do you want to delete <span className="font-700">{deleteColumnMessage}</span>?</p>
                <div className="grid grid-cols-2 mt-6">
                    <button onClick={() => deleteColumn(columnSelectedToDelete)}>Yes</button>
                    <button onClick={closeDeleteColumnModal}>No</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteColumn;