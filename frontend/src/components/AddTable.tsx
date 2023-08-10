import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { DraggableStateSnapshot } from "@hello-pangea/dnd";
import { CSSProperties } from "react";
import { TaskType, User, ColumnType, TableType } from "./Types";

interface AddTableProps {
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTable: React.FC<AddTableProps> = ({ setRerenderSignal }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addNewTable = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleSubmit();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !(inputRef.current as HTMLInputElement).contains(e.target as Node)
    ) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const sanitizedValue = text.replace(/(\r\n|\n|\r)/gm, "");
    const truncatedValue = sanitizedValue.substring(0, 50);
    setInputValue(truncatedValue);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") {
      setInputValue("");
      setShowInput(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/tables/create",
        {
          title: inputValue,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        setInputValue("");
        setShowInput(false);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={`cursor-pointer p-2 pl-4 pr-4 hover:shadow-lg hover:bg-slate-200 rounded-md ${
        showInput && "bg-slate-200 shadow-lg"
      }`}
      onClick={addNewTable}
      ref={inputRef}
    >
      {showInput ? (
        <input
          autoFocus
          value={inputValue}
          maxLength={50}
          onChange={handleOnChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyPress}
          className="w-36 rounded-sm outline-0"
        ></input>
      ) : (
        "+"
      )}
    </div>
  );
};

export default AddTable;
