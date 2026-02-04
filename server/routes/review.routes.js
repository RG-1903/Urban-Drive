import express from 'express';
import {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setVehicleUserIds,
} from '../controllers/review.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(checkJwt, checkRole('user'), setVehicleUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(checkJwt, checkRole('user', 'admin'), updateReview)
  .delete(checkJwt, checkRole('user', 'admin'), deleteReview);

export default router;