import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Member } from "./Types";

import {
  Checkbox,
  Select,
  Option,
  Typography,
  CardBody,
  Avatar,
  Button,
} from "@material-tailwind/react";
import RemoveMember from "./RemoveMember";
import MembersPagination from "./MembersPagination";

type TablePermissionsProps = {
  user: User;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  canInvite: boolean;
  setCanInvite: React.Dispatch<React.SetStateAction<boolean>>;
  tableId: string;
  tableName: string;
  tableUsersIds: User[];
  setTableMembers: React.Dispatch<React.SetStateAction<string[]>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

const TablePermissions: React.FC<TablePermissionsProps> = ({
  user,
  isAdmin,
  setIsAdmin,
  canInvite,
  setCanInvite,
  tableId,
  tableName,
  tableUsersIds,
  setTableMembers,
  setRerenderSignal,
  isMobile,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [membersRerenderSignal, setMembersRerenderSignal] = useState(false);

  const TABLE_HEAD = ["Member", "Level", "Permissions", "Remove"];
  const MOBILE_TABLE_HEAD = ["Member", "Permissions", "Remove"];
  const RENDER_HEAD = isMobile ? MOBILE_TABLE_HEAD : TABLE_HEAD;
  const currentUser = user;

  //pagination state
  const pageSize = isMobile ? 3 : 5;
  const [totalPages, setTotalPages] = useState(
    Math.ceil(members.length / pageSize)
  );
  const [currentPage, setCurrentPage] = useState(1);
  // CONST PAGE SIZE
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  //on members change count total pages
  useEffect(() => {
    setTotalPages(Math.ceil(members.length / pageSize));
    console.log(Math.ceil(members.length / pageSize));
  }, [members]);

  const [isPermissionEditModalVisible, setIsPermissionEditModalVisible] =
    useState(false);

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
      (member: Member) => member.user._id === user._id
    );

    //check and set admin
    const checkAdmin = members.some(
      (member) => member.user._id === user._id && member.permission === "admin"
    );
    setIsAdmin(checkAdmin);

    //check and set admin
    const checkCanInvite = members.some(
      (member) => member.user._id === user._id && member.permission === "invite"
    );
    setCanInvite(checkCanInvite);

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

  //updating the permission
  const handleOnPermissionEdit = async (
    event: any,
    userId: string,
    permission: string
  ) => {
    const newPermission = event;
    //return if permission is the same
    if (newPermission === permission) return;

    //local hot update
    setMembers((members) => {
      const newMembers = members.map((member) => {
        if (member.user._id === userId) {
          if (member.permission === "admin") {
            member.permission = "admin";
          }
          member.permission = newPermission;
        }
        return member;
      });
      return newMembers;
    });

    try {
      const response = await axios.post(
        `http://localhost:5000/tables/${tableId}/permissions/`,
        { userId: userId, newPermission: newPermission },
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
      } else {
        setIsPermissionEditModalVisible(true);
      }
    } finally {
      setMembersRerenderSignal((prevSignal) => !prevSignal);
    }
  };

  return (
    <>
      <CardBody className="px-0 md:p-0 pt-6 md:pt-6">
        <table className="w-screen md:w-full min-w-max table-auto -translate-x-6 md:translate-x-0 text-left">
          <thead>
            <tr>
              {RENDER_HEAD.map((head) => (
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
                .map(({ user, permission }, index) => {
                  const isCurrentUser = user._id === currentUser._id;
                  const canRemove = isAdmin || isCurrentUser;
                  const isLast = index === members.length - 1;
                  const isLastAdmin =
                    isAdmin &&
                    permission === "admin" &&
                    members.filter((member) => member.permission === "admin")
                      .length === 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={user.email} className="">
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={`./userIcons/${user.userIconId}.svg`}
                            alt={`${user.firstName} ${user.lastName} icon`}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.firstName} {user.lastName}{" "}
                              {user._id === currentUser._id && (
                                <span className="font-700">(Me)</span>
                              )}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {user.email}
                            </Typography>
                            {isMobile && (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {user.level}
                              </Typography>
                            )}
                          </div>
                        </div>
                      </td>
                      {!isMobile && (
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.level ? user.level : ""}
                            </Typography>
                          </div>
                        </td>
                      )}
                      <td className={classes}>
                        {isAdmin ? (
                          <Select
                            variant="standard"
                            containerProps={{
                              className: "min-w-[40px]",
                            }}
                            color="deep-purple"
                            disabled={isLastAdmin}
                            size="md"
                            value={permission}
                            onChange={(event) =>
                              handleOnPermissionEdit(
                                event,
                                user._id,
                                permission
                              )
                            }
                          >
                            <Option value="invite">invite</Option>
                            <Option value="admin">admin</Option>
                            <Option value="none">none</Option>
                          </Select>
                        ) : (
                          <p className="font-400 text-[14px]">
                            {permission === "none" ? "" : permission}
                          </p>
                        )}
                        {isPermissionEditModalVisible && (
                          <div
                            className="fixed top-0 left-0 flex justify-center bg-black bg-opacity-30 w-screen h-screen items-center"
                            onClick={() =>
                              setIsPermissionEditModalVisible(false)
                            }
                          >
                            <div
                              className="bg-white p-8 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p>
                                You have no permission to edit other members
                              </p>
                              <div className="flex justify-center mt-4">
                                <Button
                                  color="deep-purple"
                                  onClick={() =>
                                    setIsPermissionEditModalVisible(false)
                                  }
                                >
                                  OK
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className={classes}>
                        <div className="ml-4">
                          {canRemove && (
                            <RemoveMember
                              user={user}
                              currentUser={currentUser}
                              members={members}
                              memberId={user._id}
                              memberName={user.firstName + " " + user.lastName}
                              memberEmail={user.email}
                              memberPermission={permission}
                              isAdmin={isAdmin}
                              tableId={tableId}
                              tableName={tableName}
                              membersRerenderSignal={membersRerenderSignal}
                              setMembersRerenderSignal={
                                setMembersRerenderSignal
                              }
                              setRerenderSignal={setRerenderSignal}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
      {totalPages > 1 && (
        <MembersPagination
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          members={members}
          setMembersRerenderSignal={setMembersRerenderSignal}
        ></MembersPagination>
      )}
    </>
  );
};

export default TablePermissions;
