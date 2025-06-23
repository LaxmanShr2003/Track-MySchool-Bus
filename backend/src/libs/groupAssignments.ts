import { RouteAssignment } from "../models/RouteAssignment";

// Group routeAssignment by busId + driverId + assignedDate
export const groupAssignments = (assignments: RouteAssignment[]) => {
  const map = new Map();

  for (const a of assignments) {
    const key = `${a.busId}-${a.driverId}-${a.assignedDate}`;
    if (!map.has(key)) {
      map.set(key, {
        busId: a.busId,
        driverId: a.driverId,
        assignedDate: a.assignedDate,
        endDate: a.endDate,
        assignmentStatus: a.assignmentStatus,
        students: [],
      });
    }
    map.get(key).students.push(a.studentId);
  }

  return Array.from(map.values());
};
