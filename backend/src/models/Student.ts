import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseUserEntity } from "../global/BaseEntity";
import { BusRoute } from "./BusRoute";

@Entity()
export class Student extends BaseUserEntity {
  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  Address: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  guardianName: string;

  @Column({
    type: "boolean",
    nullable: false,
  })
  isActive: string;

  @ManyToOne(() => BusRoute, (busRoute) => busRoute.students)
  @JoinColumn()
  busRoute: BusRoute;
}
