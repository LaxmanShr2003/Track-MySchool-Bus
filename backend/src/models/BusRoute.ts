import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { RouteAssignment } from "./RouteAssignment";

@Entity()
export class BusRoute {
  @PrimaryColumn({
    type: "varchar",
    nullable: false,
  })
  id: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  routeName: string;

  @OneToMany(() => RouteAssignment, (assignment) => assignment.busRoute)
  routeAssignment: RouteAssignment[];
}
