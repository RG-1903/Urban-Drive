
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

const debugController = async () => {
    try {
        const userId = '6916cc5c55fb05d759200eda'; // Ravi's ID
        console.log(`Querying bookings for user ID: ${userId}`);

        const bookings = await Booking.find({ user: userId })
            .sort({ startDate: -1 })
            .limit(5)
            .populate({
                path: 'vehicle',
                select: 'name image imageAlt pricePerDay'
            });

        console.log(`Found ${bookings.length} bookings.`);
        if (bookings.length > 0) {
            console.log('Sample booking:', bookings[0]);
        } else {
            console.log('No bookings found. Checking without filter...');
            const allBookings = await Booking.find().limit(1);
            console.log('Any booking in DB:', allBookings[0]);
            if (allBookings.length > 0) {
                console.log('User ID in DB:', allBookings[0].user);
                console.log('User ID type:', typeof allBookings[0].user);
                console.log('Comparison:', allBookings[0].user.toString() === userId);
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
};

debugController();
