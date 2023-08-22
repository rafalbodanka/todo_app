import React, { useState } from "react";
import { TaskType } from "../utils/Types";
import { Checkbox } from "@material-tailwind/react";
import DifficultySlider from "./DifficultySlider";
import EstimationDateRangePicker from "./EstimationDateRangePicker";
import ConnectionErrorModal from "../utils/ConnectionErrorModal";
import axios from "axios";

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

  const [isEstimated, setIsEstimated] = useState(task.isEstimated);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleEstimation = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEstimated(event.target.checked);

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