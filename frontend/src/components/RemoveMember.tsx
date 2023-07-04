import React, { useState } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
}

interface Member {
  user: User;
  permission: string;
}

type RemoveMemberProps = {
  user: User;
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
  user,
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
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
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
    setIsRemoveMemberModalOpen(true);
  };

  const closeRemoveMemberModal = () => {
    setIsRemoveMemberModalOpen(false);
  };

  const removeMember = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://todo-app-ten-ivory.vercel.app/tables/${tableId}/remove-member/`,
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
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        throw new Error("Table not found");
      } else {
        throw err;
      }
    } finally {
      if (isLastLeavingUser) {
        window.location.reload();
      } else {
        setMembersRerenderSignal((prevSignal) => !prevSignal);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
      setIsRemoveMemberModalOpen(false);
    }
  };

  return (
    <>
      <img
        id="remove-user"
        src="./icon-cross-mark.png"
        className="w-4 cursor-pointer"
        onClick={openRemoveMemberModalOpen}
      ></img>
      {isRemoveMemberModalOpen && (
        <div
          className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20"
          onClick={closeRemoveMemberModal}
        >
          <div
            className="bg-white p-6 rounded-md"
            onClick={(event) => event.stopPropagation()}
          >
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
      )}
    </>
  );
};

export default RemoveMember;
