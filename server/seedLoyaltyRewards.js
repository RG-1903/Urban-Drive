import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoyaltyReward from './models/loyaltyReward.model.js';

dotenv.config({ path: './.env' });

const rewards = [
    {
        title: 'Free Day Rental',
        description: 'Get one day free on your next rental of any vehicle class.',
        pointsCost: 1000,
        isActive: true
    },
    {
        title: 'Upgrade to Premium',
        description: 'Free upgrade to the next vehicle class on your next booking.',
        pointsCost: 500,
        isActive: true
    },
    {
        title: '$50 Discount',
        description: 'Get $50 off your next rental total.',
        pointsCost: 750,
        isActive: true
    },
    {
        title: 'Full Tank of Gas',
        description: 'Start your trip with a full tank on us, no return fill-up needed.',
        pointsCost: 300,
        isActive: true
    },
    {
        title: 'Chauffeur Service (1 Day)',
        description: 'Enjoy a professional chauffeur for one day of your rental.',
        pointsCost: 5000,
        isActive: true
    }
];

const seedRewards = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Connected');

        await LoyaltyReward.deleteMany();
        console.log('Cleared existing rewards');

        await LoyaltyReward.create(rewards);
        console.log('Seeded new rewards');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedRewards();
