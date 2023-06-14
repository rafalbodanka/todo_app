import React, {useState, useRef, useEffect} from "react";
import axios from "axios";

interface AddTaskProps {
    columnId: string;
    addTask: (columnId: string) => void;
    setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AddTask: React.FC<AddTaskProps> = ({ columnId, addTask, setRerenderSignal }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

const addNewColumn = () => {
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
    	const response = await axios.post('http://localhost:5000/tasks/create', 
    	{ 
    		"title": inputValue,
    		"columnId": columnId,
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
    <div className="add_task font-400"
    onClick={addNewColumn}
    ref={inputRef}
    >{showInput ?
      <input
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyPress}
        className='w-full rounded-md focus:bg-slate-100 outline-0'
        ></input>
        : 'Add task'}
    </div>
  );
};

export default AddTask