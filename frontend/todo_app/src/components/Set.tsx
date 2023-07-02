import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { DraggableStateSnapshot } from "@hello-pangea/dnd";
import { CSSProperties } from "react";
import AddTable from "./AddTable";
import DeleteColumn from "./DeleteColumn";
import EditTable from "./EditTable";

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

interface Column {
  _id: string;
  title: string;
  pendingTasks: TaskData[];
  completedTasks: TaskData[];
  showCompletedTasks: boolean;
}

interface TableProps {
  columns: Column[];
  title: string;
  users: User[];
  __v: number;
  _id: string;
}

interface SetProps {
  user: User;
  tables: TableProps[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTable: string;
  setCurrentTable: React.Dispatch<string>;
}

const Set: React.FC<SetProps> = ({
  user,
  tables,
  setColumns,
  setRerenderSignal,
  currentTable,
  setCurrentTable,
}) => {
  const switchTable = (tableId: string, columns: Column[]) => {
    setColumns(columns);
    setCurrentTable(tableId);
  };

  return (
    <div className="w-full h-full flex justify-left items-center">
      <div className="grid grid-flow-col gap-8">
        {tables.map((table) => {
          return (
            <div
              key={table._id}
              className={`cursor-pointer p-2 pl-4 pr-4 hover:shadow-lg hover:bg-slate-200 rounded-md grid grid-col-2 grid-flow-col gap-4 ${
                currentTable === table._id ? "bg-purple-900 text-white" : ""
              }`}
              onClick={() => {
                if (currentTable !== table._id) {
                  switchTable(table._id, table.columns);
                }
              }}
            >
              {table.title}
              <EditTable
                user={user}
                table={table}
                currentTable={currentTable}
                setRerenderSignal={setRerenderSignal}
                tables={tables}
                setCurrentTable={setCurrentTable}
                setColumns={setColumns}
              ></EditTable>
            </div>
          );
        })}
        <AddTable setRerenderSignal={setRerenderSignal}></AddTable>
      </div>
    </div>
  );
};

export default Set;
