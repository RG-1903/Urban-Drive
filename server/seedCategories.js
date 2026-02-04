import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/category.model.js';

dotenv.config();

const categories = [
    {
        name: 'Luxury',
        subtitle: "Premium vehicles for discerning travelers",
        description: "Experience the pinnacle of automotive excellence with our curated selection of luxury vehicles.",
        features: ["Premium Interiors", "Advanced Technology", "Concierge Service"],
        badge: "Most Popular",
        gradient: "from-amber-500 to-orange-600",
        displayOrder: 1
    },
    {
        name: 'Business',
        subtitle: "Professional transportation solutions",
        description: "Make the right impression with our business-class vehicles designed for corporate excellence.",
        features: ["Corporate Rates", "Flexible Billing", "Priority Support"],
        badge: "Corporate Choice",
        gradient: "from-blue-500 to-indigo-600",
        displayOrder: 2
    },
    {
        name: 'Special',
        subtitle: "Celebrate life's precious moments",
        description: "Transform special events into unforgettable memories with our celebration-ready vehicles.",
        features: ["Event Styling", "Photography Ready", "Special Packages"],
        badge: "Celebration Ready",
        gradient: "from-pink-500 to-rose-600",
        displayOrder: 3
    },
    {
        name: 'SUV',
        subtitle: "Spacious comfort for any journey",
        description: "Perfect for family trips or group travel with ample space and superior comfort.",
        features: ["Extra Space", "All-Terrain Capable", "Family Friendly"],
        badge: "Family Choice",
        gradient: "from-emerald-500 to-teal-600",
        displayOrder: 4
    },
    {
        name: 'Sports',
        subtitle: "Thrilling performance and style",
        description: "Feel the adrenaline with our high-performance sports cars designed for the open road.",
        features: ["High Performance", "Sport Mode", "Head-Turning Style"],
        badge: "Adrenaline Rush",
        gradient: "from-red-500 to-rose-600",
        displayOrder: 5
    }
];

mongoose
    .connect(process.env.DATABASE_URL)
    .then(async () => {
        console.log('DB connection successful!');

        try {
            await Category.deleteMany(); // Clear existing
            await Category.create(categories);
            console.log('Categories seeded successfully!');
        } catch (err) {
            console.error('Error seeding categories:', err);
        }

        process.exit();
    });
