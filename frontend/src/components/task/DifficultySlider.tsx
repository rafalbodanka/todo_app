import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { TaskType } from "../utils/Types";
import ConnectionErrorModal from "../utils/ConnectionErrorModal";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectColumns, setColumns } from "../../redux/currentTable";
import _ from "lodash";

type DifficultySliderProps = {
  task: TaskType;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DifficultySlider: React.FC<DifficultySliderProps> = ({
  task,
  setRerenderSignal,
}) => {
  const columns = useAppSelector(selectColumns)
  const dispatch = useAppDispatch()
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to get the difficulty description and text color based on the difficulty value
  const getDifficultyDescription = (difficultyValue: number) => {
    let description = "";
    let textColor = "";

    if (difficultyValue >= 1 && difficultyValue <= 3) {
      description = "Easy";
      textColor = "green-500";
    } else if (difficultyValue >= 4 && difficultyValue <= 7) {
      description = "Medium";
      textColor = "orange-500";
    } else if (difficultyValue >= 8 && difficultyValue <= 10) {
      description = "Hard";
      textColor = "red-500";
    }

    // Concatenate "text-" prefix to the color class
    textColor = `text-${textColor}`;

    return { description, textColor };
  };

  const { description, textColor } = getDifficultyDescription(difficulty);

  const handleDifficultyUpdate = async () => {
    // apply local changes
    const taskId = task._id
    const updatedColumns = _.cloneDeep(columns).map(column => {
      if (task.completed) {
        column.completedTasks.map(task => {
          if (task._id === taskId) {
            task.difficulty = difficulty
          }
        return task
        })
      }
      if (!task.completed) {
        column.pendingTasks.map(task => {
          if (task._id === taskId) {
            task.difficulty = difficulty
          }
        return task
        })
      }
      return column
    })
    dispatch(setColumns(updatedColumns))

    // update task's state in database
    try {
      const response = await axios.patch(
        `http://localhost:5000/tasks/${task._id}/difficulty`,
        { difficulty: difficulty },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      setIsError(true);
    } finally {
      setRerenderSignal((prevSignal) => !prevSignal);
    }
  };

  return (
    <div>
      <div>
        <div>
          Difficulty: {difficulty}{" "}
          <span className={textColor}> {description}</span>
        </div>
        <Slider
          sx={{
            color: "#673ab7",
          }}
          color="primary"
          aria-label="Small steps"
          value={difficulty}
          step={1}
          min={1}
          max={10}
          valueLabelDisplay="auto"
          onChange={(event) => {
            setDifficulty(Number((event.target as HTMLInputElement).value));
          }}
          onChangeCommitted={handleDifficultyUpdate}
        />
      </div>
      {isError && (
        <ConnectionErrorModal message={errorMessage} setIsError={setIsError} />
      )}
    </div>
  );
};

export default DifficultySlider;
