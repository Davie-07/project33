import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import useStore from '../../store/useStore';

const EmailVerification = () => {
  const navigate = useNavigate();
  const skipVerification = useStore((state) => state.skipVerification);
  const currentUser = useStore((state) => state.currentUser);
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  
  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };
  
  const handleVerify = () => {
    const code = verificationCode.join('');
    
    if (code.length === 6) {
      setError('This feature is under development, please skip and login');
    } else {
      setError('Please enter all 6 digits');
    }
  };
  
  const handleSkip = () => {
    skipVerification();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Mail className="text-white" size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Verify Your Email</h1>
          <p className="text-center text-gray-600 mb-6">
            We've sent a verification code to<br />
            <span className="font-medium">{currentUser?.email}</span>
          </p>
          
          <div className="flex justify-center space-x-2 mb-6">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            ))}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <button onClick={handleVerify} className="btn-primary w-full mb-4">
            Verify Email
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip Verification & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
