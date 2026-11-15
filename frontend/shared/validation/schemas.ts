import { z } from 'zod';

export const userFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid work email address'),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^[+0-9()\-\s]{7,25}$/,
      'Phone number must be 7–25 characters using digits, spaces, +, or hyphens',
    ),
  avatar: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
  status: z.enum(['active', 'inactive', 'suspended']),
  department: z
    .string()
    .trim()
    .min(2, 'Department must be at least 2 characters')
    .max(80, 'Department cannot exceed 80 characters')
    .optional()
    .default('Platform Engineering'),
  jobTitle: z
    .string()
    .trim()
    .min(2, 'Job title must be at least 2 characters')
    .max(80, 'Job title cannot exceed 80 characters')
    .optional()
    .default('Specialist'),
});

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(140, 'Product name cannot exceed 140 characters'),
  sku: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9\-_]{3,32}$/,
      'SKU must be 3–32 characters (letters, numbers, hyphens, or underscores)',
    ),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a valid number' })
    .min(0, 'Price cannot be negative')
    .max(1000000, 'Price cannot exceed $1,000,000'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z
    .string()
    .trim()
    .min(2, 'Please select a valid category'),
  image: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  stockQuantity: z.coerce
    .number({ invalid_type_error: 'Stock quantity must be an integer' })
    .int('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
  status: z
    .enum(['in_stock', 'low_stock', 'out_of_stock', 'archived'])
    .optional(),
});

export const ALLOWED_CLIENT_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_CLIENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateClientImageFile(file: File): string | null {
  if (!ALLOWED_CLIENT_MIME_TYPES.includes(file.type)) {
    return `Unsupported format (${file.type || 'unknown'}). Allowed: JPEG, PNG, WebP, GIF, SVG.`;
  }
  if (file.size > MAX_CLIENT_FILE_SIZE) {
    return `File "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)} MB (max 5.00 MB).`;
  }
  return null;
}
