import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { DraggableStateSnapshot } from "@hello-pangea/dnd";
import { CSSProperties } from "react";
import axios from "axios";

import Task from "./Task";
import AddTask from "./AddTask";
import DeleteColumn from "./DeleteColumn";
import AddColumn from "./AddColumn";

interface ColumnProps {
  columns: ColumnData[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTable: string;
}

interface ColumnData {
  _id: string;
  title: string;
  pendingTasks: TaskData[];
  completedTasks: TaskData[];
  showCompletedTasks: boolean;
}

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
}

const Column: React.FC<ColumnProps> = ({
  columns,
  setColumns,
  setRerenderSignal,
  currentTable,
}) => {
  const handleColumnTitleChange = (
    event: React.ChangeEvent<HTMLParagraphElement>,
    id: string
  ) => {
    const { innerText } = event.currentTarget;
    const sanitizedValue = innerText.replace(/(\r\n|\n|\r)/gm, "");
    const truncatedValue = sanitizedValue.substring(0, 25);
    updateColumnName(id, truncatedValue);
  };

  const updateColumnName = (columnId: string, newTitle: string) => {
    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column._id === columnId) {
          return {
            ...column,
            title: newTitle,
          };
        }
        return column;
      });
    });
  };

  const addTask = (columnId: string) => {
    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column._id === columnId) {
          const newTask = {
            _id: "20",
            title: "new task",
            completed: false,
          };
          return {
            ...column,
            pendingTasks: [newTask, ...column.pendingTasks],
          };
        }
        return column;
      });
    });
  };

  const toggleShowCompletedTasks = async (columnId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/columns/${columnId}/status`,
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
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  interface ResultProps {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: string;
    mode?: string;
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const sourceColumnId = source.droppableId.split("-")[0];
    const destinationColumnId = destination.droppableId.split("-")[0];
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const column = columns.find((column) => column._id === sourceColumnId);
    if (!column) {
      return;
    }

    let changeStatus;

    if (
      source.droppableId.split("-")[1] !== destination.droppableId.split("-")[1]
    ) {
      changeStatus = true;
    } else {
      changeStatus = false;
    }

    // column.tasks.splice(destinationIndex, 0, movedTask);
    let draggedTask;
    if (source.droppableId.endsWith("completed")) {
      draggedTask = column.completedTasks[sourceIndex];
    }

    if (source.droppableId.endsWith("pending")) {
      draggedTask = column.pendingTasks[sourceIndex];
    }

    if (!draggedTask) {
      return;
    }

    const sourceColumn = source.droppableId.split("-")[1];
    const destinationColumn = destination.droppableId.split("-")[1];
    const draggedTaskId = draggedTask._id;
    // const newTasksArray = column.tasks.map((task) => task._id);
    const completed = draggedTask.completed;

    try {
      const response = await axios.post(
        `http://localhost:5000/columns/${sourceColumnId}/ids`,
        {
          movedTaskId: draggedTaskId,
          sourceColumn: sourceColumn,
          destinationColumn: destinationColumn,
          destinationColumnId: destinationColumnId,
          sourceIndex: sourceIndex,
          destinationIndex: destinationIndex,
          completed: completed,
          changeStatus: changeStatus,
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
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  function getStyle(
    style: CSSProperties | undefined,
    snapshot: DraggableStateSnapshot
  ): CSSProperties {
    if (!snapshot.isDropAnimating) {
      return style || {};
    }
    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`,
    };
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {columns.map((column) => (
          <div key={column._id} className="tasks_container">
            <div className="relative">
              <div
                contentEditable
                suppressContentEditableWarning={true}
                className="focus:bg-gray-200 outline-0 mr-8"
                onChange={(event: React.ChangeEvent<HTMLParagraphElement>) =>
                  handleColumnTitleChange(event, column._id)
                }
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
              >
                {column.title}
              </div>
              <DeleteColumn
                columns={columns}
                columnTitle={column.title}
                columnId={column._id}
                setRerenderSignal={setRerenderSignal}
              />
              <AddTask
                addTask={addTask}
                columnId={column._id}
                setRerenderSignal={setRerenderSignal}
              />
              <Droppable droppableId={`${column._id}-pending`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={
                      column.pendingTasks.length +
                        column.completedTasks.length <
                      1
                        ? "h-screen"
                        : ""
                    }
                  >
                    {column.pendingTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getStyle(
                              provided.draggableProps.style,
                              snapshot
                            )}
                          >
                            <Task
                              task={task}
                              setRerenderSignal={setRerenderSignal}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {column.completedTasks.length > 0 && (
                <Droppable droppableId={`${column._id}-completed`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="h-screen"
                    >
                      <div
                        className="cursor-pointer grid grid-cols-3 mt-4"
                        onClick={() => {
                          toggleShowCompletedTasks(column._id);
                        }}
                      >
                        <div className="">Completed</div>
                        <div className="flex justify-center">
                          {column.completedTasks.length || ""}
                        </div>
                        <div className="flex justify-end pr-6">
                          {column.showCompletedTasks ? (
                            <div className="expand_btn max-w-fit">V</div>
                          ) : (
                            <div className="expand_btn hidden_tasks max-w-fit">
                              V
                            </div>
                          )}
                        </div>
                      </div>
                      {column.showCompletedTasks &&
                        column.completedTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getStyle(
                                  provided.draggableProps.style,
                                  snapshot
                                )}
                              >
                                <Task
                                  task={task}
                                  setRerenderSignal={setRerenderSignal}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          </div>
        ))}
      </DragDropContext>
      <AddColumn
        setRerenderSignal={setRerenderSignal}
        currentTable={currentTable}
      ></AddColumn>
    </>
  );
};

export default Column;
