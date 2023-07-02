import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthenticatedRoutes from "./components/AuthenticatedRoutes";

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

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    level: "",
    userIconId: 0,
    createdAt: "",
    updatedAt: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rerenderSignal, setRerenderSignal] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <AuthenticatedRoutes
                user={user}
                setUser={setUser}
                rerenderSignal={rerenderSignal}
                setRerenderSignal={setRerenderSignal}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
