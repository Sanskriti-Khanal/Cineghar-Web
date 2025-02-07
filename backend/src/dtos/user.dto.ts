import z from "zod";
import { UserSchema } from "../types/user.type";

export const createUserDto = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  dateOfBirth: true,
}).extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type createUserDto = z.infer<typeof createUserDto>;

export const UpdateUserDto = UserSchema.pick({
  name: true,
  email: true,
  dateOfBirth: true,
  imageUrl: true,
}).partial();

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;

export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDto>;

export const ResetPasswordDto = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;

// Admin create user (multipart body; image from file)
export const createAdminUserDto = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  dateOfBirth: true,
})
  .extend({
    confirmPassword: z.string().min(6),
    role: z.enum(["user", "admin"]).optional().default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type createAdminUserDto = z.infer<typeof createAdminUserDto>;

