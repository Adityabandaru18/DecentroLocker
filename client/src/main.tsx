import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Login from './components/Loginpage.tsx';
import Signup from './components/Signup.tsx';
import User from './components/User/User.tsx';
import UserDashBoard from "./components/User/DashBoard.tsx"
import Verifier from "./components/Verifier/Main.tsx"
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user" element={<User />} />
      <Route path="/verifier" element={<Verifier />} />
      <Route path="/user/userdashboard" element={<UserDashBoard />} />

      </Routes>
    </Router>
  </StrictMode>
);
