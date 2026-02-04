import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/admin.model.js';
import connectDB from './config/db.js';

dotenv.config();

const createAdmin = async () => {
  await connectDB();
  
  try {
    const adminUsername = 'admin@urbandrive.com';
    const adminPassword = 'password123';

    const deleted = await Admin.deleteOne({ username: adminUsername });
    if (deleted.deletedCount > 0) {
      console.log(`Removed existing admin account: ${adminUsername}`);
    } else {
      console.log('No existing admin found. Ready to create new one.');
    }

    console.log('Creating new admin user in "admins" collection...');
    
    const newAdmin = await Admin.create({
      username: adminUsername,
      password: adminPassword,
    });
    
    console.log('✅ New admin user created successfully!');
    console.log(newAdmin);

  } catch (error) {
    console.error(`Error processing admin user: ${error.message}`);
  }
  
  mongoose.connection.close();
  process.exit();
};

createAdmin();