import React, { useState } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

type RemoveMemberProps = {
  memberId: string;
  memberName: string;
  memberEmail: string;
  tableId: string;
  tableName: string;
  membersRerenderSignal: boolean;
  setMembersRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const RemoveMember: React.FC<RemoveMemberProps> = ({
  memberId,
  memberName,
  memberEmail,
  tableId,
  tableName,
  membersRerenderSignal,
  setMembersRerenderSignal,
}) => {
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);

  const openRemoveMemberModalOpen = () => {
    setIsRemoveMemberModalOpen(true);
  };

  const closeRemoveMemberModal = () => {
    setIsRemoveMemberModalOpen(false);
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
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        throw new Error("Table not found");
      } else {
        throw err;
      }
    } finally {
      setMembersRerenderSignal((prevSignal) => !prevSignal);
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
            <p className="font-400">
              Do you want to remove&nbsp;
              <span className="font-700">
                {memberName.length > 1 ? memberName : memberEmail}
              </span>
              &nbsp;from table&nbsp;
              <span className="font-700">{tableName}</span>?
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
        </div>
      )}
    </>
  );
};

export default RemoveMember;
