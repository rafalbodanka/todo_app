import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import AuthenticatedRoutes from "./components/AuthenticatedRoutes";

const App: React.FC = () => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    level: "",
    iconId: 0,
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
