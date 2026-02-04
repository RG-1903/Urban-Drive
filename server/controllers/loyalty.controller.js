import LoyaltyReward from '../models/loyaltyReward.model.js';
import LoyaltyTransaction from '../models/loyaltyTransaction.model.js';
import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getLoyaltyStatus = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const history = await LoyaltyTransaction.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Get all active rewards for the user to see
    const availableRewards = await LoyaltyReward.find({ isActive: true }).sort({ pointsCost: 1 });

    res.status(200).json({
        status: 'success',
        data: {
            points: user.loyaltyPoints,
            tier: user.loyaltyTier,
            history,
            availableRewards
        }
    });
});

export const redeemReward = catchAsync(async (req, res, next) => {
    const { rewardId } = req.body;
    const user = await User.findById(req.user.id);
    const reward = await LoyaltyReward.findById(rewardId);

    if (!reward) {
        return next(new AppError('Reward not found', 404));
    }

    if (user.loyaltyPoints < reward.pointsCost) {
        return next(new AppError('Insufficient points', 400));
    }

    // Deduct points
    user.loyaltyPoints -= reward.pointsCost;
    await user.save({ validateBeforeSave: false });

    // Create transaction record
    await LoyaltyTransaction.create({
        user: user._id,
        points: -reward.pointsCost,
        type: 'redeemed',
        description: `Redeemed reward: ${reward.title}`
    });

    res.status(200).json({
        status: 'success',
        data: {
            points: user.loyaltyPoints,
            message: 'Reward redeemed successfully'
        }
    });
});

export const getAllRewards = catchAsync(async (req, res, next) => {
    // If admin, show all. If user, show only active.
    const filter = req.user.role === 'admin' ? {} : { isActive: true };

    const rewards = await LoyaltyReward.find(filter).sort({ pointsCost: 1 });

    res.status(200).json({
        status: 'success',
        results: rewards.length,
        data: {
            rewards
        }
    });
});

export const createReward = catchAsync(async (req, res, next) => {
    const newReward = await LoyaltyReward.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            reward: newReward
        }
    });
});

export const updateReward = catchAsync(async (req, res, next) => {
    const reward = await LoyaltyReward.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!reward) {
        return next(new AppError('No reward found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            reward
        }
    });
});

export const deleteReward = catchAsync(async (req, res, next) => {
    const reward = await LoyaltyReward.findByIdAndDelete(req.params.id);

    if (!reward) {
        return next(new AppError('No reward found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
