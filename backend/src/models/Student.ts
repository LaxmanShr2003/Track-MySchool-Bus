import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseUserEntity } from "../global/BaseEntity";
import { BusRoute } from "./BusRoute";
import { RouteAssignment } from "./RouteAssignment";

@Entity("students")
export class Student extends BaseUserEntity {
  @Column({
    type: "varchar",
    nullable: false,
  })
  guardianName: string;

  @Column({
    type:"boolean",
    nullable:false
  })
  isAssigned:boolean

  @OneToMany(
    () => RouteAssignment,
    (routeAssignment) => routeAssignment.students
  )
  @JoinColumn()
  routeAssignment: RouteAssignment[];
}
