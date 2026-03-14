import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must be lowercase and contain only letters, numbers, or hyphens'
    ),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
