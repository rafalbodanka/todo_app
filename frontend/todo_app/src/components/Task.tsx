import React, { useState, useEffect } from "react";
import axios from "axios";

import EditTask from "./EditTask";
import { Tooltip } from "@material-tailwind/react";

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

interface TaskProps {
  task: TaskData;
  taskIndex: Number;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  isDraggingPossible: boolean;
  setIsDraggingPossible: React.Dispatch<React.SetStateAction<boolean>>;
  currentTableId: string;
  responsibleUsers: User[];
}

const Task: React.FC<TaskProps> = ({
  task,
  taskIndex,
  setRerenderSignal,
  isDraggingPossible,
  setIsDraggingPossible,
  currentTableId,
}) => {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [responsibleUsers, setResponsibleUsers] = useState(
    task.responsibleUsers
  );
  const openEditTaskModal = () => {
    setIsEditTaskModalOpen(true);
    setIsDraggingPossible(false);
  };

  useEffect(() => {
    setResponsibleUsers(task.responsibleUsers);
  }, [task.responsibleUsers]);

  const toggleTaskStatus = async (
    taskId: string,
    taskCompleted: boolean,
    taskColumn: string
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/status`,
        { taskCompleted: taskCompleted, taskColumn: taskColumn },
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
        throw new Error("Task not found");
      } else {
        throw err;
      }
    }
  };

  return (
    <div className="task relative" onClick={openEditTaskModal}>
      <div className="flex">
        <img
          src={task.completed ? "/checkbox-done.png" : "/checkbox-empty.png"}
          alt="checkbox-done"
          className="w-6 max-h-6"
          onClick={(event) => {
            event.stopPropagation();
            toggleTaskStatus(task._id, task.completed, task.column);
          }}
        />
        <div className="ml-2 min-w-1">{task.title}</div>
      </div>
      <div className="absolute right-4 top-3 flex">
        {responsibleUsers.length >= 3 && (
          <Tooltip
            content={`${responsibleUsers[2].firstName} ${
              responsibleUsers[2].lastName
            } ${responsibleUsers.length > 3 ? "and others" : ""}`}
          >
            <div className="relative order-2">
              <img
                alt={`${responsibleUsers[2].firstName} ${responsibleUsers[2].lastName}'s icon`}
                className="w-8"
                src={`./userIcons/${responsibleUsers[2].userIconId}.svg`}
              ></img>
              <img
                alt="icon-layer"
                className="w-8 absolute top-0 left-0 opacity-80 z-0"
                src={`./userIcons/gray-Layer.svg`}
              ></img>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="relative text-white font-700 flex justify-center text-lg h-[32px] items-center">
                  +{responsibleUsers.length - 2}
                </div>
              </div>
            </div>
          </Tooltip>
        )}
        {responsibleUsers.length >= 2 && (
          <Tooltip
            content={`${responsibleUsers[1].firstName} ${responsibleUsers[1].lastName}`}
          >
            <img
              alt={`${responsibleUsers[1].firstName} ${responsibleUsers[1].lastName}'s icon`}
              className={`w-8 z-2 order-1 ${
                responsibleUsers.length > 2 && "translate-x-2"
              }`}
              src={`./userIcons/${responsibleUsers[1].userIconId}.svg`}
            ></img>
          </Tooltip>
        )}

        {responsibleUsers.length >= 1 && (
          <Tooltip
            content={`${responsibleUsers[0].firstName} ${responsibleUsers[0].lastName}`}
          >
            <img
              alt={`${responsibleUsers[0].firstName} ${responsibleUsers[0].lastName}'s icon`}
              className={`w-8 z-3 order-0 ${
                responsibleUsers.length === 2 && "translate-x-2"
              }
            ${responsibleUsers.length > 2 && "translate-x-4"}`}
              src={`./userIcons/${responsibleUsers[0].userIconId}.svg`}
            ></img>
          </Tooltip>
        )}
      </div>
      {isEditTaskModalOpen && (
        <EditTask
          task={task}
          isEditTaskModalOpen={isEditTaskModalOpen}
          setIsEditTaskModalOpen={setIsEditTaskModalOpen}
          setIsDraggingPossible={setIsDraggingPossible}
          setRerenderSignal={setRerenderSignal}
          currentTableId={currentTableId}
          responsibleUsers={responsibleUsers}
          setResponsibleUsers={setResponsibleUsers}
        />
      )}
    </div>
  );
};

export default Task;
