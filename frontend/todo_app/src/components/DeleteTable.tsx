import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { table } from "console";

interface Task {
  _id: string,
  title: string,
  completed: boolean;
}

interface User {
	_id: string;
	__v: number;
}

interface Column {
  _id: string,
  title: string,
  tasks: Task[];
  showCompletedTasks: boolean;
}

interface TableProps {
	columns: Column[];
	title: string;
	users: User[];
	__v: number;
	_id: string;
}

type DeleteTableProps = {
	currentTable: string;
	setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  tables: TableProps[];
	setCurrentTable: React.Dispatch<string>;
	setColumns: React.Dispatch<React.SetStateAction<Column[]>>
};

const DeleteTable: React.FC<DeleteTableProps> = ({ currentTable, setRerenderSignal, tables, setCurrentTable, setColumns }) => {
	const [deleteModalMessage, setDeleteModalMessage] = useState('')
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteModalAction, setDeleteModalAction] = useState(false);

	const handleDeleteModalAction = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		if (deleteModalAction) {
			// Perform the action and update the current table and rerender
			setRerenderSignal(prevSignal => !prevSignal);
			if (currentTable !== tables[0]._id) {
				setCurrentTable(tables[0]._id)
			} else {
				setCurrentTable(tables.length > 1 ? tables[1]._id : '');
			}
		}
	
		// Close the modal and reset the action state
		setIsDeleteModalOpen(false);
		setDeleteModalAction(false);
	};

	const performDelete = async () => {
		const tableId = currentTable;
		console.log(tableId)

		if(!currentTable) {
			return;
		}

		try {
				const response = await axios.post(`http://localhost:5000/tables/delete/${tableId}`, {},
				{
					withCredentials: true,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json'
					}
				})

			if (response.status === 200) {
				setDeleteModalMessage('Table deleted succesfully')
				setIsDeleteModalOpen(true)
				setDeleteModalAction(true);
			}
		} catch (err: any) {
			if (err.response && err.response.status === 404) {
				setDeleteModalMessage('Table not found');
				setIsDeleteModalOpen(true);
				setDeleteModalAction(false);
			} else {
				setDeleteModalMessage(`Something went wrong, try again`);
				setIsDeleteModalOpen(true);
				setDeleteModalAction(false);
			}
	}
	}
	return (
		<>
			<img className='h-1/2 cursor-pointer' 
				src={process.env.PUBLIC_URL + '/icon-trash.svg'}
				alt="Trash Icon"
				onClick={performDelete}
			></img>
			{isDeleteModalOpen && 
				<div className="w-screen h-screen bg-black bg-opacity-30 absolute top-0 left-0 flex justify-center items-center">
					<div className="bg-white rounded-md">
						<div className="p-6 text-center">
							<p>
								{deleteModalMessage}
							</p>
							<button
							onClick={(e)=>handleDeleteModalAction(e)}
							className="bg-purple-400 p-2 pl-6 pr-6 rounded-md mt-4"
							>OK</button>
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default DeleteTable;