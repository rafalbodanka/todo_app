import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { User, Member } from "../utils/Types";
import { useAppSelector,  useAppDispatch } from "../../redux/hooks";
import { selectUser } from "../../redux/user";
import { selectTables, setTables } from "../../redux/tables";
import { setCurrentTable } from "../../redux/currentTable";
import crossMark from "../../images/icon-cross-mark.png"


type RemoveMemberProps = {
  currentUser: User;
  members: Member[];
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPermission: string;
  isAdmin: Boolean;
  tableId: string;
  tableName: string;
  membersRerenderSignal: boolean;
  setMembersRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const RemoveMember: React.FC<RemoveMemberProps> = ({
  currentUser,
  members,
  memberId,
  memberName,
  memberEmail,
  memberPermission,
  isAdmin,
  tableId,
  tableName,
  membersRerenderSignal,
  setMembersRerenderSignal,
  setRerenderSignal,
}) => {
  const tables = useAppSelector(selectTables)
  const dispatch = useAppDispatch()
  const [openPopover, setOpenPopover] = React.useState(false);
  const [isRemovePossible, setIsRemovePossible] = useState(true);
  const [isLastLeavingUser, setIsLastLeavingUser] = useState(false);

  const openRemoveMemberModalOpen = () => {
    // Check if this is the last admin of the table - last admin before leaving the table
    // has to nominate new admin before leaving
    setIsRemovePossible(true);
    setIsLastLeavingUser(false);
    if (
      isAdmin &&
      memberPermission === "admin" &&
      members.filter((member) => member.permission === "admin").length === 1
    ) {
      setIsRemovePossible(false);
    }

    if (members.length === 1) {
      setIsRemovePossible(true);
      setIsLastLeavingUser(true);
    }
  };

  const closeRemoveMemberModal = () => {
    setOpenPopover(false);
  };

  const removeMember = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/tables/${tableId}/remove-member/`,
        { memberId: memberId },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (isLastLeavingUser && tables.length === 1) {
          dispatch(setTables(response.data.data));
        }
        if (tables.length > 1) {
          dispatch(setCurrentTable(tables[0]))
        }
      }
    } catch (err: any) {} finally {
      if (!isLastLeavingUser) {
        setMembersRerenderSignal((prevSignal) => !prevSignal);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
      }
      closeRemoveMemberModal();
    }

  return (
    <Popover open={openPopover} handler={setOpenPopover} placement="top">
      <PopoverHandler>
        <button>
          <img
            id="remove-user"
            src={crossMark}
            className="w-4 cursor-pointer"
            onClick={openRemoveMemberModalOpen}
          ></img>
        </button>
      </PopoverHandler>
      <PopoverContent className="z-40 max-w-screen text-sm text-black">
        <div>
          <div className="bg-white rounded-md text-center">
            {isLastLeavingUser ? (
              <div>
                <p className="font-400 flex justify-center">
                  <span>
                    Do you want to leave table&nbsp;
                    <span className="font-700">{tableName}</span>?
                  </span>
                </p>
                <p className="font-400 mt-2">
                  This table will be removed, because you are the only member.
                  Are you sure?
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 mt-2 gap-8 w-64">
                    <Button
                      className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
                      onClick={(e) => removeMember(e)}
                    >
                      Yes
                    </Button>
                    <Button
                      className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
                      onClick={closeRemoveMemberModal}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            ) : isRemovePossible ? (
              <div>
                <p className="font-400">
                  {currentUser._id === memberId ? (
                    <>
                      Do you want to leave table&nbsp;
                      <span className="font-700">{tableName}</span>?
                    </>
                  ) : (
                    <>
                      Do you want to remove&nbsp;
                      <span className="font-700">
                        {memberName.length > 1 ? memberName : memberEmail}
                      </span>
                      &nbsp;from table&nbsp;
                      <span className="font-700">{tableName}</span>?
                    </>
                  )}
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 mt-2 gap-8 w-64">
                    <Button
                      className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
                      onClick={(e) => removeMember(e)}
                    >
                      Yes
                    </Button>
                    <Button
                      className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
                      onClick={closeRemoveMemberModal}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-400">
                  The only admin has to nominate new admin before leaving the
                  table.
                </p>
                <div className="flex justify-center">
                  <Button
                    className="bg-purple-900 shadow-gray-400 hover:shadow-gray-400 p-2 pl-6 pr-6 rounded-md mt-4"
                    onClick={closeRemoveMemberModal}
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveMember;
