import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentTable, setCurrentTable } from "../../redux/currentTable";

const AddColumn: React.FC<{
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setRerenderSignal }) => {
  const dispatch = useAppDispatch()
  const currentTable = useAppSelector(selectCurrentTable);

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addNewColumn = () => {
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

  const handleSubmit = async () => {
    if (inputValue.trim() === "") {
      setInputValue("");
      setShowInput(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/columns/create",
        {
          title: inputValue,
          tableId: currentTable._id,
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
        dispatch(setCurrentTable(response.data.data))
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="pl-6">
      <p
        className="cursor-pointer w-fit min-w-1"
        onClick={addNewColumn}
        ref={inputRef}
      >
        {showInput ? (
          <input
            autoFocus
            maxLength={100}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyPress}
            className="w-36 rounded-md focus:bg-slate-100 outline-0"
          ></input>
        ) : (
          "Add new column"
        )}
      </p>
    </div>
  );
};

export default AddColumn;
