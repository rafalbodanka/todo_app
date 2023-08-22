import React, { useState, useEffect } from "react";
import axios from "axios";
import { ColumnType } from "../utils/Types";

interface EditColumnProps {
  column: ColumnType;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditColumn: React.FC<EditColumnProps> = ({
  column,
  setRerenderSignal,
}) => {
  const [columnName, setColumnName] = useState(column.title);
  const [prevColumnName, setPrevColumnName] = useState(column.title);

  const handleColumnTitleChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    const { innerText } = event.currentTarget;
    const sanitizedValue = innerText.replace(/(\r\n|\n|\r)/gm, "");
    const truncatedValue = innerText.substring(0, 100);
    setColumnName(truncatedValue);
  };

  const updateColumnName = async (columnId: string, newTitle: string) => {
    if (prevColumnName === columnName) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/columns/${columnId}/name`,
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
        setPrevColumnName(columnName);
        setRerenderSignal((prevSignal) => !prevSignal);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
      } else {
      }
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning={true}
      className="focus:bg-gray-200 outline-0 mr-8"
      onInput={(event: React.ChangeEvent<HTMLParagraphElement>) =>
        handleColumnTitleChange(event)
      }
      onKeyDown={(event: React.KeyboardEvent<HTMLParagraphElement>) => {
        if (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
        } else if (
          event.currentTarget.textContent &&
          event.currentTarget.textContent.length > 100
        ) {
          event.preventDefault();
        } else if (event.key === "Enter" || event.key === "Escape") {
          event.currentTarget.blur();
        }
      }}
      onBlur={() => {
        updateColumnName(column._id, columnName);
      }}
    >
      {column.title}
    </div>
  );
};

export default EditColumn;
