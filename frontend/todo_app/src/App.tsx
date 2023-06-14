import './App.css';
import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import Auth from './components/Auth';
import Column from './components/Column';
import Set from './components/Set';
import { table } from 'console';

type ColumnData = {
  _id: string,
  title: string,
  tasks: Task[];
  showCompletedTasks: boolean;
}

type Task = {
  _id: string,
  title: string,
  completed: boolean;
}

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [rerenderSignal, setRerenderSignal] = useState(false);
  const [currentTable, setCurrentTable] = useState('')

  const [tables, setTables] = useState([])

	const getUserSet = async () => {
    if (!username) return;
    try {
      const response = await axios.get('http://localhost:5000/tables/tables', 
      { 
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
      })
      console.log(response.data)
      if (response.status === 200) {
        setTables(response.data);
        let newColumns; // Define newColumns variable
        if (currentTable) {
          const table = response.data.find((table: any) => table._id === currentTable);
          if (table) {
            newColumns = table.columns;
          }
        } else {
          setCurrentTable(response.data[0]._id);
          newColumns = response.data[0].columns;
        }
        if (newColumns) { // Check if newColumns is defined
          setColumns(newColumns);
          console.log(currentTable);
          console.log(newColumns);
        }
      }
    } catch (err) {}
	}	

	useEffect(() => {
		getUserSet();
	}, [username, rerenderSignal])

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Register} />
        <Route path="/"
              element = {
            <Auth setUsername={setUsername}>
              <div className="w-screen h-screen font-Roboto font-500">
                <div className="">
                  <div className='mt-4 mb-4'>
                    <div className="grid grid-cols-8">
                      <div className="col-span-2 p-6">
                        <div>{username}</div>
                      </div>
                      <div className='col-span-5 items-end'>
                        <div className="scrollable-container overflow-x-auto whitespace-nowrap h-full">
                          <Set tables={tables} setColumns={setColumns} setRerenderSignal={setRerenderSignal} currentTable={currentTable} setCurrentTable={setCurrentTable}></Set>
                        </div>
                      </div>
                        <div className='col-span-1 flex justify-center items-center'>
                          <img className='h-1/2' src={process.env.PUBLIC_URL + '/icon-trash.svg'} alt="Trash Icon"></img>
                        </div>
                    </div>
                  </div>
                  <div className="flex flex-nowrap overflow-x-auto max-w-full">
                    <Column columns={columns} setColumns={setColumns} setRerenderSignal={setRerenderSignal} currentTable={currentTable}/>
                  </div>
                </div>
              </div>
          </Auth>
          }>
        </Route>
      </Routes>
    </Router>
    </>
  );
};


export default App;
