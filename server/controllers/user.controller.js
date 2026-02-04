import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';
import LoyaltyReward from '../models/loyaltyReward.model.js';
import LoyaltyTransaction from '../models/loyaltyTransaction.model.js';
import Vehicle from '../models/vehicle.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ADMIN: GET ALL USERS
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// ADMIN: CREATE USER
export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// ADMIN: UPDATE USER
export const updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'role', 'phone', 'address');

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// ADMIN: DELETE USER
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  await Booking.deleteMany({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


// LOGGED-IN USER: GET SELF
export const getMe = catchAsync(async (req, res, next) => {
  // If the user is an admin, return the admin object from req.user
  if (req.user.role === 'admin') {
    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: req.user._id,
          email: req.user.username,
          firstName: "Admin",
          role: "admin",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1317ce20a-1762248863496.png",
          favorites: { vehicles: [], searches: [] }
        },
      },
    });
  }

  // If the user is a regular user, fetch their populated data
  const user = await User.findById(req.user.id).populate({
    path: 'favorites.vehicles',
    select: 'name image pricePerDay seats fuelType'
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// ADMIN: GET A SINGLE USER
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: 'favorites.vehicles',
    select: 'name image pricePerDay seats fuelType'
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// LOGGED-IN USER: UPDATE SELF
export const updateMe = async (req, res, next) => {
  try {
    console.log('UpdateMe Request Body:', req.body); // DEBUG LOG

    if (req.user.role === 'admin') {
      return next(new AppError('Admin profile cannot be updated here.', 400));
    }

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    const filteredBody = filterObj(
      req.body,
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'dateOfBirth',
      'avatar',
      'avatarAlt'
    );

    // Optimization: Don't update email if it hasn't changed
    if (filteredBody.email === req.user.email) {
      delete filteredBody.email;
    }

    // Ensure dateOfBirth is not empty string if it was passed
    if (filteredBody.dateOfBirth === '') {
      delete filteredBody.dateOfBirth;
    }

    console.log('Filtered Body for Update:', filteredBody); // DEBUG LOG

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new AppError('User not found during update.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.error('UpdateMe Error:', err); // DEBUG LOG
    next(err);
  }
};

// LOGGED-IN USER: DELETE SELF
export const deleteMe = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next(new AppError('Admin account cannot be deleted.', 400));
  }
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// FAVORITES
export const getMyFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'favorites.vehicles',
    select: 'name image imageAlt pricePerDay seats fuelType'
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites,
    },
  });
});

export const addFavoriteVehicle = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.body;
  if (!vehicleId) {
    return next(new AppError('Vehicle ID is required.', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { 'favorites.vehicles': vehicleId } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites,
    },
  });
});

export const removeFavoriteVehicle = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { 'favorites.vehicles': vehicleId } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites,
    },
  });
});

export const addFavoriteSearch = catchAsync(async (req, res, next) => {
  const { name, location, dates, category, priceRange, filters } = req.body;

  if (!name || !location) {
    return next(new AppError('Search name and location are required.', 400));
  }

  const newSearch = { name, location, dates, category, priceRange, filters };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { 'favorites.searches': newSearch } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites,
    },
  });
});

export const removeFavoriteSearch = catchAsync(async (req, res, next) => {
  const { searchId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { 'favorites.searches': { _id: searchId } } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites,
    },
  });
});

// PAYMENT METHODS
export const addPaymentMethod = catchAsync(async (req, res, next) => {
  const { type, last4, expiryDate } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: {
        paymentMethods: {
          type,
          last4,
          expiryDate,
          isDefault: false
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      paymentMethods: user.paymentMethods
    }
  });
});

export const deletePaymentMethod = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { paymentMethods: { _id: req.params.id } } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      paymentMethods: user.paymentMethods
    }
  });
});

// NOTIFICATIONS
export const updateNotificationPreferences = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { notifications: req.body },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      notifications: user.notifications
    }
  });
});

// DOCUMENTS
// DOCUMENTS
export const uploadDocument = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file.', 400));
  }

  const currentUser = await User.findById(req.user.id);
  if (currentUser.documents && currentUser.documents.length >= 1) {
    return next(new AppError('You can only upload one document. Please update or delete the existing one.', 400));
  }

  const { type } = req.body;
  // Construct the URL for the uploaded file
  const url = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: {
        documents: {
          type,
          url,
          status: 'Pending'
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      documents: user.documents
    }
  });
});

export const deleteDocument = catchAsync(async (req, res, next) => {
  const { docId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { documents: { _id: docId } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      documents: user.documents
    }
  });
});

export const updateDocument = catchAsync(async (req, res, next) => {
  const { docId } = req.params;
  const { type } = req.body;

  const updateFields = {};
  if (type) updateFields['documents.$.type'] = type;

  if (req.file) {
    updateFields['documents.$.url'] = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;
    updateFields['documents.$.status'] = 'Pending';
    updateFields['documents.$.uploadedAt'] = Date.now();
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'documents._id': docId },
    { $set: updateFields },
    { new: true }
  );

  if (!user) {
    return next(new AppError('Document not found or user not authorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      documents: user.documents
    }
  });
});

// DASHBOARD OVERVIEW
export const getDashboardOverview = catchAsync(async (req, res, next) => {
  console.log('getDashboardOverview: Start');

  if (!req.user || !req.user.id) {
    console.error('getDashboardOverview: No user in request');
    return next(new AppError('User not authenticated properly', 401));
  }

  // 1. Get User with populated favorites
  const user = await User.findById(req.user.id).populate({
    path: 'favorites.vehicles',
    select: 'name image pricePerDay seats fuelType ratingAverage'
  });

  if (!user) {
    console.error('getDashboardOverview: User not found in DB');
    return next(new AppError('User not found', 404));
  }
  console.log('getDashboardOverview: User fetched');

  // 2. Get Recent Bookings (Limit 5)
  const bookings = await Booking.find({ user: req.user._id })
    .sort({ startDate: -1 })
    .limit(5)
    .populate({
      path: 'vehicle',
      select: 'name image imageAlt pricePerDay'
    });
  console.log('getDashboardOverview: Bookings fetched', bookings?.length);

  // 3. Get Recommendations (High rated or Special Offers)
  let recommendations = [];
  try {
    recommendations = await Vehicle.aggregate([
      { $match: { ratingAverage: { $gte: 4.5 } } },
      { $sample: { size: 3 } },
      { $project: { name: 1, image: 1, imageAlt: 1, pricePerDay: 1, ratingAverage: 1, specialOffer: 1 } }
    ]);
  } catch (err) {
    console.error('getDashboardOverview: Aggregation failed', err);
    // Fallback to simple find if aggregation fails
    recommendations = await Vehicle.find({ ratingAverage: { $gte: 4.5 } }).limit(3).select('name image imageAlt pricePerDay ratingAverage specialOffer');
  }
  console.log('getDashboardOverview: Recommendations fetched', recommendations?.length);

  // Transform recommendations to match frontend expectation
  const formattedRecommendations = (recommendations || []).map((veh, index) => ({
    id: index + 1,
    matchScore: 90 + Math.floor(Math.random() * 10), // Mock score
    reason: veh.specialOffer ? "Special Offer just for you!" : "Based on your preferences",
    vehicle: {
      _id: veh._id,
      name: veh.name,
      image: veh.image,
      imageAlt: veh.imageAlt,
      pricePerDay: veh.pricePerDay,
      rating: veh.ratingAverage
    }
  }));

  // 4. Loyalty Rewards (Dynamic from DB)
  const rewards = await LoyaltyReward.find({ isActive: true }).sort({ pointsCost: 1 });
  const history = await LoyaltyTransaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);

  const availableRewards = rewards.map(reward => ({
    id: reward._id,
    title: reward.title,
    description: reward.description,
    points: reward.pointsCost
  }));

  res.status(200).json({
    status: 'success',
    data: {
      user,
      bookings,
      favorites: user.favorites,
      loyalty: {
        points: user.loyaltyPoints || 0,
        tier: user.loyaltyTier || 'Silver',
        availableRewards,
        history
      },
      recommendations: formattedRecommendations,
      debug: {
        userId: req.user.id,
        bookingsCount: bookings?.length
      }
    }
  });
});

export const redeemReward = catchAsync(async (req, res, next) => {
  const { rewardId, pointsCost } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.loyaltyPoints < pointsCost) {
    return next(new AppError('Insufficient loyalty points.', 400));
  }

  // Deduct points
  user.loyaltyPoints -= pointsCost;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Reward redeemed successfully!',
    data: {
      points: user.loyaltyPoints
    }
  });
});

export const debugUserBookings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const bookingsCount = await Booking.countDocuments({ user: userId });
  const bookings = await Booking.find({ user: userId }).limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      userId,
      bookingsCount,
      bookingsSample: bookings
    }
  });
});