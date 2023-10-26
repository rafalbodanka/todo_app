import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import { DraggableStateSnapshot } from "@hello-pangea/dnd";
import { CSSProperties } from "react";
import axios from "axios";
import Task from "../task/Task";
import AddTask from "../task/AddTask";
import DeleteColumn from "./DeleteColumn";
import AddColumn from "./AddColumn";
import EditColumn from "./EditColumn";
import { ColumnType, Filters } from "../utils/Types";
import { filterTasks } from "../utils/Helpers";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectCurrentTable, setColumns, selectColumns, setCurrentTable } from "../../redux/currentTable";
import _ from 'lodash';

interface ColumnProps {
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  searchValue: string;
}

const Column: React.FC<ColumnProps> = ({
  setRerenderSignal,
  filters,
  searchValue,
}) => {
  const currentTable = useAppSelector(selectCurrentTable)
  const columns = useAppSelector(selectColumns)
  const dispatch = useAppDispatch()
  let localColumns = _.cloneDeep(columns);

  useEffect(() => {
    localColumns = _.cloneDeep(columns);
  }, [columns])
  const [isDraggingPossible, setIsDraggingPossible] = useState(true);

  const toggleShowCompletedTasks = async (
    columnId: string,
    showCompletedTasks: boolean
  ) => {
    dispatch(
      setColumns(
        columns.map((column) => {
          if (column._id === columnId) {
            return { ...column, showCompletedTasks: !column.showCompletedTasks };
          }
          return column;
        })
      )
    );
    try {
      const response = await axios.post(
        `http://localhost:5000/columns/${columnId}/status`,
        { showCompletedTasks: showCompletedTasks },
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
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    }
  };

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const sourceColumnId = source.droppableId.split("-")[0];
    const destinationColumnId = destination.droppableId.split("-")[0];
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const column = localColumns.find((column) => column._id === sourceColumnId);
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
    const draggedTaskId = draggedTask._id;
    const completed = draggedTask.completed;

    //optimistic UI columns update
    const isChangingStatus =
      source.droppableId.split("-")[1] !==
      destination.droppableId.split("-")[1];

    const updateColumns = (columns: ColumnType[]) => {
      const updatedColumns = [...columns];
      let draggedTask;
      if (source.droppableId.endsWith("completed")) {
        draggedTask = column.completedTasks[sourceIndex];
      }

      if (source.droppableId.endsWith("pending")) {
        draggedTask = column.pendingTasks[sourceIndex];
      }

      const sourceColumnIndex = columns.findIndex(
        (column: ColumnType) => column._id === sourceColumnId
      );
      const destinationColumnIndex = columns.findIndex(
        (column: ColumnType) => column._id === destinationColumnId
      );

      //moving within the same column
      if (!isChangingStatus) {
        if (draggedTask?.completed) {
          const taskToMove = columns[
            sourceColumnIndex
          ].completedTasks.splice(sourceIndex, 1)[0];
          columns[destinationColumnIndex].completedTasks.splice(
            destinationIndex,
            0,
            taskToMove
          );
        }
        if (!draggedTask?.completed) {
          const taskToMove = columns[sourceColumnIndex].pendingTasks.splice(
            sourceIndex,
            1
          )[0];
          columns[destinationColumnIndex].pendingTasks.splice(
            destinationIndex,
            0,
            taskToMove
          );
        }
      }
      if (isChangingStatus) {
        if (!draggedTask) return columns;
        if (!draggedTask.completed) {
          const taskToMove = columns[sourceColumnIndex].pendingTasks.splice(
            sourceIndex,
            1
          )[0];
          columns[destinationColumnIndex].completedTasks.splice(
            destinationIndex,
            0,
            taskToMove
          );
        }
        if (draggedTask.completed) {
          const taskToMove = columns[
            sourceColumnIndex
          ].completedTasks.splice(sourceIndex, 1)[0];
          columns[destinationColumnIndex].pendingTasks.splice(
            destinationIndex,
            0,
            taskToMove
          );
        }
        draggedTask.completed = !draggedTask.completed;
      }
      return updatedColumns;
    }

    dispatch(setColumns(updateColumns(localColumns)));

    // updating columns in database
    try {
      const response = await axios.post(
        `http://localhost:5000/columns/${sourceColumnId}/ids`,
        {
          movedTaskId: draggedTaskId,
          destinationColumnId: destinationColumnId,
          destinationIndex: destinationIndex,
          completed: completed,
          changeStatus: changeStatus,
          tableId: currentTable._id
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
        dispatch(setCurrentTable(response.data.data))
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
        {columns?.map((column) => (
          <div key={column._id} className="tasks_container">
            <div className="relative">
              <div className="flex justify-between">
                <EditColumn
                  column={column}
                  setRerenderSignal={setRerenderSignal}
                ></EditColumn>
                <DeleteColumn
                  columnTitle={column.title}
                  columnId={column._id}
                  setRerenderSignal={setRerenderSignal}
                />
              </div>
              <AddTask
                columnId={column._id}
                setRerenderSignal={setRerenderSignal}
              />
              <Droppable droppableId={`${column._id}-pending`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={
                      column.completedTasks.length < 1
                        ? "h-screen"
                        : column.pendingTasks.length < 1
                        ? "h-8"
                        : "h-auto"
                    }
                  >
                    {filterTasks(column.pendingTasks, filters)
                      //filter by search value
                      .filter(
                        (task) =>
                          task.title
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          task.notes
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                      )
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={!isDraggingPossible}
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
                                columnId={column._id}
                                task={task}
                                setRerenderSignal={setRerenderSignal}
                                setIsDraggingPossible={setIsDraggingPossible}
                                currentTableId={currentTable._id}
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
                      className="h-full"
                    >
                      <div
                        className="cursor-pointer grid grid-cols-3 mt-4"
                        onClick={() => {
                          toggleShowCompletedTasks(
                            column._id,
                            column.showCompletedTasks
                          );
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
                            <div className={`expand_btn ${!column.showCompletedTasks && "hidden_content"} max-w-fit`}>
                              V
                            </div>
                          )}
                        </div>
                      </div>
                      {column.showCompletedTasks &&
                        filterTasks(column.completedTasks, filters) //filter by search value
                          .filter(
                            (task) =>
                              task.title
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()) ||
                              task.notes
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                          )
                          .map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                              isDragDisabled={!isDraggingPossible}
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
                                  columnId={column._id}
                                  task={task}
                                  setRerenderSignal={setRerenderSignal}
                                  setIsDraggingPossible={setIsDraggingPossible}
                                  currentTableId={currentTable._id}
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
      ></AddColumn>
    </>
  );
};

export default Column;
