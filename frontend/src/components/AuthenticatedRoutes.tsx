import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import UserSettings from "./user/UserSettings";
import Auth from "./auth/Auth";
import Unauthorized from "./auth/Unauthorized";
import ChangePassword from "./user/ChangePassword";
import UserInvitations from "./invitation/UserInvitations";
import Main from "./Main";
import { useAppDispatch } from "../redux/hooks";
import { setIsMobile } from '../redux/isMobile';

type AuthenticatedRoutesProps = {
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthenticatedRoutes = ({
  rerenderSignal,
  setRerenderSignal,
}: AuthenticatedRoutesProps) => {
  const dispatch = useAppDispatch()

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check if the window width corresponds to mobile
  const checkMobile = () => {
    dispatch(setIsMobile(window.innerWidth <= 768));
  };

  // Add event listener for window resize
  useEffect(() => {
    // Initially check the mobile status
    checkMobile();

    // Event listener for window resize
    const handleResize = () => {
      checkMobile();
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Auth
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    >
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
        />
        <Route
          path="/user"
          element={
            isLoggedIn ? (
              <UserSettings/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/invitations"
          element={
            isLoggedIn ? (
              <UserInvitations/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/changepassword"
          element={
            isLoggedIn ? (
              <ChangePassword />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Unauthorized />
            ) : (
              <Main
                rerenderSignal={rerenderSignal}
                setRerenderSignal={setRerenderSignal}
              ></Main>
            )
          }
        ></Route>
      </Routes>
    </Auth>
  );
};

export default AuthenticatedRoutes;
