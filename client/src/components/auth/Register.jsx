import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import useStore from '../../store/useStore';

const Register = () => {
  const navigate = useNavigate();
  const register = useStore((state) => state.register);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    occupation: '',
    isStudent: false,
    institution: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const passwordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-orange-500' },
      2: { text: 'Fair', color: 'bg-yellow-500' },
      3: { text: 'Good', color: 'bg-blue-500' },
      4: { text: 'Strong', color: 'bg-green-500' }
    };
    
    return { strength, ...strengthMap[strength] };
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const user = register(formData);
    useStore.setState({ currentUser: user });
    navigate('/verify-email');
  };
  
  const strength = passwordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Next 4 us Team
          </h1>
          <p className="text-center text-gray-600 mb-6">Create your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input-field"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input-field"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
            <input
              type="tel"
              placeholder="Phone Number"
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Occupation"
                className="input-field"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                required
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isStudent"
                  checked={formData.isStudent}
                  onChange={(e) => setFormData({...formData, isStudent: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isStudent" className="text-sm text-gray-700">
                  I am a student
                </label>
              </div>
              
              {formData.isStudent && (
                <input
                  type="text"
                  placeholder="Institution Name"
                  className="input-field"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  required={formData.isStudent}
                />
              )}
            </div>
            
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-field pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password Strength:</span>
                    <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="input-field pr-10"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              
              {formData.confirmPassword && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check className="text-green-500" size={20} />
                  ) : (
                    <X className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
            
            <button type="submit" className="btn-primary w-full">
              Register
            </button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
