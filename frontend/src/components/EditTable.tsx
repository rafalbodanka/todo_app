import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  PopoverContent,
  PopoverHandler,
  Popover,
} from "@material-tailwind/react";
import DeleteTable from "./DeleteTable";
import InviteUser from "./InviteUser";
import TablePermissions from "./TablePermissions";
import { ColumnType, User, TableType } from "./Types";
import CloseIcon from "@rsuite/icons/Close";
import MoreIcon from "@rsuite/icons/More";

type EditTableProps = {
  user: User;
  table: TableType;
  currentTable: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  tables: TableType[];
  setCurrentTable: React.Dispatch<string>;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  isMobile: boolean;
};

const EditTable: React.FC<EditTableProps> = ({
  user,
  table,
  currentTable,
  setRerenderSignal,
  tables,
  setCurrentTable,
  setColumns,
  isMobile,
}) => {
  const [isEditTableModalOpen, setIsEditTableOpen] = useState(false);
  const [EditTableModalMessage, setEditTableModalMessage] = useState("");
  const [prevTableName, setPrevTableName] = useState(table.title);
  const [tableName, setTableName] = useState(table.title);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canInvite, setCanInvite] = useState(false);

  const [tableMembers, setTableMembers] = useState<string[]>([]);

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
    <div className="flex item-center text-black w-4">
      <img
        className={`w-4 cursor-pointer ${
          currentTable === table._id ? "fill-white" : ""
        }`}
        src={
          currentTable === table._id
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
              className="bg-white p-6 rounded-md cursor-default md:w-1/2 md:min-h-1/2 md:min-w-[600px] w-screen"
              onClick={(event) => event.stopPropagation()}
            >
              <div>
                <div className="flex justify-end mb-4 md:mb-0">
                  <div className="flex gap-6">
                    <div>
                      {isAdmin && (
                        <Popover>
                          <PopoverHandler>
                            <button>
                              <MoreIcon className="w-6 h-6 cursor-pointer" />
                            </button>
                          </PopoverHandler>
                          <PopoverContent className="z-40">
                            <div className="flex justify-center items-center">
                              <DeleteTable
                                tableId={table._id}
                                tableTitle={table.title}
                                setRerenderSignal={setRerenderSignal}
                                tables={tables}
                                setCurrentTable={setCurrentTable}
                                setColumns={setColumns}
                              ></DeleteTable>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <div onClick={() => setIsEditTableOpen(false)}>
                      <CloseIcon className="w-6 h-6 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="relative flex w-full max-w-[24rem]">
                  <Input
                    color="deep-purple"
                    value={tableName}
                    label="Title"
                    maxLength={50}
                    onChange={(event) => handleNameOnChange(event, table._id)}
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        updateTableName(tableName, table._id);
                      }
                    }}
                    onBlur={() => updateTableName(tableName, table._id)}
                    className="shadow appearance-none border border-gray-500 rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  ></Input>
                </div>
              </div>
              <div className="flex justify-between">
                {(isAdmin || canInvite) && (
                  <InviteUser
                    tableMembers={tableMembers}
                    user={user}
                    tableId={table._id}
                    tableName={table.title}
                  ></InviteUser>
                )}
              </div>
              <TablePermissions
                user={user}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                canInvite={canInvite}
                setCanInvite={setCanInvite}
                tableId={table._id}
                tableName={table.title}
                tableUsersIds={table.users}
                setTableMembers={setTableMembers}
                setRerenderSignal={setRerenderSignal}
                isMobile={isMobile}
              ></TablePermissions>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditTable;
