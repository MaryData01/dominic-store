import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { authenticateUser } from '../middleware/userAuth.js';
import { z } from 'zod';

const router = express.Router();

const generateUserToken = (id) => {
  return jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerValidator = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const loginValidator = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validate(registerValidator), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: emailLower,
      password,
      cart: [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: generateUserToken(user._id),
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validate(loginValidator), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token: generateUserToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      cart: user.cart
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Save/Sync full user cart
// @route   PUT /api/auth/cart
// @access  Private
router.put('/cart', authenticateUser, async (req, res, next) => {
  try {
    const cart = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: 'Cart must be an array' });
    }

    req.user.cart = cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
      quantity: item.quantity
    }));

    await req.user.save();
    res.json(req.user.cart);
  } catch (error) {
    next(error);
  }
});

// @desc    Get stored user cart
// @route   GET /api/auth/cart
// @access  Private
router.get('/cart', authenticateUser, async (req, res, next) => {
  try {
    res.json(req.user.cart);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticateUser, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
