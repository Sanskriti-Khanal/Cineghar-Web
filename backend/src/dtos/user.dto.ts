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
}).partial();

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;

