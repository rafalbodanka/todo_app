import React, { useState } from "react";
import axios from "axios";

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
}

interface ColumnData {
  _id: string;
  title: string;
  tasks: TaskData[];
  showCompletedTasks: boolean;
}

interface EditTaskProps {
  task: TaskData;
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTask: React.FC<EditTaskProps> = ({
  task,
  isEditTaskModalOpen,
  setIsEditTaskModalOpen,
  setRerenderSignal,
}) => {
  const [isDeleteTaskModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTaskModalMessage, setDeleteTaskModalMessage] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState(task.title);
  const [prevTaskTitle, setPrevTaskTitle] = useState(task.title);

  const handleTitleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => {
    setNewTaskTitle(event.target.value);
  };

  const setTaskTitle = async (newTitle: string, taskId: string) => {
    if (prevTaskTitle === newTaskTitle) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/name`,
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
        setPrevTaskTitle(newTaskTitle);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  const deleteTask = (taskTitle: string) => {
    setDeleteTaskModalMessage(taskTitle);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/delete`,
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
        setIsEditTaskModalOpen(false);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        console.log("Task not found");
      } else {
        console.log(`Something went wrong, try again`);
      }
    }
  };

  const closeEditTaskModal = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      setIsEditTaskModalOpen(false);
      setNewTaskTitle(task.title);
    }
  };

  if (!isEditTaskModalOpen) {
    return null;
  }

  return (
    isEditTaskModalOpen && (
      <>
        <div
          className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20 cursor-default"
          onMouseDown={closeEditTaskModal}
        >
          <div
            className="bg-white p-6 rounded-md cursor-default"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <div className="flex justify-end">
                <img
                  src={process.env.PUBLIC_URL + "/icon-trash.svg"}
                  alt="Trash Icon"
                  onClick={() => {
                    deleteTask(task.title);
                  }}
                  className="w-6 cursor-pointer"
                />
              </div>
              <p>Title</p>
              <input
                value={newTaskTitle}
                maxLength={100}
                onChange={(event) => handleTitleOnChange(event, task._id)}
                onKeyDown={(
                  event: React.KeyboardEvent<HTMLParagraphElement>
                ) => {
                  if (
                    event.key === "Backspace" ||
                    event.key === "Delete" ||
                    event.key === "ArrowLeft" ||
                    event.key === "ArrowRight"
                  ) {
                  } else if (
                    event.currentTarget.textContent &&
                    event.currentTarget.textContent.length > 60
                  ) {
                    event.preventDefault();
                  } else if (event.key === "Enter" || event.key === "Escape") {
                    event.currentTarget.blur();
                  }
                }}
                onBlur={() => setTaskTitle(newTaskTitle, task._id)}
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              ></input>
            </div>
          </div>
          {isDeleteTaskModalOpen && (
            <div
              className="w-screen h-screen flex fixed top-0 left-0 justify-center items-center bg-black bg-opacity-30 z-10"
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteModalOpen(false);
              }}
            >
              <div className="bg-white p-6 rounded-md">
                <p className="font-400">
                  Do you want to delete task{" "}
                  <span className="font-700">{deleteTaskModalMessage}</span>?
                </p>
                <div className="grid grid-cols-2 mt-6 gap-8">
                  <button
                    className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(task._id);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDeleteModalOpen(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  );
};

export default EditTask;
