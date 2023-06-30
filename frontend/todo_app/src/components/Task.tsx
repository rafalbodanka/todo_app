import React, { useState } from "react";
import axios from "axios";

import EditTask from "./EditTask";

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
  column: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskProps {
  task: TaskData;
  taskIndex: Number;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  isDraggingPossible: boolean;
  setIsDraggingPossible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Task: React.FC<TaskProps> = ({
  task,
  taskIndex,
  setRerenderSignal,
  isDraggingPossible,
  setIsDraggingPossible,
}) => {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const openEditTaskModal = () => {
    setIsEditTaskModalOpen(true);
    setIsDraggingPossible(false);
  };

  const toggleTaskStatus = async (
    taskId: string,
    taskIndex: Number,
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
    <div className="task" onClick={openEditTaskModal}>
      <div className="flex">
        <img
          src={task.completed ? "/checkbox-done.png" : "/checkbox-empty.png"}
          alt="checkbox-done"
          className="w-6 max-h-6"
          onClick={(event) => {
            event.stopPropagation();
            toggleTaskStatus(task._id, taskIndex, task.completed, task.column);
          }}
        />
        <div className="ml-2 min-w-1">{task.title}</div>
      </div>
      {isEditTaskModalOpen && (
        <EditTask
          task={task}
          isEditTaskModalOpen={isEditTaskModalOpen}
          setIsEditTaskModalOpen={setIsEditTaskModalOpen}
          setIsDraggingPossible={setIsDraggingPossible}
          setRerenderSignal={setRerenderSignal}
        />
      )}
    </div>
  );
};

export default Task;
