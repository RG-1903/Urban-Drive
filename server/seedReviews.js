import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from './models/review.model.js';
import User from './models/user.model.js';
import Vehicle from './models/vehicle.model.js';

dotenv.config();

const testimonials = [
    {
        name: "James Wilson",
        role: "CEO",
        company: "Wilson Tech",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        quote: `I've used many luxury car services, but RentLux Pro is in a league of its own. The attention to detail is unmatched.`,
        experience: "Executive Fleet",
        location: "Chicago, IL",
        verified: true
    },
    {
        name: "Elena Rodriguez",
        role: "Event Planner",
        company: "Luxe Events",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        quote: `My clients demand perfection, and RentLux Pro delivers every time. The vehicles are always spotless and the drivers are professional.`,
        experience: "Event Transport",
        location: "Los Angeles, CA",
        verified: true
    },
    {
        name: "David Kim",
        role: "Architect",
        company: "Modern Spaces",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        quote: `The booking process is seamless and the car selection is incredible. I highly recommend RentLux Pro for any business or leisure travel.`,
        experience: "Luxury SUV",
        location: "Seattle, WA",
        verified: true
    }
];

mongoose
    .connect(process.env.DATABASE_URL)
    .then(async () => {
        console.log('DB connection successful!');

        try {
            // 1. Get a vehicle to attach reviews to
            const vehicle = await Vehicle.findOne();
            if (!vehicle) {
                console.error('No vehicles found to attach reviews to!');
                process.exit(1);
            }

            // Clear existing featured reviews
            await Review.deleteMany({ isFeatured: true });
            console.log('Cleared existing featured reviews.');

            // 2. Create users and reviews
            for (const t of testimonials) {
                // Create a user for the testimonial
                const [firstName, lastName] = t.name.split(' ');
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        firstName,
                        lastName,
                        email,
                        password: 'password123',
                        passwordConfirm: 'password123',
                        avatar: t.image,
                        role: 'user'
                    });
                    console.log(`Created user: ${t.name}`);
                } else {
                    // Update avatar if user exists
                    user.avatar = t.image;
                    await user.save({ validateBeforeSave: false });
                }

                // Create the review
                await Review.create({
                    review: t.quote,
                    rating: t.rating,
                    vehicle: vehicle._id,
                    user: user._id,
                    userTitle: t.role,
                    userCompany: t.company,
                    userLocation: t.location,
                    isFeatured: true
                });
                console.log(`Created review for: ${t.name}`);
            }

            console.log('Reviews seeded successfully!');
        } catch (err) {
            console.error('Error seeding reviews:', err);
        }

        process.exit();
    });
