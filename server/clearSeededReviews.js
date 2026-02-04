import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from './models/review.model.js';

dotenv.config();

mongoose
    .connect(process.env.DATABASE_URL)
    .then(async () => {
        console.log('DB connection successful!');

        try {
            // Clear featured reviews (which were the seeded ones)
            const result = await Review.deleteMany({ isFeatured: true });
            console.log(`Deleted ${result.deletedCount} seeded reviews.`);

            console.log('Cleanup successful!');
        } catch (err) {
            console.error('Error clearing reviews:', err);
        }

        process.exit();
    });
