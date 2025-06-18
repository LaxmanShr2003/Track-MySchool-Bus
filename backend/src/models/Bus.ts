import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { RouteAssignment } from "./RouteAssignment";

@Entity()
export class Bus {
  @PrimaryColumn({
    type: "varchar",
    nullable: false,
  })
  id: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    default: "Default School Bus",
  })
  busName: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  plateNumber: string;
  
  @Column({
    type:"boolean",
    nullable:false
  })
  isAssigned:boolean

  @OneToMany(() => RouteAssignment, (assignment) => assignment.bus)
  routeAssignment: RouteAssignment[];
}
