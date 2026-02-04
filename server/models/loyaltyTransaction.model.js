import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Transaction must belong to a user']
    },
    points: {
        type: Number,
        required: [true, 'Transaction must have a points value']
    },
    type: {
        type: String,
        enum: ['earned', 'redeemed', 'adjustment'],
        required: [true, 'Transaction must have a type']
    },
    description: {
        type: String,
        required: [true, 'Transaction must have a description']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for quick history lookups
loyaltyTransactionSchema.index({ user: 1, createdAt: -1 });

const LoyaltyTransaction = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);

export default LoyaltyTransaction;
