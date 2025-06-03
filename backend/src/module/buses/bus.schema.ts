import { z } from "zod";

export const createBusSchema = z.object({
  busName: z
    .string({ required_error: "Bus name is required" })
    .min(3, { message: "Must be more than 3 characters" }),
  plateNumber: z.string({ required_error: "Bus's Plate number is required" }),
  
});

export const BusIdSchema = z.object({
  id: z.string({ required_error: "Bus id is required" }),
});
export const BusNumberPlateSchema = z.object({
  plateNumber: z.string({ required_error: "Bus number plate is required" }),
});
export const BusNameSchema = z.object({
  busName: z.string({ required_error: "Bus name is required" }),
});

export type createBusSchemaType = z.infer<typeof createBusSchema>;

export type BusIdSchemaType = z.infer<typeof BusIdSchema>;
export type BusNameSchemaType = z.infer<typeof BusNameSchema>;
export type BusNumberPlateSchemaType = z.infer<typeof BusNumberPlateSchema>;
