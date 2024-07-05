import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './Screens/LandingPage';
import Chat from './Screens/Chat';
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
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;