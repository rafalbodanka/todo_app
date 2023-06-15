import React, {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { DraggableStateSnapshot } from '@hello-pangea/dnd';
import { CSSProperties } from 'react';

import Task from './Task';
import AddTask from './AddTask';
import DeleteColumn from './DeleteColumn';
import AddColumn from './AddColumn';

interface ColumnProps {
  columns: ColumnData[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
	setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
	currentTable: string;
}

interface ColumnData {
  _id: string;
  title: string;
  tasks: TaskData[];
  showCompletedTasks: boolean;
}

interface TaskData {
  _id: string;
  title: string;
  completed: boolean;
}

const Column: React.FC<ColumnProps> = ({ columns, setColumns, setRerenderSignal, currentTable }) => {

	const handleColumnTitleChange = (event: React.ChangeEvent<HTMLParagraphElement>, id:string) => {
		const { innerText } = event.currentTarget;
		const sanitizedValue = innerText.replace(/(\r\n|\n|\r)/gm, '');
		const truncatedValue = sanitizedValue.substring(0, 25);
		updateColumnName(id, truncatedValue);
	}

	const updateColumnName = (columnId: string, newTitle:string) => {
		setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column._id === columnId) {
          return {
            ...column,
            title: newTitle,
          };
        }
        return column;
      });
    });
	}

	const addTask = (columnId: string) => {
		setColumns((prevColumns) => {
			return prevColumns.map((column) => {
				if (column._id === columnId) {
							const newTask = {
								_id: '20',
								title: 'new task',
								completed: false,
							}
				return {
					...column,
					tasks: [newTask, ...column.tasks]
				};
				}
				return column;
			});
			});
	}

  const toggleShowCompletedTasks = (columnId: string) => {
    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column._id === columnId) {
          return {
            ...column,
            showCompletedTasks: !column.showCompletedTasks,
          };
        }
        return column;
      });
    });
  };

	interface ResultProps {
		draggableId: string;
		type: string;
		source: DraggableLocation;
		destination: DraggableLocation | null;
		reason: string;
		mode?: string;
	}
	
	const handleOnDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}
	
		const { source, destination } = result;
		const sourceColumnId = source.droppableId;
		const destinationColumnId = destination.droppableId;
		const sourceIndex = source.index;
		const destinationIndex = destination.index;
	
		setColumns((prevColumns) => {
			const updatedColumns = [...prevColumns];
	
			const sourceColumn = updatedColumns.find(
				(column) => column._id === sourceColumnId.split("-")[0]
			);
			const destinationColumn = updatedColumns.find(
				(column) => column._id === destinationColumnId.split("-")[0]
			);
	
			if (sourceColumn && destinationColumn) {
				const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
				movedTask.completed = !destinationColumnId.includes("pending");
				destinationColumn.tasks.splice(destinationIndex, 0, movedTask);
			}
	
			return updatedColumns;
		});
	};
	

	function getStyle(style: CSSProperties | undefined, snapshot: DraggableStateSnapshot): CSSProperties {
		if (!snapshot.isDropAnimating) {
			return style || {};
		}
		return {
			...style,
			// cannot be 0, but make it super tiny
			transitionDuration: `0.001s`,
		};
	}
	
  return (
		<>
		<DragDropContext onDragEnd={handleOnDragEnd}>
			{columns.map((column) => (
				<div key={column._id} className="tasks_container">
					<div className='relative'>
						<div
						contentEditable
						suppressContentEditableWarning={true}
						className='focus:bg-gray-200 outline-0 mr-8'
						onChange={(event: React.ChangeEvent<HTMLParagraphElement>) => handleColumnTitleChange(event, column._id)}
						onKeyDown={(event: React.KeyboardEvent<HTMLParagraphElement>) => {
							if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
							} else if  (event.currentTarget.textContent && event.currentTarget.textContent.length > 60) {
								event.preventDefault();
							} else if (event.key === 'Enter' || event.key === "Escape") {
								event.currentTarget.blur();
							}
						}}
						>{column.title}
						</div>
								<DeleteColumn 
									columns={columns}
									columnTitle={column.title}
									columnId={column._id}
									setRerenderSignal={setRerenderSignal}
								/>
						<AddTask addTask={addTask} columnId={column._id} setRerenderSignal={setRerenderSignal}/>
						<Droppable droppableId={`${column._id}-pending`}>
								{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef} className={column.tasks.length < 1 ? 'h-screen' : ''}>
										{column.tasks
											.filter((task) => !task.completed)
											.map((task, index) => (
												<Draggable key={task._id} draggableId={task._id} index={index}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={getStyle(provided.draggableProps.style, snapshot)}
														>
															<Task
																task={task}
																setRerenderSignal={setRerenderSignal}
															/>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
							{column.tasks.some((task) => task.completed) && (
							<Droppable droppableId={`${column._id}-completed`}>
							{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef} className="h-screen">
										<div
											className="cursor-pointer grid grid-cols-3 mt-4"
											onClick={() => {
												toggleShowCompletedTasks(column._id);
											}}
										>
											<div className="">Completed</div>
											<div className="flex justify-center">{column.tasks.filter((task) => task.completed).length || ''}</div>
											<div className="flex justify-end pr-6">
												{column.showCompletedTasks ? (
													<div className="expand_btn max-w-fit">V</div>
												) : (
													<div className="expand_btn hidden_tasks max-w-fit">V</div>
												)}
											</div>
										</div>
										{column.showCompletedTasks &&
											column.tasks.filter((task) => task.completed).map((task, index) => (
												<Draggable key={task._id} draggableId={task._id} index={index + column.tasks.filter((t) => !t.completed).length}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={getStyle(provided.draggableProps.style, snapshot)}
														>
															<Task
																task={task}
																setRerenderSignal={setRerenderSignal}
															/>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
							)}
					</div>
				</div>
			))}
			</DragDropContext>
			<AddColumn setRerenderSignal={setRerenderSignal} currentTable={currentTable}></AddColumn>											
		</>
  );
};

export default Column;