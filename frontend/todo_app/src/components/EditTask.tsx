import React, {useState} from "react";

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

	interface EditTaskProps {
		task: TaskData;
		columnId: string;
		columns: ColumnData[];
		setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
		isEditTaskModalOpen: boolean;
		setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	}

const EditTask: React.FC<EditTaskProps> = ({ task, columnId, columns, setColumns, isEditTaskModalOpen, setIsEditTaskModalOpen }) => {

	const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
		const newTitle = event.target.value;
		setTaskTitle(newTitle, taskId);
	};

	const setTaskTitle = (newTitle: string, taskId: string) => {
		setColumns((prevColumns) => {
		  const updatedColumns = prevColumns.map((column) => {
			if (column._id === columnId) {
			  const updatedTasks = column.tasks.map((task) => {
				if (taskId === task._id) {
				  return { ...task, title: newTitle };
				}
				return task;
			  });
	  
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

	  const deleteTask = (columnId: string, taskId: string) => {
		setColumns((prevColumns) => {
			const updatedColumns = prevColumns.map((column) => {
				if (column._id === columnId) {
					const updatedTasks = column.tasks.filter(
						(task) => task._id !== taskId
					);
	
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

	const closeEditTaskModal = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation();
		if (event.target === event.currentTarget) {
			setIsEditTaskModalOpen(false);
		}
	};

	if (!isEditTaskModalOpen) {
    return null;
  }
 
	return (
		isEditTaskModalOpen && (
			<div
				className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20 cursor-default"
				onMouseDown={closeEditTaskModal}
			>
				<div className="bg-white p-6 rounded-md cursor-default" onClick={(event) => event.stopPropagation()}>
					<div>
						<div className="flex justify-end">
							<img src={process.env.PUBLIC_URL + '/icon-trash.svg'} alt="Trash Icon" onClick={()=> {
								// console.log(column._id, task._id)
								deleteTask(columnId, task._id)
							}
								} className="w-6 cursor-pointer"/>
						</div>
						<p>Title</p>
						<input value={task.title} onChange={(event) => handleTitleOnChange(event, task._id)}
						className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></input>
					</div>
				</div>
			</div>
		)
	);
};
    
export default EditTask;