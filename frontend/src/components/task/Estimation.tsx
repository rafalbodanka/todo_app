import React, { useState } from "react";
import { TaskType } from "../utils/Types";
import { Checkbox } from "@material-tailwind/react";
import DifficultySlider from "./DifficultySlider";
import EstimationDateRangePicker from "./EstimationDateRangePicker";
import ConnectionErrorModal from "../utils/ConnectionErrorModal";
import axios from "axios";
import _ from 'lodash'
import { selectColumns, setColumns } from "../../redux/currentTable";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
type EstimationProps = {
  task: TaskType;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const calculateFinishDate = (initialDate: Date, days: number | null) => {
  const updatedAtDate = new Date(initialDate);
  const estimationInDays = days || 0;
  const estimatedMilliseconds = estimationInDays * 24 * 60 * 60 * 1000; // Convert estimation to milliseconds
  const toBeFinishedDate = updatedAtDate.getTime() + estimatedMilliseconds;
  return new Date(toBeFinishedDate);
};

const Estimation: React.FC<EstimationProps> = ({
  task,
  setRerenderSignal,
}) => {
  const columns = useAppSelector(selectColumns)
  const dispatch = useAppDispatch()
  const [isEstimated, setIsEstimated] = useState(task.isEstimated);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleEstimation = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEstimated(event.target.checked);
    // apply local changes to redux state
    const taskId = task._id
    const updatedColumns = _.cloneDeep(columns).map(column => {
      if (task.completed) {
        column.completedTasks.map(task => {
          if (task._id === taskId) {
            task.isEstimated = event.target.checked
          }
          return task
        })
      }
      if (!task.completed) {
        column.pendingTasks.map(task => {
          if (task._id === taskId) {
            task.isEstimated = event.target.checked
          }
          return task
        })
      }
      return column
    })
    dispatch(setColumns(updatedColumns))
    try {
      const response = await axios.patch(
        `http://localhost:5000/tasks/${task._id}/estimation`,
        { isEstimated: event.target.checked },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      setIsEstimated(!event.target.checked);
      setIsError(true);
    } finally {
      setRerenderSignal((prevSignal) => !prevSignal);
    }
  };

  return (
    <div>
      <div>
        {" "}
        <div className="flex items-center">
          <div>Estimation</div>
          <Checkbox
            color="deep-purple"
            checked={isEstimated}
            onChange={handleToggleEstimation}
          />
        </div>
        {isEstimated && (
          <div>
            <DifficultySlider
              task={task}
              setRerenderSignal={setRerenderSignal}
            ></DifficultySlider>
            <EstimationDateRangePicker
              task={task}
              setRerenderSignal={setRerenderSignal}
            ></EstimationDateRangePicker>
          </div>
        )}
      </div>
      {isError && (
        <ConnectionErrorModal message={errorMessage} setIsError={setIsError} />
      )}
    </div>
  );
};

export default Estimation;
