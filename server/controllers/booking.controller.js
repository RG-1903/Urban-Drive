import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import LoyaltyTransaction from '../models/loyaltyTransaction.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Helper to check overlaps
const isVehicleAvailable = async (vehicleId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await Booking.find({
    vehicle: vehicleId,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } },
    ],
  });
  return overlappingBookings.length === 0;
};

export const checkAvailability = catchAsync(async (req, res, next) => {
  const { vehicleId, startDate, endDate } = req.query;

  if (!vehicleId || !startDate || !endDate) {
    return next(new AppError('Missing vehicleId, startDate, or endDate', 400));
  }

  const available = await isVehicleAvailable(vehicleId, startDate, endDate);

  res.status(200).json({
    status: 'success',
    available,
  });
});

export const createBooking = catchAsync(async (req, res, next) => {
  const {
    vehicle,
    startDate,
    endDate,
    pickupLocation,
    returnLocation,
    insurance,
    extras,
    paymentMethod,
    totalPrice
  } = req.body;

  if (!vehicle || !startDate || !endDate) {
    return next(new AppError('Missing required booking fields.', 400));
  }

  // Double-check availability before creating
  const available = await isVehicleAvailable(vehicle, startDate, endDate);
  if (!available) {
    return next(new AppError('Vehicle is no longer available for these dates.', 409));
  }

  // Construct Payment Info
  const paymentInfo = {
    status: 'succeeded',
    method: paymentMethod || 'card',
    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };

  const newBooking = await Booking.create({
    user: req.user.id,
    vehicle,
    startDate,
    endDate,
    totalPrice,
    pickupLocation,
    returnLocation,
    insurance: {
      name: insurance?.name || 'Basic',
      price: insurance?.price || 0
    },
    extras: extras || [],
    paymentInfo,
    status: 'confirmed'
  });

  // --- Loyalty Logic ---
  const pointsEarned = Math.floor(totalPrice); // 1 point per $1
  if (pointsEarned > 0) {
    const user = await User.findById(req.user.id);
    user.loyaltyPoints += pointsEarned;

    // Check for Tier Upgrade
    const totalPoints = user.loyaltyPoints;
    let newTier = user.loyaltyTier;

    if (totalPoints >= 5000) newTier = 'Diamond';
    else if (totalPoints >= 2500) newTier = 'Platinum';
    else if (totalPoints >= 1000) newTier = 'Gold';

    if (newTier !== user.loyaltyTier) {
      user.loyaltyTier = newTier;
    }

    await user.save({ validateBeforeSave: false });

    await LoyaltyTransaction.create({
      user: user._id,
      points: pointsEarned,
      type: 'earned',
      description: `Earned from booking #${newBooking._id}`
    });
  }
  // ---------------------

  // Populate for response
  const populatedBooking = await Booking.findById(newBooking._id)
    .populate('vehicle', 'name image category')
    .populate('user', 'firstName lastName email');

  res.status(201).json({
    status: 'success',
    data: {
      booking: populatedBooking,
    },
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('vehicle')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

export const getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle')
    .populate('user');

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  if (
    booking.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new AppError('Permission denied.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

export const getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('user', 'firstName lastName email')
    .populate('vehicle', 'name image imageAlt')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});