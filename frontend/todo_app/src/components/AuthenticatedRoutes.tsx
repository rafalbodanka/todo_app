import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import UserSettings from "./UserSettings";
import Auth from "./Auth";
import Unauthorized from "./Unauthorized";
import ChangePassword from "./ChangePassword";
import UserInvitations from "./UserInvitations";
import Table from "./Table";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
  createdAt: string;
  updatedAt: string;
}

type AuthenticatedRoutesProps = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  rerenderSignal: boolean;
  setRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthenticatedRoutes = ({
  user,
  setUser,
  isLoggedIn,
  setIsLoggedIn,
  rerenderSignal,
  setRerenderSignal,
}: AuthenticatedRoutesProps) => {
  return (
    <Auth
      setUser={setUser}
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
              <UserSettings user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/invitations"
          element={
            isLoggedIn ? <UserInvitations /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/changepassword"
          element={
            isLoggedIn ? (
              <ChangePassword userId={user._id} />
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
                user={user}
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
