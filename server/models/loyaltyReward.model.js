import mongoose from 'mongoose';

const loyaltyRewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A reward must have a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pointsCost: {
        type: Number,
        required: [true, 'A reward must have a points cost']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LoyaltyReward = mongoose.model('LoyaltyReward', loyaltyRewardSchema);

export default LoyaltyReward;
