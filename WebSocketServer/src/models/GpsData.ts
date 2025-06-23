// src/models/TrackedGpsData.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class GpsData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeId: string;

  @Column("double")
  latitude: number;

  @Column("double")
  longitude: number;

  @Column("double", { nullable: true })
  speed?: number;

  @Column("double", { nullable: true })
  accuracy?: number;

  @Column("double", { nullable: true })
  heading?: number;

  @Column()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
