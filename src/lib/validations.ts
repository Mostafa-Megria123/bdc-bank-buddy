import * as z from 'zod';

export const loginSchema = z.object({
  nationalId: z
    .string()
    .min(14, 'National ID must be exactly 14 digits')
    .max(14, 'National ID must be exactly 14 digits')
    .regex(/^\d{14}$/, 'National ID must contain only numbers'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  captcha: z
    .string()
    .min(6, 'Please enter the captcha')
    .max(6, 'Invalid captcha'),
});

export const registerSchema = z.object({
  nationalId: z
    .string()
    .min(14, 'National ID must be exactly 14 digits')
    .max(14, 'National ID must be exactly 14 digits')
    .regex(/^\d{14}$/, 'National ID must contain only numbers'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  nationalIdImage: z
    .any()
    .refine((file) => file != null, 'National ID image is required')
    .refine((file) => file?.size <= 5000000, 'Max file size is 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'application/pdf'].includes(file?.type),
      'Only .jpg, .jpeg, and .pdf files are accepted'
    ),
  printedNumber: z
    .string()
    .min(1, 'Printed number is required'),
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number is too long')
    .regex(/^\d+$/, 'Mobile number must contain only numbers'),
  confirmMobile: z
    .string(),
  email: z
    .string()
    .email('Please enter a valid email address'),
  confirmEmail: z
    .string(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z
    .string(),
  notificationLanguage: z
    .enum(['ar', 'en']),
  nationality: z
    .string()
    .min(1, 'Please select your nationality'),
  residence: z
    .string()
    .min(1, 'Please select your place of residence'),
  governorate: z
    .string()
    .optional(),
  address: z
    .string()
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 8 && val.length <= 20), 
      'Phone number must be between 8 and 20 digits'),
  maritalStatus: z
    .string()
    .optional(),
  captcha: z
    .string()
    .min(6, 'Please enter the captcha')
    .max(6, 'Invalid captcha'),
}).refine((data) => data.mobile === data.confirmMobile, {
  message: "Mobile numbers don't match",
  path: ["confirmMobile"],
}).refine((data) => data.email === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;