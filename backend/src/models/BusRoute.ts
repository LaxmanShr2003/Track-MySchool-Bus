import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RouteAssignment } from "./RouteAssignment";
import { Bus } from "./Bus";

@Entity()
export class BusRoute {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  routeName: string;

  /** ───── Start & Destination Coordinates ───── */

  @Column({ type: "double precision", nullable: false })
  startLat: number;

  @Column({ type: "double precision", nullable: false })
  startLng: number;

  @Column({ type: "double precision", nullable: false })
  endLat: number;

  @Column({ type: "double precision", nullable: false })
  endLng: number;

  /** ───── Optional human-readable labels ───── */
  @Column({ type: "varchar", length: 150, nullable: true })
  startingPointName: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  destinationPointName: string;

  /** ───── Status ───── */
  @Column({
    type: "enum",
    enum: ["ACTIVE", "INACTIVE"],
    default: "INACTIVE",
  })
  status: "ACTIVE" | "INACTIVE";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  /** ───── Relationship ───── */
  @OneToMany(() => RouteAssignment, (assignment) => assignment.busRoute)
  routeAssignment: RouteAssignment[];

  
}
