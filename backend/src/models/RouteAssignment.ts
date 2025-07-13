import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from "typeorm";
import { Driver } from "./Driver";
import { Bus } from "./Bus";
import { BusRoute } from "./BusRoute";
import { Student } from "./Student";

@Entity()
//@Unique(["studentId", "driverId", "busId", "busRouteId", "assignedDate"])
export class RouteAssignment {
  @PrimaryColumn()
  busId: string;

  @PrimaryColumn()
  driverId: string;

  @PrimaryColumn()
  studentId: string;

  @Column()
  busRouteId: number;

  @PrimaryColumn({ type: "date" })
  assignedDate: Date;

  @Column({ type: "date", nullable: true })
  endDate?: string;

  @Column({ default: "ACTIVE" })
  assignmentStatus: "ACTIVE" | "COMPLETED" | "CANCELLED";

  @ManyToOne(() => Bus)
  @JoinColumn({ name: "busId" })
  bus: Bus;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: "driverId" })
  driver: Driver;

  @ManyToOne(() => BusRoute, { onDelete: "CASCADE" })
  @JoinColumn({ name: "busRouteId" })
  busRoute: BusRoute;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "studentId" })
  students: Student;
}
