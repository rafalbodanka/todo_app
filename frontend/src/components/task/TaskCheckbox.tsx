import React, { useEffect } from 'react';
import { TaskType } from '../utils/Types';

import checkboxDone from '../../images/checkbox-done.png'
import checkboxEmpty from '../../images/checkbox-empty.png';

type TaskCheckboxProps = {
    task: TaskType
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task }) => {
    useEffect(() => {
    // Preload the sprite image
    const checkBoxDoneImg = new Image();
    checkBoxDoneImg.src = checkboxDone;

    const checkBoxEmptyImg = new Image();
    checkBoxEmptyImg.src = checkboxEmpty;
  }, []);

  const imageUrl = task.completed ? checkboxDone : checkboxEmpty;

  return (
    <img
      alt={`${task._id} checkbox`}
      className="w-6 max-h-6"
      src= {imageUrl}
    />
  );
};

export default TaskCheckbox;