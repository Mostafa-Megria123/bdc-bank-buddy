import * as z from "zod";

export const loginSchema = z.object({
  nationalId: z
    .string()
    .min(14, "National ID must be exactly 14 digits")
    .max(14, "National ID must be exactly 14 digits")
    .regex(
      /^[23]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[12]\d|3[45])\d{5}$/,
      "Invalid National ID format",
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  captcha: z
    .string()
    .min(6, "Please enter the captcha")
    .max(6, "Invalid captcha"),
});

export const registerSchema = z
  .object({
    nationalId: z
      .string()
      .min(14, "National ID must be exactly 14 digits")
      .max(14, "National ID must be exactly 14 digits")
      .regex(
        /^[23]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[12]\d|3[45])\d{5}$/,
        "Invalid National ID format",
      ),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    nationalIdImage: z
      .any()
      .refine((file) => file != null, "National ID image is required")
      .refine((file) => file?.size <= 5000000, "Max file size is 5MB")
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "application/pdf"].includes(file?.type),
        "Only .jpg, .jpeg, and .pdf files are accepted",
      ),
    printedNumber: z
      .string()
      .min(9, "Printed number must be exactly 9 characters")
      .max(9, "Printed number must be exactly 9 characters")
      .regex(
        /^[a-zA-Z0-9]{9}$/,
        "Printed number must be 9 alphanumeric characters",
      ),
    mobile: z
      .string()
      .regex(
        /^(010|011|012|015)\d{8}$/,
        "Mobile number must be 11 digits starting with 010, 011, 012, or 015",
      ),
    confirmMobile: z
      .string()
      .regex(
        /^(010|011|012|015)\d{8}$/,
        "Mobile number must be 11 digits starting with 010, 011, 012, or 015",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    confirmEmail: z
      .string()
      .min(1, "Email confirmation is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,100}$/,
        "Password must contain: 8+ characters, uppercase, lowercase, number, and special character (@#$%^&+=!)",
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    notificationLanguage: z.enum(["ar", "en"]),
    nationality: z.string().min(1, "Please select your nationality"),
    residence: z.string().min(1, "Please select your place of residence"),
    governorate: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    phone: z.string().optional(),
    maritalStatus: z.string().min(1, "Please select your marital status"),
    captcha: z
      .string()
      .min(6, "Please enter the captcha")
      .max(6, "Invalid captcha"),
  })
  .refine((data) => data.mobile === data.confirmMobile, {
    message: "Mobile numbers don't match",
    path: ["confirmMobile"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email addresses don't match",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
