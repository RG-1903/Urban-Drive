import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.correctPassword(password, user.password))) {
    return createSendToken(user, 200, res);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const admin = await Admin.findOne({ username: normalizedEmail }).select("+password");

  if (admin && (await admin.correctPassword(password, admin.password))) {
    const token = signToken(admin._id, "admin");

    return res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          _id: admin._id,
          email: admin.username,
          firstName: "Admin",
          lastName: "",
          role: "admin",
        },
      },
    });
  }

  return next(new AppError("Incorrect email or password", 401));
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});