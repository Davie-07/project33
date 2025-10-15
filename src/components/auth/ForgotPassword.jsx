import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import useStore from '../../store/useStore';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const findUserByEmailAndPhone = useStore((state) => state.findUserByEmailAndPhone);
  const resetPassword = useStore((state) => state.resetPassword);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState('');
  
  const handleFindAccount = (e) => {
    e.preventDefault();
    setError('');
    
    const user = findUserByEmailAndPhone(formData.email, formData.phone);
    
    if (user) {
      setFoundUser(user);
      setStep(2);
    } else {
      setError('No account found with this email and phone number combination');
    }
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    resetPassword(foundUser.id, formData.newPassword);
    alert('Password reset successful! Please login with your new password.');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Login
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Lock className="text-white" size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">
            {step === 1 ? 'Find Your Account' : 'Reset Password'}
          </h1>
          
          {step === 1 ? (
            <form onSubmit={handleFindAccount} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              
              <button type="submit" className="btn-primary w-full">
                Find Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4">
                Account found for: {foundUser.firstName} {foundUser.lastName}
              </div>
              
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                required
              />
              
              <input
                type="password"
                placeholder="Confirm New Password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              
              <button type="submit" className="btn-primary w-full">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
