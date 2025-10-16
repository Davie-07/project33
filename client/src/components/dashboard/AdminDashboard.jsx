import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, MessageSquare, Bell, Edit2, Trash2, Plus, Send, Reply, X } from 'lucide-react';
import useStore from '../../store/useStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const users = useStore((state) => state.users);
  const messages = useStore((state) => state.messages);
  const logout = useStore((state) => state.logout);
  const updateMember = useStore((state) => state.updateMember);
  const deleteMember = useStore((state) => state.deleteMember);
  const deleteMessage = useStore((state) => state.deleteMessage);
  const replyToMessage = useStore((state) => state.replyToMessage);
  const createAnnouncement = useStore((state) => state.createAnnouncement);
  const deleteAnnouncement = useStore((state) => state.deleteAnnouncement);
  const announcements = useStore((state) => state.announcements);
  const register = useStore((state) => state.register);
  
  const [activeTab, setActiveTab] = useState('members');
  const [editingMember, setEditingMember] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    password: 'defaultPassword123'
  });
  
  const [announcementForm, setAnnouncementForm] = useState({
    content: '',
    targetAudience: 'all',
    targetMembers: [],
    expiryDate: ''
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleEditMember = (member) => {
    setEditingMember({
      ...member,
      originalId: member.id
    });
  };
  
  const handleSaveEdit = () => {
    if (editingMember) {
      const updates = {};
      
      if (editingMember.email !== users.find(u => u.id === editingMember.originalId).email) {
        updates.email = editingMember.email;
      }
      if (editingMember.phone !== users.find(u => u.id === editingMember.originalId).phone) {
        updates.phone = editingMember.phone;
      }
      if (editingMember.memberId !== users.find(u => u.id === editingMember.originalId).memberId) {
        updates.memberId = editingMember.memberId;
      }
      
      if (Object.keys(updates).length > 0) {
        updateMember(editingMember.originalId, updates);
        alert('Change request sent to member for approval');
      }
      
      setEditingMember(null);
    }
  };
  
  const handleDeleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMember(memberId);
      alert('Member deleted successfully');
    }
  };
  
  const handleReply = (messageId) => {
    if (replyMessage.trim()) {
      replyToMessage(messageId, replyMessage);
      setReplyingTo(null);
      setReplyMessage('');
      alert('Reply sent successfully');
    }
  };
  
  const handleCreateMember = (e) => {
    e.preventDefault();
    register(newMemberData);
    setShowNewMemberForm(false);
    setNewMemberData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      occupation: '',
      password: 'defaultPassword123'
    });
    alert('New member created successfully');
  };
  
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    createAnnouncement(announcementForm);
    setAnnouncementForm({
      content: '',
      targetAudience: 'all',
      targetMembers: [],
      expiryDate: ''
    });
    alert('Announcement created successfully');
  };
  
  const members = users.filter(u => u.role !== 'admin');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next 4 us Team - Admin Panel
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
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-gray-800">{members.length}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Messages</p>
                <p className="text-3xl font-bold text-gray-800">{messages.length}</p>
              </div>
              <MessageSquare className="text-purple-600" size={32} />
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Announcements</p>
                <p className="text-3xl font-bold text-gray-800">{announcements.length}</p>
              </div>
              <Bell className="text-pink-600" size={32} />
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 whitespace-nowrap ${
                activeTab === 'members' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 whitespace-nowrap ${
                activeTab === 'messages' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 whitespace-nowrap ${
                activeTab === 'announcements' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Announcements
            </button>
          </div>
          
          <div className="p-6">
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Member Management</h3>
                  <button
                    onClick={() => setShowNewMemberForm(true)}
                    className="btn-primary flex items-center space-x-2 py-2"
                  >
                    <Plus size={20} />
                    <span>Add Member</span>
                  </button>
                </div>
                
                {showNewMemberForm && (
                  <form onSubmit={handleCreateMember} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-3">Create New Member</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="input-field"
                        value={newMemberData.firstName}
                        onChange={(e) => setNewMemberData({...newMemberData, firstName: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="input-field"
                        value={newMemberData.lastName}
                        onChange={(e) => setNewMemberData({...newMemberData, lastName: e.target.value})}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={newMemberData.email}
                        onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="input-field"
                        value={newMemberData.phone}
                        onChange={(e) => setNewMemberData({...newMemberData, phone: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Occupation"
                        className="input-field"
                        value={newMemberData.occupation}
                        onChange={(e) => setNewMemberData({...newMemberData, occupation: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex space-x-3 mt-3">
                      <button type="submit" className="btn-primary py-2">Create</button>
                      <button
                        type="button"
                        onClick={() => setShowNewMemberForm(false)}
                        className="btn-secondary py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">ID</th>
                        <th className="text-left py-2 px-2">Name</th>
                        <th className="text-left py-2 px-2">Email</th>
                        <th className="text-left py-2 px-2">Phone</th>
                        <th className="text-left py-2 px-2">Occupation</th>
                        <th className="text-left py-2 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="py-2 px-2">
                            {editingMember?.originalId === member.id ? (
                              <input
                                type="text"
                                value={editingMember.memberId}
                                onChange={(e) => setEditingMember({...editingMember, memberId: e.target.value})}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            ) : (
                              `#${member.memberId}`
                            )}
                          </td>
                          <td className="py-2 px-2">{member.firstName} {member.lastName}</td>
                          <td className="py-2 px-2">
                            {editingMember?.originalId === member.id ? (
                              <input
                                type="email"
                                value={editingMember.email}
                                onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              member.email
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {editingMember?.originalId === member.id ? (
                              <input
                                type="tel"
                                value={editingMember.phone}
                                onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              member.phone
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {member.occupation}
                            {member.isStudent && ` (${member.institution})`}
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex space-x-2">
                              {editingMember?.originalId === member.id ? (
                                <>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingMember(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditMember(member)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Member Messages</h3>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{msg.senderEmail}</p>
                            <p className="text-sm text-gray-500">{msg.senderPhone}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(msg.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-800 mb-3">{msg.content}</p>
                        
                        {msg.reply && (
                          <div className="bg-blue-50 rounded p-3 mt-2">
                            <p className="text-sm font-semibold text-blue-800">Admin Reply:</p>
                            <p className="text-blue-700">{msg.reply}</p>
                          </div>
                        )}
                        
                        {replyingTo === msg.id ? (
                          <div className="mt-3">
                            <textarea
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your reply..."
                              className="w-full h-20 px-3 py-2 border rounded-lg"
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => handleReply(msg.id)}
                                className="btn-primary py-2 text-sm"
                              >
                                Send Reply
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyMessage('');
                                }}
                                className="btn-secondary py-2 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-3 mt-3">
                            {!msg.reply && (
                              <button
                                onClick={() => setReplyingTo(msg.id)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                              >
                                <Reply size={16} />
                                <span>Reply</span>
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No messages yet</p>
                )}
              </div>
            )}
            
            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Make an Announcement</h3>
                
                <form onSubmit={handleCreateAnnouncement} className="bg-gray-50 rounded-lg p-4 mb-6">
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                    placeholder="Type your announcement..."
                    className="w-full h-24 px-3 py-2 border rounded-lg mb-3"
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <select
                      value={announcementForm.targetAudience}
                      onChange={(e) => setAnnouncementForm({...announcementForm, targetAudience: e.target.value})}
                      className="input-field"
                    >
                      <option value="all">Send to All Members</option>
                      <option value="specific">Specific Members</option>
                    </select>
                    
                    <input
                      type="datetime-local"
                      value={announcementForm.expiryDate}
                      onChange={(e) => setAnnouncementForm({...announcementForm, expiryDate: e.target.value})}
                      className="input-field"
                      placeholder="Expiry Date (optional)"
                    />
                  </div>
                  
                  {announcementForm.targetAudience === 'specific' && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Select Members:</p>
                      <div className="max-h-32 overflow-y-auto border rounded p-2">
                        {members.map((member) => (
                          <label key={member.id} className="flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              checked={announcementForm.targetMembers.includes(member.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAnnouncementForm({
                                    ...announcementForm,
                                    targetMembers: [...announcementForm.targetMembers, member.id]
                                  });
                                } else {
                                  setAnnouncementForm({
                                    ...announcementForm,
                                    targetMembers: announcementForm.targetMembers.filter(id => id !== member.id)
                                  });
                                }
                              }}
                            />
                            <span className="text-sm">{member.firstName} {member.lastName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Send size={20} />
                    <span>Publish Announcement</span>
                  </button>
                </form>
                
                <h4 className="font-semibold mb-3">Active Announcements</h4>
                {announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-gray-800">{announcement.content}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                              {announcement.expiryDate && (
                                <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                              )}
                              <span>
                                {announcement.targetAudience === 'all' 
                                  ? 'All Members' 
                                  : `${announcement.targetMembers.length} Members`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAnnouncement(announcement.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active announcements</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
