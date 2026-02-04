import express from 'express';
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleAvailability,
  getVehicleRecommendations,
  getVehicleCategoryCounts,
  getFeaturedCollections, // <-- IMPORT
} from '../controllers/vehicle.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';
import reviewRouter from './review.routes.js';

const router = express.Router();

router.use('/:vehicleId/reviews', reviewRouter);

// --- PUBLIC GET ROUTES ---
router.get('/featured-collections', getFeaturedCollections); // <-- ADD ROUTE
router.get('/stats/category-counts', getVehicleCategoryCounts);
router.get('/recommendations', checkJwt, getVehicleRecommendations);
router.get('/:vehicleId/availability', getVehicleAvailability);

// --- VEHICLE CRUD ---
router
  .route('/')
  .get(getAllVehicles)
  .post(checkJwt, checkRole('Admin'), createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .patch(checkJwt, checkRole('Admin'), updateVehicle)
  .delete(checkJwt, checkRole('Admin'), deleteVehicle);

export default router;