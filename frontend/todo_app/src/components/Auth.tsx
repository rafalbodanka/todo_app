import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

type AuthProps = {
  children: React.ReactNode;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const Auth: React.FC<AuthProps> = ({ children, setUsername }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user's login status
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/protected',
        { 
          withCredentials: true,
          headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        })
        if (response.status === 200) {
          setIsLoggedIn(true)
          setUsername(response.data.email)
          console.log(response)
        }
      } catch (err) {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
          <div className="p-10 bg-slate-300 rounded-xl shadow-xl">
            <div className="flex justify-center">
            <p className="text-base mb-2">Don't have an account yet?<span className="text-purple-500 font-700 cursor-pointer"> <Link to="/signup">Sign up</Link></span></p>
            </div>
            <p className="text-base">Already have an account?
              <span className="text-purple-500 font-700 cursor-pointer"> <Link to="/login">Log in</Link></span>
            </p>
          </div>
        </div>
    );
  }

  return <>{children}</>;
};

export default Auth;