import { z } from "zod";


export const gpsDataSchema = z.object({
  type: z.literal("GPS_UPDATE"),
  routeId: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().nonnegative(),
  accuracy: z.number().optional(),
  heading: z.number().min(0).max(360),
  timestamp: z.string().datetime(),
});