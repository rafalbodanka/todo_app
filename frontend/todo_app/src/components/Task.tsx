import React, { useState } from "react";
import axios from "axios";

import EditTask from "./EditTask";

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
}

interface TaskProps {
  task: TaskData;
  taskIndex: Number;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Task: React.FC<TaskProps> = ({ task, taskIndex, setRerenderSignal }) => {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const openEditTaskModal = () => {
    setIsEditTaskModalOpen(true);
  };

  const toggleTaskStatus = async (taskId: string, taskIndex: Number) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/status`,
        {},
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("gituwa");
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
            toggleTaskStatus(task._id, taskIndex);
          }}
        />
        <div className="ml-2 min-w-1">{task.title}</div>
      </div>
      <EditTask
        task={task}
        isEditTaskModalOpen={isEditTaskModalOpen}
        setIsEditTaskModalOpen={setIsEditTaskModalOpen}
        setRerenderSignal={setRerenderSignal}
      />
    </div>
  );
};

export default Task;
