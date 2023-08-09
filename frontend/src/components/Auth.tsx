import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { User } from "./Types";

type AuthProps = {
  children: React.ReactNode;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Auth: React.FC<AuthProps> = ({
  children,
  setUser,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check user's login status
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/users/protected",
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const getUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/user", {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUser({
            _id: response.data.id,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            level: response.data.level,
            userIconId: response.data.iconId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          });
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Auth;
