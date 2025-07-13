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
import { Checkpoint } from "./CheckPoint";

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
  endLng: number;

  /** ───── Optional human-readable labels ───── */
  @Column({ type: "varchar", length: 150, nullable: true })
  startingPointName: string;

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
  updatedAt: Date;

  /** ───── Relationship ───── */
  @OneToMany(() => RouteAssignment, (assignment) => assignment.busRoute, {
    cascade: true,
  })
  routeAssignment: RouteAssignment[];

  @OneToMany(() => Checkpoint, cp => cp.busRoute, { cascade: true })
  checkpoints: Checkpoint[];
}
