import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidators.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(authenticateAdmin, validate(createProductSchema), createProduct);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .put(authenticateAdmin, validate(updateProductSchema), updateProduct)
  .delete(authenticateAdmin, deleteProduct);

export default router;
