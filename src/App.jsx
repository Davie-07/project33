import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import useStore from './store/useStore';

function App() {
  const currentUser = useStore((state) => state.currentUser);
  const register = useStore((state) => state.register);
  
  // Initialize with admin account if no users exist
  useEffect(() => {
    const users = useStore.getState().users;
    if (users.length === 0) {
      register({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@next4us.com',
        phone: '+254700000000',
        occupation: 'System Administrator',
        password: 'admin123',
        isStudent: false
      });
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={
            currentUser && currentUser.role !== 'admin' 
              ? <UserDashboard /> 
              : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin" 
          element={
            currentUser && currentUser.role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
