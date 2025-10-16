import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Bell, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import useStore from '../../store/useStore';

const UserDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const sendMessage = useStore((state) => state.sendMessage);
  const getUserAnnouncements = useStore((state) => state.getUserAnnouncements);
  const pendingChanges = useStore((state) => state.pendingChanges);
  const acceptChange = useStore((state) => state.acceptChange);
  const declineChange = useStore((state) => state.declineChange);
  
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    // Check for pending changes for this user
    const userChanges = pendingChanges.filter(c => c.userId === currentUser?.id && c.status === 'pending');
    setNotifications(userChanges);
  }, [pendingChanges, currentUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      alert('Message sent to admin successfully!');
    }
  };
  
  const handleAcceptChange = (changeId) => {
    const result = acceptChange(changeId);
    alert(result.message);
  };
  
  const handleDeclineChange = (changeId) => {
    const result = declineChange(changeId);
    alert(result.message);
  };
  
  const maskPhone = (phone) => {
    if (!phone || phone.length < 10) return phone;
    const start = phone.slice(0, 7);
    const end = phone.slice(-2);
    return `${start} *** *** ${end}`;
  };
  
  const maskEmail = (email) => {
    if (!email) return email;
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '***';
    return `${maskedUsername}@${domain}`;
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const announcements = getUserAnnouncements();
  
  if (!currentUser) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next 4 us Team
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {getGreeting()}, {currentUser.firstName}! 👋
          </h2>
          <p className="text-gray-600 mt-2">Welcome back to your dashboard</p>
        </div>
        
        {/* Notifications for pending changes */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.map((change) => (
              <div key={change.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 mb-3">
                  Admin has requested to update your account information:
                </p>
                <div className="space-y-1 mb-3">
                  {change.updates.email && (
                    <p className="text-sm">• Email: {change.updates.email}</p>
                  )}
                  {change.updates.phone && (
                    <p className="text-sm">• Phone: {change.updates.phone}</p>
                  )}
                  {change.updates.memberId && (
                    <p className="text-sm">• Member ID: {change.updates.memberId}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAcceptChange(change.id)}
                    className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleDeclineChange(change.id)}
                    className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Member Card */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Member Information</h3>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Member ID</p>
              <p className="font-semibold text-lg">#{currentUser.memberId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-lg">{currentUser.firstName} {currentUser.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold text-lg">{maskPhone(currentUser.phone)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-lg">{maskEmail(currentUser.email)}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 ${
                activeTab === 'home' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={20} />
              <span>Message Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 ${
                activeTab === 'announcements' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell size={20} />
              <span>Announcements</span>
              {announcements.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {announcements.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'home' ? (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Send Message to Admin</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Send size={20} />
                  <span>SUBMIT</span>
                </button>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Announcements</h3>
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800">{announcement.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No announcements at this time</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
