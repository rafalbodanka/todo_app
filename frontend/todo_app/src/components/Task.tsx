import React, { useState } from 'react';

import EditTask from './EditTask';

interface TaskData {
	_id: string;
	title: string;
	completed: boolean;
}

interface ColumnData {
	_id: string;
	title: string;
	tasks: TaskData[];
	showCompletedTasks: boolean;
  }

	interface TaskProps {
		task: TaskData;
		columns: ColumnData[];
		setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
		columnId: string;
	}

	const Task: React.FC<TaskProps> = ({
		task,
		columns,
		setColumns,
		columnId,
	}) => {

	const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

	const openEditTaskModal = () => {
		setIsEditTaskModalOpen(true);
	}


	const toggleTaskStatus = (editedTask: TaskData) => {
		setColumns((prevColumns) => {
			const updatedColumns = prevColumns.map((column) => {
				if (column.tasks.some((task) => task._id === editedTask._id)) {
					const updatedTasks = column.tasks.map((task) => {
						if (editedTask._id === task._id) {
							return {
								...task,
								completed: !task.completed,
							};
						}
						return task;
					});
	
					const index = updatedTasks.findIndex((task) => task._id === editedTask._id);
					const taskToMove = updatedTasks.splice(index, 1)[0];
					
					if (taskToMove.completed) {
						const completedIndex = updatedTasks.findIndex((task) => task.completed);
						updatedTasks.splice(completedIndex !== -1 ? completedIndex : updatedTasks.length, 0, taskToMove);
					} else {
						updatedTasks.unshift(taskToMove);
					}
	
					return {
						...column,
						tasks: updatedTasks,
					};
				}
				return column;
			});
	
			return updatedColumns;
		});
	};

	return (
		<div className="task" onClick={openEditTaskModal}>
			<div className='flex'>
				<img src={task.completed ? '/checkbox-done.png' : '/checkbox-empty.png'}
				alt='checkbox-done'
				className='w-6 max-h-6'
				onClick={(event) => {
					event.stopPropagation();
					toggleTaskStatus(task)}
				}/>
				<div className="ml-2 min-w-1">
					{task.title}
				</div>
			</div>
			<EditTask
			task={task}
			columnId={columnId}
			columns={columns}
			setColumns={setColumns}
			isEditTaskModalOpen={isEditTaskModalOpen}
			setIsEditTaskModalOpen={setIsEditTaskModalOpen}
			/>
		</div>    
	)

}

export default Task