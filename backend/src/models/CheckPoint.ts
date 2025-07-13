import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BusRoute } from "./BusRoute";

@Entity()
export class Checkpoint {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("double precision")
  lat: number;

  @Column("double precision")
  lng: number;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column()
  order: number; // order of the checkpoint on the route

  @ManyToOne(() => BusRoute, (r) => r.checkpoints, { onDelete: "CASCADE" })
  @JoinColumn({ name: "busRouteId" })
  busRoute: BusRoute;
}
