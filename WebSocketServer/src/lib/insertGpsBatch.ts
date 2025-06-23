import { AppDataSource } from "../config/orm.config";
import { GpsData } from "../models/GpsData";

export async function insertGpsBatch(gpsArray: Partial<GpsData>[]) {
  if (!gpsArray.length) return;

  const gpsRepo = AppDataSource.getRepository(GpsData);

  // Validate and map if needed (optional)
  const entities = gpsArray.map((data) =>
    gpsRepo.create({
      routeId: data.routeId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      heading: data.heading,
      accuracy: data.accuracy,
      timestamp: data.timestamp,
      createdAt: new Date(),
    })
  );

  await gpsRepo.save(entities);
}
