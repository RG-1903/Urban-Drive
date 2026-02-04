import express from 'express';
import {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getMyFavorites,
  addFavoriteVehicle,
  removeFavoriteVehicle,
  addFavoriteSearch,
  removeFavoriteSearch,
  updateUser,
  deleteUser,
  createUser,
  addPaymentMethod,
  deletePaymentMethod,
  updateNotificationPreferences,
  uploadDocument,
  deleteDocument,
  updateDocument,
  getDashboardOverview,
  redeemReward,
  debugUserBookings
} from '../controllers/user.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

import { updatePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.use(checkJwt);

router.get('/dashboard-overview', getDashboardOverview);
router.get('/debug-bookings', debugUserBookings);
router.post('/redeem-reward', redeemReward);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.get('/my-favorites', getMyFavorites);
router.post('/my-favorites/vehicles', addFavoriteVehicle);
router.delete('/my-favorites/vehicles/:vehicleId', removeFavoriteVehicle);
router.post('/my-favorites/searches', addFavoriteSearch);
router.delete('/my-favorites/searches/:searchId', removeFavoriteSearch);

router.post('/payment-methods', addPaymentMethod);
router.delete('/payment-methods/:id', deletePaymentMethod);

import upload from '../utils/fileUpload.js';

router.patch('/notifications', updateNotificationPreferences);

router.post('/documents', upload.single('file'), uploadDocument);
router.delete('/documents/:docId', deleteDocument);
router.patch('/documents/:docId', upload.single('file'), updateDocument);

router.get('/', checkRole('admin'), getAllUsers);
router.post('/create', checkRole('admin'), createUser);

router.route('/:id')
  .get(checkRole('admin'), getUser)
  .patch(checkRole('admin'), updateUser)
  .delete(checkRole('admin'), deleteUser);

export default router;