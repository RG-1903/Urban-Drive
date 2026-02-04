import express from 'express';
import * as contactController from '../controllers/contactController.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', contactController.createContact);

// Protected routes - admin only
router.use(checkJwt);
router.use(checkRole('admin'));

router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.patch('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
