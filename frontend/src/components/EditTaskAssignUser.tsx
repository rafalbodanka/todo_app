import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Button,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
  column: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  responsibleUsers: User[];
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  user: User;
  permission: string;
}

interface EditTaskAssignUserProps {
  currentTableId: string;
  task: TaskData;
  responsibleUsers: User[];
  setResponsibleUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const EditTaskAssignUser: React.FC<EditTaskAssignUserProps> = ({
  currentTableId,
  task,
  responsibleUsers,
  setResponsibleUsers,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [responsibleUsersRerenderSignal, setResponsibleUsersRerenderSignal] =
    useState(false);

  //fetch responsible users
  useEffect(() => {
    const fetchResponsibleUsers = async (
      taskId: string,
      currentTableId: string
    ) => {
      try {
        const response = await axios.post(
          `https://todo-app-ten-ivory.vercel.app/tasks/${taskId}/responsible-users`,
          { currentTableId: currentTableId },
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const users = response.data.data.map((user: Member) => user.user);
          setResponsibleUsers(users);
        }
      } catch (err: any) {}
    };

    fetchResponsibleUsers(task._id, currentTableId);
  }, [responsibleUsersRerenderSignal]);

  //fetch table members data
  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const response = await axios.get(
          `https://todo-app-ten-ivory.vercel.app/tables/${currentTableId}/members`,
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
        }
      } catch (err: any) {}
    };
    fetchMembersData();
  }, [responsibleUsersRerenderSignal]);

  const assignUser = async (taskId: string, userId: string) => {
    //handling adding locally

    //axios request
    try {
      const response = await axios.post(
        `https://todo-app-ten-ivory.vercel.app/tasks/${taskId}/assign-user`,
        { userId: userId },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setResponsibleUsersRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {}
  };

  const removeUser = async (taskId: string, userId: string) => {
    //handling adding locally

    //axios request
    try {
      const response = await axios.post(
        `https://todo-app-ten-ivory.vercel.app/tasks/${taskId}/remove-user`,
        { userId: userId },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setResponsibleUsersRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {}
  };

  return (
    <div>
      <p className="font-400">
        <span>Assigned users</span>
        <span>
          <Popover placement="right">
            <PopoverHandler>
              <Button
                className="ml-2 p-2 h-8 w-8 text-xs hover:shadow-md"
                color="deep-purple"
              >
                +
              </Button>
            </PopoverHandler>
            <PopoverContent className="z-40 p-0">
              <Card className="w-96 mt-2 max-h-64 overflow-y-auto scrollbar-none">
                <List>
                  {members.map((member, index) => {
                    return (
                      <ListItem
                        key={member.user._id}
                        onClick={() => assignUser(task._id, member.user._id)}
                      >
                        <ListItemPrefix>
                          <Avatar
                            variant="circular"
                            alt="candice"
                            src={`/userIcons/${member.user.userIconId}.svg`}
                          />
                        </ListItemPrefix>
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {member.user && member.user.firstName}{" "}
                            {member.user && member.user.lastName}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {member.user.level ? member.user.level : ""}
                          </Typography>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </Card>
            </PopoverContent>
          </Popover>
        </span>
      </p>
      {responsibleUsers.length >= 1 && (
        <Card className="w-96 mt-2 max-h-80 overflow-y-auto scrollbar-none">
          <List>
            {responsibleUsers.map((member) => {
              return (
                <ListItem
                  key={member._id}
                  onClick={() => removeUser(task._id, member._id)}
                >
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src={`/userIcons/${member.userIconId}.svg`}
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {member && member.firstName} {member && member.lastName}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {member.level ? member.level : ""}
                    </Typography>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Card>
      )}
    </div>
  );
};

export default EditTaskAssignUser;
