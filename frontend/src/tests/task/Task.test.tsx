import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Task from '../../components/task/Task';
import axios from 'axios';

jest.mock('axios');

const setRerenderSignal = jest.fn();
const setIsDraggingPossible = jest.fn();
const mockStore = configureStore([]);

const initialState = {
  ui: {
    isMobile: false,
  },
  currentTable: {
    title: "test table title",
    users: [],
    __v: 1,
    _id: "33612",
    columns: [
      {
        _id: "2512512",
        title: "test column title",
        pendingTasks: [
          {
            _id: "16",
            title: "Test task title",
            completed: true,
            column: "2512512",
            notes: "notes test",
            createdAt: "5125125",
            updatedAt: "5125125",
            responsibleUsers: [],
            isEstimated: false,
            difficulty: 5,
            startDate: "123021",
            endDate: "123021",
          },
        ],
        completedTasks: [],
        showCompletedTasks: true,
      },
    ],
  },
};
const store = mockStore(initialState);

// Define a sample task based on your TaskType
const task = {
  _id: "16",
  title: "Test task title",
  completed: true,
  column: "2512512",
  notes: "notes test",
  createdAt: "5125125",
  updatedAt: "5125125",
  responsibleUsers: [],
  isEstimated: false,
  difficulty: 5,
  startDate: "123021",
  endDate: "123021",
};


describe('Login Component', () => {
    it('logs in successfully', async () => {

      // Render the Login component
      const { getByText } = render(
        <Provider store={store} >
          <Task 
            columnId={"2512512"}
            task={task}
            setRerenderSignal={setRerenderSignal}
            setIsDraggingPossible={setIsDraggingPossible}
            currentTableId={"33612"}/>
        </Provider>
      );
    
      const taskTitleElement = getByText(task.title);
      expect(taskTitleElement).toBeInTheDocument;
  });
  
  it('handles task status toggle correctly', async () => {
    // Mock Axios response for the status toggle
    const axiosMock = axios as jest.Mocked<typeof axios>;
    axiosMock.post.mockResolvedValue({ status: 200, data: {
      data: {
        currentTable: {
          title: "test table title",
          users: [],
          __v: 1,
          _id: "33612",
          columns: [
            {
              _id: "2512512",
              title: "test column title",
              pendingTasks: [
                {
                  _id: "16",
                  title: "Test task title",
                  completed: false,
                  column: "2512512",
                  notes: "notes test",
                  createdAt: "5125125",
                  updatedAt: "5125125",
                  responsibleUsers: [],
                  isEstimated: false,
                  difficulty: 5,
                  startDate: "123021",
                  endDate: "123021",
                },
              ],
              completedTasks: [],
              showCompletedTasks: true,
            },
          ],
        },
      }
    } });
    
    // Render the Task component
    const { getByAltText } = render(
      <Provider store={store}>
        <Task
          task={task}
          columnId="2512512"
          setRerenderSignal={setRerenderSignal}
          setIsDraggingPossible={setIsDraggingPossible}
          currentTableId="33612"
          />
      </Provider>
    );
    
    // Simulate clicking the task checkbox
    const checkbox = getByAltText("16 checkbox");
    fireEvent.click(checkbox);
    
    // Wait for the login to complete
    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalledWith(
        `http://localhost:5000/tasks/${task._id}/status`,
        { taskCompleted: task.completed, taskColumn: "2512512", currentTableId: "33612" },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
        );
      });
      expect(checkbox).toBeChecked
    })
  });
