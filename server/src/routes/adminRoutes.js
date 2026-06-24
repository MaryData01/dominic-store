import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { upload } from '../middleware/upload.js';
import { getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { validate } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../validators/orderValidators.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// Stats endpoint
router.get('/stats', authenticateAdmin, async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    
    const paidOrders = await Order.find({ status: { $in: ['paid', 'fulfilled'] } });
    const revenue = paidOrders.reduce((acc, order) => acc + order.total, 0);
    
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    res.json({
      totalProducts,
      totalOrders,
      revenue,
      pendingOrders: pendingOrdersCount,
    });
  } catch (error) {
    next(error);
  }
});

// Image upload endpoint
router.post('/upload', authenticateAdmin, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files provided');
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);
    
    const urls = results.map(result => result.secure_url);
    
    res.status(201).json({ urls });
  } catch (error) {
    next(error);
  }
});

// Admin Order Management
router.route('/orders')
  .get(authenticateAdmin, getOrders);

router.route('/orders/:id')
  .get(authenticateAdmin, getOrderById)
  .put(authenticateAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
