import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  category: z.string().min(1, 'Category is required'),
  mediaUrl: z.string().optional().or(z.literal('')),
  isPublished: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;
