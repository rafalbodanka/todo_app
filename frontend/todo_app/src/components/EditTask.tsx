import React, { useState } from "react";
import axios from "axios";

import EditTaskAssignUser from "./EditTaskAssignUser";

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

interface ColumnData {
  _id: string;
  title: string;
  tasks: TaskData[];
  showCompletedTasks: boolean;
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

interface EditTaskProps {
  task: TaskData;
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDraggingPossible: React.Dispatch<React.SetStateAction<boolean>>;
  currentTableId: string;
  responsibleUsers: User[];
  setResponsibleUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const EditTask: React.FC<EditTaskProps> = ({
  task,
  isEditTaskModalOpen,
  setIsEditTaskModalOpen,
  setRerenderSignal,
  setIsDraggingPossible,
  currentTableId,
  responsibleUsers,
  setResponsibleUsers,
}) => {
  const [isDeleteTaskModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTaskModalMessage, setDeleteTaskModalMessage] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState(task.title);
  const [prevTaskTitle, setPrevTaskTitle] = useState(task.title);

  const decodedNotes = task.notes.replace(/\|\|/g, "\n");
  const [newTaskNotes, setNewTaskNotes] = useState(decodedNotes);
  const [prevTaskNotes, setPrevTaskNotes] = useState(decodedNotes);

  //handling task timestamps
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const createdAtDate = new Date(task.createdAt);
  const createdAt = createdAtDate.toLocaleDateString(undefined, options);

  const updatedAtDate = new Date(task.updatedAt);
  const updatedAt = updatedAtDate.toLocaleDateString(undefined, options);

  //handling title changes
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

  // handling notes changes
  const handleNotesOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    taskId: string
  ) => {
    setNewTaskNotes(event.target.value);
  };

  const updateNotes = async (taskId: string, newNotes: string) => {
    if (prevTaskNotes === newNotes) {
      return;
    }

    //replacing new lines with special character before sending to backend
    const formattedNotes = newNotes.trim().replace(/\n/g, "||");

    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/notes`,
        {
          newNotes: formattedNotes,
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
        setPrevTaskNotes(newTaskNotes);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  //handling deleting task
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
        setRerenderSignal((prevSignal) => !prevSignal);
        setIsEditTaskModalOpen(false);
      }
    } catch (err: any) {}
  };

  //closing edit task modal
  const closeEditTaskModal = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      setIsEditTaskModalOpen(false);
      setNewTaskTitle(task.title);
      setIsDraggingPossible(true);
    }
  };

  if (!isEditTaskModalOpen) {
    return null;
  }

  return (
    isEditTaskModalOpen && (
      <div>
        <div
          className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-30 cursor-default"
          onMouseDown={(event) => {
            closeEditTaskModal(event);
            if (event.currentTarget === event.target) {
              updateNotes(task._id, newTaskNotes);
              setTaskTitle(newTaskTitle, task._id);
            }
          }}
        >
          <div
            className="bg-white p-6 rounded-md cursor-default w-1/3 h-1/2"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <div className="grid grid-cols-2 font-400 text-xs text-gray-600">
                <div>
                  <p>
                    <span>Created on {createdAt}</span>
                  </p>
                  <p>
                    {task.createdAt !== task.updatedAt && (
                      <span>Updated on {updatedAt}</span>
                    )}
                  </p>
                </div>
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
              </div>
              <div className="mt-4">
                <p className="font-400">Title</p>
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
                    } else if (
                      event.key === "Enter" ||
                      event.key === "Escape"
                    ) {
                      event.currentTarget.blur();
                    }
                  }}
                  onBlur={() => setTaskTitle(newTaskTitle, task._id)}
                  className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ></input>
                <p className="font-400 mt-4">Notes</p>
                <textarea
                  value={newTaskNotes}
                  maxLength={500}
                  onChange={(event) => handleNotesOnChange(event, task._id)}
                  onBlur={() => updateNotes(task._id, newTaskNotes)}
                  className="shadow appearance-none border border-gray-500 rounded w-full h-24 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline resize-none"
                ></textarea>
              </div>
              <EditTaskAssignUser
                responsibleUsers={responsibleUsers}
                setResponsibleUsers={setResponsibleUsers}
                currentTableId={currentTableId}
                task={task}
              ></EditTaskAssignUser>
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
      </div>
    )
  );
};

export default EditTask;
