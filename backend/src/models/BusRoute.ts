import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Bus } from "./Bus";
import { Student } from "./Student";

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

  @OneToOne(() => Bus, (bus) => bus.busRoute, {
    cascade:true,
    onDelete:"CASCADE"
  })
  bus: Bus;

  @OneToMany(() => Student, (student) => student.busRoute)
  students: Student[];
}
