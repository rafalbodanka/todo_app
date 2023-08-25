import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('Login Component', () => {
    it('logs in successfully', async () => {
      // Mock axios.post to simulate a successful login
      const axios = require('axios');
      axios.post.mockResolvedValue({ status: 200 });
  
      const setIsLoggedInMock = jest.fn();

      // Render the Login component
      const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <Login setIsLoggedIn={setIsLoggedInMock} />
        </MemoryRouter>
      );
  
      // Simulate user input
      const emailInput = getByLabelText('email');
      const passwordInput = getByLabelText('password');
      fireEvent.change(emailInput, { target: { value: 'user4@user.com' } });
      fireEvent.change(passwordInput, { target: { value: 'User1user1!' } });
  
      // Simulate a button click to trigger login
      const loginButton = getByText('Log in');
      fireEvent.click(loginButton);
  
    // Wait for the login to complete
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:5000/users/login',
          {
            email: 'user4@user.com',
            password: 'User1user1!',
          },
          { withCredentials: true }
        );
      });
      expect(setIsLoggedInMock).toHaveBeenCalled();

    });
  });