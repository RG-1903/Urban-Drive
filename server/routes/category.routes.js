import express from 'express';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router
    .route('/')
    .get(getAllCategories)
    .post(checkJwt, checkRole('Admin'), createCategory);

router
    .route('/:id')
    .patch(checkJwt, checkRole('Admin'), updateCategory)
    .delete(checkJwt, checkRole('Admin'), deleteCategory);

export default router;
