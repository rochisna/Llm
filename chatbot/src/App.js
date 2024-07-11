// import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './Screens/LandingPage';
import ChatLoggedIn from "./Screens/ChatLoggedIn";
import ChatUnregistered from './Screens/ChatUnregistered';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/chatunregistered" element={<ChatUnregistered />} />
          <Route exact path="/chatloggedin" element={<ChatLoggedIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;