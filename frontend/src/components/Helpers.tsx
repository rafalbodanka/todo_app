import { Filters, TaskType } from "./Types";

// helper function for removing focus due to material tailwind package default behaviour
export const unfocusAllElements = () => {
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element: any) => {
    element.blur();
  });
};

// helper function for filtering tasks
export const filterTasks = (tasks: TaskType[], filters: Filters) => {
  return tasks.filter((task) => {
    // filtering by estimation status
    const filterByEstimation =
      filters.isEstimated.length === 0 ||
      (filters.isEstimated.includes("estimated") && task.isEstimated) ||
      (filters.isEstimated.includes("not-estimated") && !task.isEstimated);

    // filtering by difficulty
    const filterByDifficulty =
      filters.difficulty.length === 0 ||
      (filters.difficulty.includes("easy") &&
        task.difficulty >= 1 &&
        task.difficulty <= 3) ||
      (filters.difficulty.includes("medium") &&
        task.difficulty >= 4 &&
        task.difficulty <= 7) ||
      (filters.difficulty.includes("hard") &&
        task.difficulty >= 8 &&
        task.difficulty <= 10);

    // filtering by assigned members
    const filterByAssignment =
      filters.assignment.length === 0 ||
      task.responsibleUsers.some((user) =>
        filters.assignment.includes(user._id)
      );

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const startDate = new Date(task.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(task.endDate).setHours(0, 0, 0, 0);

    // filtering by finish status
    const filterByFinishStatus =
      filters.finishStatus.length === 0 ||
      (filters.finishStatus.includes("exceeded") && startDate < currentDate) ||
      (filters.finishStatus.includes("today") && startDate === currentDate) ||
      (filters.finishStatus.includes("in-progress") &&
        startDate < currentDate &&
        currentDate < endDate) ||
      (filters.finishStatus.includes("planned") && currentDate < endDate);

    return (
      filterByEstimation &&
      filterByDifficulty &&
      filterByAssignment &&
      filterByFinishStatus
    );
  });
};
