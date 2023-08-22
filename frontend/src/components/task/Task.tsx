import React, { useState, useEffect } from "react";
import axios from "axios";
import EditTask from "./EditTask";
import { TaskType } from "../utils/Types";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Tooltip,
} from "@material-tailwind/react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { isMobileValue } from "../../redux/isMobile";
import { setCurrentTable, selectColumns, setColumns } from "../../redux/currentTable";
import _ from 'lodash';
import TaskCheckbox from "./TaskCheckbox";
import grayLayer from "../../images/gray-layer.svg"

interface TaskProps {
  task: TaskType;
  columnId: string;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDraggingPossible: React.Dispatch<React.SetStateAction<boolean>>;
  currentTableId: string;
}

const Task: React.FC<TaskProps> = ({
  task,
  columnId,
  setRerenderSignal,
  setIsDraggingPossible,
  currentTableId,
}) => {
  const isMobile = useAppSelector(isMobileValue)
  const columns = useAppSelector(selectColumns)
  const dispatch = useAppDispatch()

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [responsibleUsers, setResponsibleUsers] = useState(
    task.responsibleUsers
  );
  const [openPopover, setOpenPopover] = React.useState(false);

  //Task popover
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };

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
    taskColumn: string,
    currentTableId: string,
  ) => {
    // instant local change
    const updatedColumns = _.cloneDeep(columns)
    updatedColumns.map((column) => {
      if (column._id === columnId) {
        if (task.completed) {
          column.completedTasks.map(task => {
            if (task._id === taskId) {
              // toggle status
              task.completed = false
              // move task
              const taskArrayIndex = column.completedTasks.findIndex(task => task._id === taskId)
              column.completedTasks.splice(taskArrayIndex, 1)
              column.pendingTasks.unshift(task)
            }
          })
        }
        if (!task.completed) {
          column.pendingTasks.map(task => {
            if (task._id === taskId) {
              column.pendingTasks.map(task => {
                if (task._id === taskId) {
                  // toggle status
                  task.completed = !task.completed
                  // move task
                  const taskArrayIndex = column.pendingTasks.findIndex(task => task._id === taskId)
                  column.pendingTasks.splice(taskArrayIndex, 1)
                  column.completedTasks.unshift(task)
                }
              })
            }
          })
        }
      }
    })

    dispatch(setColumns(updatedColumns))
    
    // axios reguest to apply change
    try {
      const response = await axios.post(
        `http://localhost:5000/tasks/${taskId}/status`,
        { taskCompleted: taskCompleted, taskColumn: taskColumn, currentTableId:currentTableId },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
        console.log(response)
      if (response.status === 200) {
        setRerenderSignal((prevSignal) => !prevSignal);
        console.log(response.data.data)
        dispatch(setCurrentTable(response.data.data))
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
      <div>
        <div
          className={`flex ${responsibleUsers.length > 0 ? "pb-0" : "pb-4"}`}
        >
          <div onClick={(event) => {
              event.stopPropagation();
              toggleTaskStatus(task._id, task.completed, task.column, currentTableId);
            }}>
            <TaskCheckbox task={task}/>
          </div>
          <div className="ml-2 min-w-1 flex items-center">{task.title}</div>
        </div>
        <div className="flex justify-end">
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
                  src={`/userIcons/${responsibleUsers[2].userIconId}.svg`}
                ></img>
                <img
                  alt="icon-layer"
                  className="w-8 absolute top-0 left-0 opacity-80 z-0"
                  src={grayLayer}
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
                src={`/userIcons/${responsibleUsers[1].userIconId}.svg`}
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
                src={`/userIcons/${responsibleUsers[0].userIconId}.svg`}
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
      {task.isEstimated && (
        <div
          className={`absolute w-1 bg-${
            task.difficulty <= 3
              ? "green-500"
              : task.difficulty <= 7
              ? "orange-500"
              : "red-500"
          } right-0 top-0 h-full rounded-r-full`}
        ></div>
      )}
      {!task.completed &&
        task.isEstimated &&
        task.endDate &&
        new Date(task.endDate).setHours(0, 0, 0, 0) <=
          new Date().setHours(0, 0, 0, 0) && (
          <div className="absolute right-0 top-0 translate-x-0.5 -translate-y-1.5 bg-white w-[1em] h-[1em]">
            {isMobile ? (
              <TimeRoundIcon className="w-[1.5em] h-[1.5em]" />
            ) : (
              <Popover
                open={openPopover}
                placement="top"
                handler={setOpenPopover}
              >
                <PopoverContent {...triggers}>
                  {new Date(task.endDate).setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0) ? (
                    <p className="text-red-400 font-bold">
                      Finish time exceeded
                    </p>
                  ) : (
                    <p className="font-bold">Finish time ends today</p>
                  )}
                </PopoverContent>
                <PopoverHandler {...triggers}>
                  <button>
                    <TimeRoundIcon className="w-[1.5em] h-[1.5em]" />
                  </button>
                </PopoverHandler>
              </Popover>
            )}
          </div>
        )}
    </div>
  );
};

export default Task;
