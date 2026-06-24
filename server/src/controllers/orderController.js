import Order from '../models/Order.js';
import { initializeTransaction, verifyTransaction } from '../utils/paystack.js';

// @desc    Create new order & initialize Paystack
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { items, customer, subtotal, total } = req.body;

    if (items && items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    const order = new Order({
      items,
      customer,
      subtotal,
      total,
      status: 'pending'
    });

    const createdOrder = await order.save();

    // Initialize Paystack payment
    const paymentData = {
      email: customer.email,
      amount: Math.round(total * 100), // Amount in kobo
      reference: createdOrder.orderRef,
      callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/order-confirmation',
    };

    const paystackRes = await initializeTransaction(paymentData);

    res.status(201).json({
      orderId: createdOrder._id,
      orderRef: createdOrder.orderRef,
      authorization_url: paystackRes.data.authorization_url,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Paystack transaction
// @route   GET /api/orders/verify/:reference
// @access  Public
export const verifyOrder = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const verificationData = await verifyTransaction(reference);
    
    const order = await Order.findOne({ orderRef: reference });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (verificationData.data.status === 'success') {
      order.status = 'paid';
      order.paystackRef = verificationData.data.reference;
      order.paidAt = Date.now();
      await order.save();
      
      res.json({ message: 'Payment verified successfully', orderRef: reference, status: 'paid' });
    } else {
      order.status = 'failed';
      await order.save();
      
      res.status(400).json({ message: 'Payment verification failed', status: 'failed' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};
