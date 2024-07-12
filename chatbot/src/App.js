import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from "./Screens/LandingPage";
import Chat from "./Screens/Chat";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route
            exact
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            exact
            path="/signup"
            element={<SignUp setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            exact
            path="/chat"
            element={<Chat isAuthenticated={isAuthenticated} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
