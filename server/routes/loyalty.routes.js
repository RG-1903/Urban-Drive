import express from 'express';
import { getAllRewards, createReward, updateReward, deleteReward, getLoyaltyStatus, redeemReward } from '../controllers/loyalty.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(checkJwt);

router.route('/')
    .get(getAllRewards)
    .post(checkRole('admin'), createReward);

router.get('/status', getLoyaltyStatus);
router.post('/redeem', redeemReward);

router.route('/:id')
    .patch(checkRole('admin'), updateReward)
    .delete(checkRole('admin'), deleteReward);

export default router;
