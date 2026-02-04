import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPostBySlug,
  getAllPublishedPosts,
  getAllPostsAdmin,
} from '../controllers/post.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', getAllPublishedPosts);
router.get('/:slug', getPostBySlug);

// --- Admin Routes ---
router.use(checkJwt, checkRole('admin'));

router.post('/', createPost);
router.get('/admin/all', getAllPostsAdmin); // Separate route for admin to get all posts

router
  .route('/:id')
  .patch(updatePost)
  .delete(deletePost);

export default router;