import z from "zod";

export const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  dateOfBirth: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  imageUrl: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

