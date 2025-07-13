import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const createDriverSchema = z.object({
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

  email: z
    .string({ required_error: "Email is required" })
    .refine((email) => emailRegex.test(email), {
      message: "Invalid email format",
    }),
  licenseNumber: z.string({ required_error: "License number is required" }),
  gender: z.enum(["MALE", "FEMALE"]),
  role: z.enum(["ADMIN", "STUDENT", "DRIVER"]).optional(),
});

export const driverIdSchema = z
  .object({
    id: z.string({ required_error: "User id is required" }),
  })
  .strict();
export const driverEmailSchema = z
  .object({
    email: z.string({ required_error: "User email is required" }),
  })
  .strict();
export const driverMobileNumberSchema = z
  .object({
    mobileNumber: z.string({ required_error: "Mobile number is required" }),
  })
  .strict();

export const driverUserNameSchema = z
  .object({
    userName: z.string({ required_error: "User name is required" }),
  })
  .strict();



export type CreateDriverSchemaType = z.infer<typeof createDriverSchema>;
export type DriverIdSchemaType = z.infer<typeof driverIdSchema>;
export type DriverEmailSchemaType = z.infer<typeof driverEmailSchema>;
export type DriverMobileNumberSchemaType = z.infer<
  typeof driverMobileNumberSchema
>;
export type DriverUserNameSchemaType = z.infer<typeof driverUserNameSchema>;

