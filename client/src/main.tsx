import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Login from './components/Loginpage.tsx';
import Signup from './components/Signup.tsx';
import User from './components/User/User.tsx';
import UserDashBoard from "./components/User/DashBoard.tsx"
import Verifier from "./components/Verifier/Verifier.tsx"
import VerifierDashBoard from "./components/Verifier/DashBoard.tsx"
import Admin from './components/Admin/Main.tsx';
import AdminDashBoard from './components/Admin/DashBoard.tsx';
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
      <Route path="/admin" element={<Admin />} />
      <Route path="/user/dashboard" element={<UserDashBoard />} />
      <Route path="/verifier/dashboard" element={<VerifierDashBoard />} />
      <Route path="/admin/dashboard" element={<AdminDashBoard />} />
      
      </Routes>
    </Router>
  </StrictMode>
);
