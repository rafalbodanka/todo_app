import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import UserSettings from "./UserSettings";
import Auth from "./Auth";
import Unauthorized from "./Unauthorized";
import ChangePassword from "./ChangePassword";
import UserInvitations from "./UserInvitations";
import Table from "./Table";

type AuthenticatedRoutesProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthenticatedRoutes = ({
  isLoggedIn,
  setIsLoggedIn,
  rerenderSignal,
  setRerenderSignal,
}: AuthenticatedRoutesProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Function to check if the window width corresponds to mobile
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
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
              <UserSettings isMobile={isMobile} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/invitations"
          element={
            isLoggedIn ? (
              <UserInvitations isMobile={isMobile} />
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
              <Table
                isMobile={isMobile}
                rerenderSignal={rerenderSignal}
                setRerenderSignal={setRerenderSignal}
              ></Table>
            )
          }
        ></Route>
      </Routes>
    </Auth>
  );
};

export default AuthenticatedRoutes;
