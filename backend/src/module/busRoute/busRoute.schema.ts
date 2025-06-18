import { z } from "zod";

/** ───── Helpers ───── */
const latSchema = z
  .number({ required_error: "Latitude is required" })
  .min(-90, { message: "Latitude must be ≥ ‑90" })
  .max(90, { message: "Latitude must be ≤ 90" });

const lngSchema = z
  .number({ required_error: "Longitude is required" })
  .min(-180, { message: "Longitude must be ≥ ‑180" })
  .max(180, { message: "Longitude must be ≤ 180" });

const statusEnum = z.enum(["ACTIVE", "INACTIVE"]);
const routeAssignmentStatusEnum = z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]);

/** ───── Create ───── */
export const createBusRouteSchema = z.object({
  routeName: z
    .string({ required_error: "Route name is required" })
    .min(3, { message: "Route name should be at least 3 characters" })
    .max(100, { message: "Route name can’t exceed 100 characters" }),

  /** Coordinates */
  startLat: latSchema,
  startLng: lngSchema,
  endLat: latSchema,
  endLng: lngSchema,

  /** Optional labels */
  startingPointName: z
    .string()
    .max(150, { message: "Label can’t exceed 150 characters" })
    .optional(),
  destinationPointName: z
    .string()
    .max(150, { message: "Label can’t exceed 150 characters" })
    .optional(),

  /** Status (optional; defaults to INACTIVE) */
  status: statusEnum.default("INACTIVE").optional(),

  /** ───── New Fields for Route Assignment ───── */

  busId: z.string({ required_error: "Bus ID is required" }),

  driverId: z.string({ required_error: "Driver ID is required" }),

  studentIds: z
    .array(z.string().min(1, { message: "Student ID cannot be empty" }))
    .nonempty({ message: "At least one student ID must be provided" }),

  assignedDate: z
    .string({ required_error: "Assigned date is required" })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Assigned date must be a valid date string",
    }),

  endDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "End date must be a valid date string or empty",
    })
    .optional(),

  assignmentStatus: routeAssignmentStatusEnum.default("ACTIVE").optional(),
});

/** ───── Update ─────
 *  All fields optional except the id,
 *  so you can PATCH only what you need.
 */
export const updateBusRouteSchema = z
  .object({
    id: z.string({ required_error: "Route ID is required" }),
  })
  .merge(createBusRouteSchema.partial());

/** ───── ID Only ───── */
export const busRouteIdSchema = z
  .object({
    id: z.number({ required_error: "Route ID is required" }),
  })
  .strict();

  export const busRouteNameSchema = z
  .object({
    routeName: z.string({ required_error: "Route name is required" }),
  })
  .strict();

/** ───── Types ───── */
export type CreateBusRouteSchemaType = z.infer<typeof createBusRouteSchema>;
export type UpdateBusRouteSchemaType = z.infer<typeof updateBusRouteSchema>;
export type BusRouteIdSchemaType = z.infer<typeof busRouteIdSchema>;
export type BusRouteNameSchemaType = z.infer<typeof busRouteNameSchema>;
