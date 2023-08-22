import React, { useEffect, useState } from "react";
import DateRangePicker from "rsuite/DateRangePicker";
import "rsuite/dist/rsuite.min.css";
import { TaskType } from "../utils/Types";
import { DateRange } from "rsuite/esm/DateRangePicker/types";
import ConnectionErrorModal from "../utils/ConnectionErrorModal";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import { isMobileValue } from "../../redux/isMobile";

const EstimationDateRangePicker: React.FC<{
  task: TaskType;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ task, setRerenderSignal }) => {
  const isMobile = useAppSelector(isMobileValue)

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [startDate, setStartDate] = useState(
    task.startDate ? new Date(task.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    task.endDate ? new Date(task.endDate) : null
  );
  const currentDate = new Date();

  const [displayDate, setDisplayDate] = useState<DateRange>(
    startDate && endDate
      ? [startDate, endDate]
      : startDate
      ? [startDate, startDate]
      : [currentDate, currentDate]
  );

  const handleDateRangeChange = async (event: DateRange | null) => {
    if (!event) return;

    const [startDate, endDate] = event;
    setDisplayDate(event);
    try {
      const response = await axios.patch(
        `http://localhost:5000/tasks/${task._id}/date-range`,
        {
          startDate: startDate,
          endDate: endDate,
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
    } catch (err) {
    }
  };
  return (
    <div>
      <div className="relative">
        {task.endDate && task.endDate > currentDate ? (
          <p className="text-red-400">Task duration exceeded</p>
        ) : (
          <p>Task duration</p>
        )}
        <DateRangePicker
          className="cursor-pointer"
          showOneCalendar={isMobile}
          appearance="default"
          value={displayDate || null}
          placeholder="Set date range"
          style={{ width: 230 }}
          format={"dd.MM.yyyy"}
          ranges={[]}
          onChange={handleDateRangeChange}
        />
      </div>
      {isError && (
        <ConnectionErrorModal message={errorMessage} setIsError={setIsError} />
      )}
    </div>
  );
};

export default EstimationDateRangePicker;
