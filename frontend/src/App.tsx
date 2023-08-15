import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User } from "./components/Types";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes";

const App: React.FC = () => {
  const [rerenderSignal, setRerenderSignal] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <AuthenticatedRoutes
                rerenderSignal={rerenderSignal}
                setRerenderSignal={setRerenderSignal}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
