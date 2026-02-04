import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import AppError from './utils/appError.js';
import globalErrorHandler from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import reviewRoutes from './routes/review.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';
// import locationRoutes from './routes/location.routes.js'; // FIXED: Removed this line
import aiRoutes from './routes/ai.routes.js';
import postRoutes from './routes/post.routes.js';
import contactRoutes from './routes/contactRoutes.js';
import categoryRoutes from './routes/category.routes.js';
import loyaltyRoutes from './routes/loyalty.routes.js'; // <-- IMPORT

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX || 100,
  windowMs: process.env.RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({
  whitelist: [
    'pricePerDay',
    'rating',
    'seats',
    'category'
  ]
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use("/api/v1/admin", adminRoutes);
// app.use('/api/v1/locations', locationRoutes); // FIXED: Removed this line
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/loyalty', loyaltyRoutes); // <-- Loyalty Routes

app.get('/', (req, res) => {
  res.status(200).send('UrbanDrive API is running...');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;