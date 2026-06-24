import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(2, 'Name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(10, 'Valid phone number is required'),
      address: z.string().min(5, 'Address is required'),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
    }),
    items: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        image: z.string().optional(),
      })
    ).min(1, 'Cart cannot be empty'),
    subtotal: z.number().min(0),
    total: z.number().min(0),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'paid', 'fulfilled', 'cancelled']),
  }),
});
