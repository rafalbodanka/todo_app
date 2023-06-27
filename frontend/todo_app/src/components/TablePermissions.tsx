import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Checkbox,
  Typography,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import RemoveMember from "./RemoveMember";
import MembersPagination from "./MembersPagination";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
}

type TablePermissionsProps = {
  user: User;
  tableId: string;
  tableName: string;
  tableUsersIds: User[];
  setTableMembers: React.Dispatch<React.SetStateAction<string[]>>;
};

const TablePermissions: React.FC<TablePermissionsProps> = ({
  user,
  tableId,
  tableName,
  tableUsersIds,
  setTableMembers,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const TABLE_HEAD = ["Member", "Level", "Can invite", "Admin", "Remove"];
  const [membersRerenderSignal, setMembersRerenderSignal] = useState(false);

  //pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // CONST PAGE SIZE
  const pageSize = 5;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  //fetch table members data
  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/tables/${tableId}/members`,
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setMembers(response.data.data);
          const membersWithEmail = response.data.data.map(
            (member: User) => member.email
          );
          setTableMembers(membersWithEmail);
        }
      } catch (err: any) {}
    };
    fetchMembersData();
  }, [membersRerenderSignal]);

  useEffect(() => {
    // Find the index of the current user in the members array
    const currentUserIndex = members.findIndex(
      (member: User) => member._id === user._id
    );

    // Move the current user to the first position in the array
    if (currentUserIndex !== -1 && currentUserIndex !== 0) {
      const currentUser = members[currentUserIndex];
      const updatedMembers = [
        currentUser,
        ...members.slice(0, currentUserIndex),
        ...members.slice(currentUserIndex + 1),
      ];
      setMembers(updatedMembers);
    }
  }, [members]);

  return (
    <>
      <CardBody className="px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members
                .slice(startIndex, endIndex)
                .map(
                  (
                    { _id, email, firstName, lastName, level, userIconId },
                    index
                  ) => {
                    const isLast = index === members.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={email} className="">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={`./userIcons/${userIconId}.svg`}
                              alt={`${firstName} ${lastName} icon`}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {firstName} {lastName}{" "}
                                {user._id === _id && (
                                  <span className="font-700">(Me)</span>
                                )}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {level}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Checkbox
                            id={`${email}-can-invite`}
                            color="deep-purple"
                          ></Checkbox>{" "}
                        </td>
                        <td className={classes}>
                          <Checkbox
                            id={`${email}-is-admin`}
                            color="deep-purple"
                          ></Checkbox>
                        </td>
                        <td className={classes}>
                          <div className="ml-4">
                            {user._id !== _id && (
                              <RemoveMember
                                memberId={_id}
                                memberName={firstName + " " + lastName}
                                memberEmail={email}
                                tableId={tableId}
                                tableName={tableName}
                                membersRerenderSignal={membersRerenderSignal}
                                setMembersRerenderSignal={
                                  setMembersRerenderSignal
                                }
                              ></RemoveMember>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
            ) : (
              // loading animation
              <>
                {[...Array(3)].map((_, index) => (
                  <tr key={index}>
                    <td className="p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-gray-200 rounded-full" />
                        <div className="flex flex-col">
                          <div className="w-16 h-4 bg-blue-gray-200 rounded" />
                          <div className="w-24 h-3 mt-2 bg-blue-gray-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <div className="w-16 h-4 bg-blue-gray-200 rounded" />
                          <div className="w-24 h-3 mt-2 bg-blue-gray-200 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </CardBody>
      <MembersPagination
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        members={members}
        setMembersRerenderSignal={setMembersRerenderSignal}
      ></MembersPagination>
    </>
  );
};

export default TablePermissions;
