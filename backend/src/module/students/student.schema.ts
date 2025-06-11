import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const createStudentSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(3, { message: "First name should be more than 3 character" }),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(3, { message: "Last name should be more than 3 character" }),

  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .max(10, { message: "Mobile number must be 10 character" }),

  address: z.string({ required_error: "Address is required" }),
  guardianName: z.string({ required_error: "Guardian name is required" }),

  email: z
    .string({ required_error: "Email is required" })
    .refine((email) => emailRegex.test(email), {
      message: "Invalid email format",
    }),

  role: z.enum(["ADMIN", "STUDENT", "DRIVER"]).optional(),
});

export const studentIdSchema = z
  .object({
    id: z.string({ required_error: "User id is required" }),
  })
  .strict();
export const studentEmailSchema = z
  .object({
    email: z.string({ required_error: "User email is required" }),
  })
  .strict();
export const studentMobileNumberSchema = z
  .object({
    mobileNumber: z.string({ required_error: "Mobile number is required" }),
  })
  .strict();

export const loginSchema = z.object({
  userName: z.string({ required_error: "User name is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .refine((password) => passwordRegex.test(password), {
      message: "Invalid password format",
    }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type CreateStudentSchemaType = z.infer<typeof createStudentSchema>;
export type StudentIdSchemaType = z.infer<typeof studentIdSchema>;
export type StudentEmailSchemaType = z.infer<typeof studentEmailSchema>;
export type StudentMobileNumberSchemaType = z.infer<
  typeof studentMobileNumberSchema
>;
