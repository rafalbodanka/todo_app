import React, { useState } from "react";
import { TaskData } from "./Task";
import { Checkbox } from "@material-tailwind/react";
import DifficultySlider from "./DifficultySlider";
import EstimationDateRangePicker from "./EstimationDateRangePicker";
import ConnectionErrorModal from "./ConnectionErrorModal";
import axios from "axios";

type EstimationProps = {
  task: TaskData;
  isMobile: boolean;
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
  isMobile,
  setRerenderSignal,
}) => {
  const [isEstimated, setIsEstimated] = useState(task.isEstimated);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toBeFinishedDate, setToBeFinishedDate] = useState(() => {
    const toBeFinishedDate = calculateFinishDate(
      new Date(task.updatedAt),
      Number(task.difficulty)
    );
    return new Date(toBeFinishedDate);
  });

  // Function to format the date as "Sunday, July 2, 2023"
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // const handleSliderChange = (value: number) => {
  //   console.log(value);
  //   setDifficulty(value);
  //   setToBeFinishedDate(
  //     calculateFinishDate(new Date(task.updatedAt), difficulty)
  //   );
  // };

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
              isMobile={isMobile}
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
