import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // changed here
import App from './App.tsx';
import Login from './components/Loginpage.tsx';
import Signup from './components/Signup.tsx';
import User from './components/User/User.tsx';
import Verifier from "./components/Verifier/Verifier.tsx";
import Admin from './components/Admin/Main.tsx';
import AdminDashBoard from './components/Admin/DashBoard.tsx';
import './index.css';
import { ChatBot } from "./components/ChatBot.tsx";

createRoot(document.getElementById('root')!).render(
  <>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
        <Route path="/verifier" element={<Verifier />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
      </Routes>
    </Router>
    <ChatBot />
    </>
);
