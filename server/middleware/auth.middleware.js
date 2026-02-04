import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const checkJwt = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let currentUser;
  
  if (decoded.role === 'admin') {
    currentUser = await Admin.findById(decoded.id);
  } else {
    currentUser = await User.findById(decoded.id);
  }

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (decoded.role === 'user' && currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  
  req.user = currentUser;
  req.user.role = decoded.role;
  next();
});

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
    
    const userRole = req.user.role.toLowerCase();
    const rolesLower = roles.map(r => r.toLowerCase());
    
    if (!rolesLower.includes(userRole)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};