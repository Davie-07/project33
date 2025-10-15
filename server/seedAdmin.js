require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./index.js');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@next4us.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Next4us.com', salt);
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'Next',
        phone: '0701759905',
        occupation: 'Administrator',
        email: 'admin@next4us.com',
        password: hashedPassword,
        memberId: '00001',
        role: 'admin',
        emailVerified: true,
        isStudent: false
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
