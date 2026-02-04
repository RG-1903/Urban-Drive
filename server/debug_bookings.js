
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Booking from './models/booking.model.js';
import Vehicle from './models/vehicle.model.js';

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE_URL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.error('DB connection failed:', err));

const debugBookings = async () => {
    try {
        const users = await User.find();
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            const bookings = await Booking.find({ user: user._id });
            console.log(`User: ${user.firstName} ${user.lastName} (${user.email}) - Bookings: ${bookings.length}`);
            if (bookings.length > 0) {
                console.log('  Sample Booking:', bookings[0]);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
};

debugBookings();
