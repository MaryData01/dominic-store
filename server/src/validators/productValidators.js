import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    slug: z.string().min(2, 'Slug is required'),
    category: z.enum([
      'keyboards',
      'mice',
      'headsets',
      'monitors',
      'controllers',
      'chairs',
      'capture-cards',
      'lighting',
    ]),
    price: z.number().min(0, 'Price must be positive'),
    comparePrice: z.number().optional(),
    description: z.string().optional(),
    specs: z.record(z.string()).optional(),
    images: z.array(z.string()).optional(),
    stockStatus: z.enum(['in-stock', 'out-of-stock']).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    category: z.enum([
      'keyboards',
      'mice',
      'headsets',
      'monitors',
      'controllers',
      'chairs',
      'capture-cards',
      'lighting',
    ]).optional(),
    price: z.number().min(0).optional(),
    comparePrice: z.number().optional(),
    description: z.string().optional(),
    specs: z.record(z.string()).optional(),
    images: z.array(z.string()).optional(),
    stockStatus: z.enum(['in-stock', 'out-of-stock']).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
