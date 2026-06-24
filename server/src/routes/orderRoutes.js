import express from 'express';
import { createOrder, verifyOrder } from '../controllers/orderController.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/orderValidators.js';

const router = express.Router();

router.route('/')
  .post(validate(createOrderSchema), createOrder);

router.route('/verify/:reference')
  .get(verifyOrder);

export default router;
