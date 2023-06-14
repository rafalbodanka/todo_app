import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { DraggableStateSnapshot } from '@hello-pangea/dnd';
import { CSSProperties } from 'react';

interface Task {
  id: string,
  title: string,
  completed: boolean;
}

interface User {
	_id: string;
	__v: number;
}

interface Column {
  id: string,
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

interface SetProps {
  // tables: TableProps[];
  // setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
	setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

// const AddTable: React.FC<SetProps> = ({ tables, setColumns }) => {
const AddTable: React.FC<SetProps> = ({setRerenderSignal}) => {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

	const addNewTable = () => {
        setShowInput(true);
	}

	const handleKeyPress = (e: any) => {
			if (e.key === "Enter" && inputValue.trim() !== "") {
				handleSubmit();
			}
		};

	const handleClickOutside = (e: MouseEvent) => {
			if (inputRef.current && !((inputRef.current as HTMLInputElement).contains(e.target as Node))) {
				setShowInput(false);
			}
		};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleSubmit = async () => {
			if (inputValue.trim() === "") {
					setInputValue("");
					setShowInput(false);
				return;
			}
		
			try {
				const response = await axios.post('http://localhost:5000/tables/create', 
				{ 
					"title": inputValue
				},
				{
					withCredentials: true,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json'
					 }
					}
				);
				console.log(response)
				if (response.status === 201) {
					setInputValue("");
					setShowInput(false);
					setRerenderSignal(prevSignal => !prevSignal)
				}
			} catch (error) {
				// Handle error
			}
		};

  return (
    <div className={`cursor-pointer p-2 pl-4 pr-4 hover:shadow-sm hover:bg-slate-200 rounded-md ${showInput && 'bg-slate-200 shadow-sm'}`}
        onClick={addNewTable}
				ref={inputRef}>
        {showInput ?
        <input
					autoFocus
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleSubmit}
					onKeyDown={handleKeyPress}
					className='w-36 rounded-sm outline-0'
					></input>
					: '+'}
    </div>
  );
};

export default AddTable;