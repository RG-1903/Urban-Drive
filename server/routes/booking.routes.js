import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  getAllBookings,
  updateBookingStatus,
  checkAvailability,
} from '../controllers/booking.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(checkJwt);

router.get('/check-availability', checkAvailability);

router.route('/')
  .post(createBooking)
  .get(checkRole('admin'), getAllBookings);

router.get('/my-bookings', getMyBookings);

router.route('/:id')
  .get(getBooking)
  .patch(checkRole('admin'), updateBookingStatus);

export default router;