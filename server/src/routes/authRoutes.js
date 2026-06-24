import express from 'express';
import { authAdmin, getAdminProfile } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/admin/login', validate(loginSchema), authAdmin);
router.get('/admin/me', authenticateAdmin, getAdminProfile);

export default router;
