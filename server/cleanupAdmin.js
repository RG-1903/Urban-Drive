import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import connectDB from './config/db.js';

dotenv.config();

const cleanupAdmin = async () => {
  await connectDB();
  
  try {
    const adminEmail = 'admin@urbandrive.com';

    const badUser = await User.findOne({ email: adminEmail });

    if (badUser) {
      if (badUser.role === 'admin') {
        await User.deleteOne({ email: adminEmail });
        console.log('✅ Successfully deleted bad admin account from "users" collection.');
      } else {
        console.log('User account is not an admin, leaving it alone.');
      }
    } else {
      console.log('No bad admin account found in "users" collection. All good!');
    }

  } catch (error) {
    console.error(`Error cleaning up admin user: ${error.message}`);
  }
  
  mongoose.connection.close();
  process.exit();
};

cleanupAdmin();