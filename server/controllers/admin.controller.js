import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import Review from "../models/review.model.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const getDateRange = (range) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (range) {
    case "24h":
      startDate.setDate(startDate.getDate() - 1);
      break;
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(startDate.getDate() - 90);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  return { $gte: startDate, $lte: endDate };
};

export const adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password", 400));
  }

  // Convert username to lowercase to match schema
  const normalizedUsername = username.toLowerCase().trim();
  const admin = await Admin.findOne({ username: normalizedUsername }).select("+password");

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  const token = signToken(admin._id);
  res.status(200).json({
    status: "success",
    token,
    data: { admin },
  });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const dateRange = getDateRange(req.query.range);
  const dateFilter = { createdAt: dateRange };

  const revenueStats = await Booking.aggregate([
    { $match: { status: { $in: ["completed", "active"] }, createdAt: dateRange } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const ratingStats = await Review.aggregate([
    { $match: dateFilter },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  const activeBookings = await Booking.countDocuments({ status: "active" });
  const totalVehicles = await Vehicle.countDocuments();
  const rentedVehicles = await Booking.countDocuments({ status: "active" });

  const utilizationRate =
    totalVehicles > 0 ? (rentedVehicles / totalVehicles) * 100 : 0;

  res.status(200).json({
    status: "success",
    data: {
      totalRevenue: revenueStats.length > 0 ? revenueStats[0].total : 0,
      activeBookings,
      utilizationRate: utilizationRate.toFixed(0),
      customerSatisfaction:
        ratingStats.length > 0 ? ratingStats[0].avgRating.toFixed(1) : "0",
    },
  });
});

export const getRevenueChartData = catchAsync(async (req, res, next) => {
  const dateRange = getDateRange(req.query.range);

  const bookings = await Booking.find({
    createdAt: dateRange,
    status: { $in: ["completed", "active"] },
  }).sort("createdAt");

  let format;
  let unit;

  if (req.query.range === "24h") {
    format = "%Y-%m-%dT%H:00:00";
    unit = "hour";
  } else if (req.query.range === "7d" || req.query.range === "30d") {
    format = "%Y-%m-%d";
    unit = "day";
  } else {
    format = "%Y-%m";
    unit = "month";
  }

  const chartData = await Booking.aggregate([
    {
      $match: {
        createdAt: dateRange,
        status: { $in: ["completed", "active"] },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: format, date: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        revenue: "$revenue",
        bookings: "$bookings",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: chartData,
  });
});

export const getFleetOverview = catchAsync(async (req, res, next) => {
  const fleet = await Vehicle.find()
    .sort({ status: 1, nextMaintenance: 1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    data: {
      fleet,
    },
  });
});

export const getRecentBookings = catchAsync(async (req, res, next) => {
  const dateRange = getDateRange(req.query.range);

  const bookings = await Booking.find({ createdAt: dateRange })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "firstName lastName email avatar")
    .populate("vehicle", "name");

  res.status(200).json({
    status: "success",
    data: {
      bookings,
    },
  });
});

export const getAdminAlerts = catchAsync(async (req, res, next) => {
  const maintenanceAlerts = await Vehicle.find({
    nextMaintenance: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    status: "available",
  }).limit(3);

  const alerts = maintenanceAlerts.map((vehicle) => ({
    id: `maint-${vehicle._id}`,
    title: "Maintenance Due",
    message: `Vehicle '${vehicle.name}' (VIN: ${vehicle.vin.slice(
      -6
    )}) is due for service.`,
    priority: "medium",
    type: "maintenance",
    timestamp: vehicle.nextMaintenance.toISOString(),
    action: "Schedule",
  }));

  res.status(200).json({
    status: "success",
    data: {
      alerts,
    },
  });
});