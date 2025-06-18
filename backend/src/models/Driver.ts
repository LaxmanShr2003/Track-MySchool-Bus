import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseUserEntity } from "../global/BaseEntity";
import { Bus } from "./Bus";
import { RouteAssignment } from "./RouteAssignment";

@Entity()
export class Driver extends BaseUserEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  licenseNumber: string;

  @Column({
    type:"boolean",
    nullable:false
  })
  isAssigned:boolean

  @OneToMany(() => RouteAssignment, (assignment) => assignment.driver)
  routeAssignment: RouteAssignment[];
}
