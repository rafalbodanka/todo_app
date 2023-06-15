import React, {useState} from "react";
import axios from "axios";

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
		isEditTaskModalOpen: boolean;
		setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
		setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
	}

const EditTask: React.FC<EditTaskProps> = ({ task, isEditTaskModalOpen, setIsEditTaskModalOpen, setRerenderSignal }) => {
	const [isDeleteTaskModalOpen, setIsDeleteModalOpen] = useState (false)
	const [deleteTaskModalMessage, setDeleteTaskModalMessage] = useState ('')

	const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
		const newTitle = event.target.value;
		setTaskTitle(newTitle, taskId);
	};

	const setTaskTitle = (newTitle: string, taskId: string) => {
		// setColumns((prevColumns) => {
		//   const updatedColumns = prevColumns.map((column) => {
		// 	if (column._id === columnId) {
		// 	  const updatedTasks = column.tasks.map((task) => {
		// 		if (taskId === task._id) {
		// 		  return { ...task, title: newTitle };
		// 		}
		// 		return task;
		// 	  });
	  
		// 	  return {
		// 		...column,
		// 		tasks: updatedTasks,
		// 	  };
		// 	}
		// 	return column;
		//   });
		//   return updatedColumns;
		// });
	  };

		const deleteTask = (taskTitle: string) => {
			setDeleteTaskModalMessage(`Do you want to delete task ${taskTitle}?`)
			setIsDeleteModalOpen(true)
		} 

	  const handleDelete = async (taskId: string) => {
		try {
			const response = await axios.post(`http://localhost:5000/tasks/${taskId}/delete`, {},
			{
					withCredentials: true,
					headers: {
							'Access-Control-Allow-Origin': '*',
							'Content-Type': 'application/json'
					}
			})

			if (response.status === 200) {
				console.log('gituwa')
				setRerenderSignal(prevSignal => !prevSignal)
				setIsEditTaskModalOpen(false)
			}
		} catch (err: any) {
			if (err.response && err.response.status === 404) {
					console.log('Task not found');
			} else {
					console.log(`Something went wrong, try again`);
			}
		}
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
			<>
			<div
			className="bg-black bg-opacity-30 fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-20 cursor-default"
			onMouseDown={closeEditTaskModal}
			>
				<div className="bg-white p-6 rounded-md cursor-default" onClick={(event) => event.stopPropagation()}>
					<div>
						<div className="flex justify-end">
							<img src={process.env.PUBLIC_URL + '/icon-trash.svg'} alt="Trash Icon" onClick={()=> {
								// console.log(column._id, task._id)
								deleteTask(task.title)
							}
						} className="w-6 cursor-pointer"/>
						</div>
						<p>Title</p>
						<input value={task.title} onChange={(event) => handleTitleOnChange(event, task._id)}
						className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></input>
					</div>
				</div>
			{isDeleteTaskModalOpen &&
				<div className="w-screen h-screen flex fixed top-0 left-0 justify-center items-center bg-black bg-opacity-30 z-10">
					<div className="bg-white p-6 rounded-md">
							<p>{deleteTaskModalMessage}</p>
							<div className="grid grid-cols-2 mt-4 gap-12">
								<button className="bg-purple-400 rounded-md flex justify-center"
								onClick={e => {
									e.preventDefault()
									handleDelete(task._id)
									}}>Yes</button>
								<button className="bg-purple-400 rounded-md"
								onClick={e => {
									e.preventDefault()
									setIsDeleteModalOpen(false)
								}}>No</button>
							</div>
					</div>
				</div>
			}
			</div>
		</>
		)
	);
};
    
export default EditTask;