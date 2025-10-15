require('dotenv').config({ path: __dirname + '/.env' });

// Add environment validation
const requiredEnvVars = ['MONGODB_URI', 'PORT'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined in environment variables`);
    process.exit(1);
  }
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : 'http://localhost:3000'
}));
app.use(express.json());

// Connect to MongoDB Atlas
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    console.log('Server Environment:', process.env.NODE_ENV || 'development');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Define Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  occupation: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  institution: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberId: { type: String, required: true },
  role: { type: String, default: 'member' },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderEmail: String,
  senderPhone: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  reply: String,
  repliedAt: Date
});

const announcementSchema = new mongoose.Schema({
  content: String,
  targetAudience: { type: String, enum: ['all', 'specific'], default: 'all' },
  targetMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiryDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const pendingChangeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updates: {
    email: String,
    phone: String,
    memberId: String
  },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const PendingChange = mongoose.model('PendingChange', pendingChangeSchema);

// Helper function to generate member ID
const generateMemberId = (email, phone) => {
  const emailHash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phoneHash = phone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combined = (emailHash + phoneHash) % 100000;
  return String(combined).padStart(5, '0');
};

// Add this helper function after generateMemberId function
const maskPhoneNumber = (phone) => {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(8)}`;
};

// API Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, phone, occupation, isStudent, institution, email, password } = req.body;
    
    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate member ID
    const memberId = generateMemberId(email, phone);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      phone,
      occupation,
      isStudent,
      institution,
      email,
      password: hashedPassword,
      memberId,
      role: email === 'admin@next4us.com' ? 'admin' : 'member'
    });
    
    await newUser.save();
    
    // Modify the response to mask the phone number
    const userResponse = newUser.toObject();
    userResponse.phone = maskPhoneNumber(userResponse.phone);
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const userResponse = user.toObject();
    userResponse.phone = maskPhoneNumber(userResponse.phone);
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userResponse = user.toObject();
    userResponse.phone = maskPhoneNumber(userResponse.phone);
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all members (non-admin users)
app.get('/api/members', async (req, res) => {
  try {
    const members = await User.find({ role: 'member' });
    const maskedMembers = members.map(member => {
      const memberObj = member.toObject();
      memberObj.phone = maskPhoneNumber(memberObj.phone);
      return memberObj;
    });
    res.json(maskedMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this line after all the models are defined
module.exports = { User, Message, Announcement, PendingChange };
