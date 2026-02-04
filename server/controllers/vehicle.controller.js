import Category from '../models/category.model.js';
import Vehicle from '../models/vehicle.model.js';
import Booking from '../models/booking.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getFeaturedCollections = catchAsync(async (req, res, next) => {
  // 1. Get all categories sorted by display order
  const categories = await Category.find().sort('displayOrder');

  // 2. Aggregate vehicle stats by category
  const vehicleStats = await Vehicle.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$category',
        recentVehicle: { $first: '$$ROOT' },
        count: { $sum: 1 },
        startingPrice: { $min: '$pricePerDay' }
      }
    }
  ]);

  // 3. Merge stats into categories
  const collections = categories.map(cat => {
    const stat = vehicleStats.find(s => s._id === cat.name);

    // If no vehicles in this category, return null or a placeholder
    // For now, we'll return the category with default/empty values if no vehicles found
    if (!stat) {
      return {
        ...cat.toObject(),
        image: null, // Or a default placeholder
        alt: 'No vehicles available',
        count: 0,
        startingPrice: 0
      };
    }

    return {
      ...cat.toObject(),
      image: stat.recentVehicle.image,
      alt: stat.recentVehicle.name,
      count: stat.count,
      startingPrice: stat.startingPrice
    };
  }).filter(c => c.count > 0); // Optional: Only show categories with vehicles

  res.status(200).json({
    status: 'success',
    results: collections.length,
    data: {
      collections,
    },
  });
});

export const getVehicleRecommendations = catchAsync(async (req, res, next) => {
  const lastBooking = await Booking.findOne({ user: req.user.id }).sort('-createdAt').populate('vehicle');

  let recommendations = [];

  if (lastBooking && lastBooking.vehicle) {
    recommendations = await Vehicle.find({
      category: lastBooking.vehicle.category,
      _id: { $ne: lastBooking.vehicle._id }
    }).limit(3);
  }

  if (recommendations.length < 3) {
    const fallback = await Vehicle.find({
      _id: { $nin: recommendations.map(r => r._id) }
    }).sort('-ratingAverage').limit(3 - recommendations.length);
    recommendations = [...recommendations, ...fallback];
  }

  res.status(200).json({
    status: 'success',
    results: recommendations.length,
    data: {
      recommendations,
    },
  });
});

export const getVehicleAvailability = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.params;
  const { month, year } = req.query;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const bookings = await Booking.find({
    vehicle: vehicleId,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  }).select('startDate endDate');

  const bookedDates = {};
  bookings.forEach(booking => {
    let currentDate = new Date(booking.startDate);
    const lastDate = new Date(booking.endDate);

    while (currentDate <= lastDate) {
      if (currentDate >= startDate && currentDate <= endDate) {
        bookedDates[currentDate.toISOString().split('T')[0]] = 'booked';
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      availability: bookedDates,
    },
  });
});

export const getAllVehicles = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Vehicle.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const vehicles = await features.query;

  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

export const getVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('reviews');

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
});

export const createVehicle = catchAsync(async (req, res, next) => {
  const newVehicle = await Vehicle.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      vehicle: newVehicle,
    },
  });
});

export const updateVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
});

export const deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getVehicleCategoryCounts = catchAsync(async (req, res, next) => {
  const stats = await Vehicle.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: '$count',
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
