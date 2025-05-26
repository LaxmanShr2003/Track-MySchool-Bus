import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUserEntity } from "../global/BaseEntity";
import { Bus } from "./Bus";

@Entity()
export class Driver extends BaseUserEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  licenseNumber: string;

  @OneToOne(()=>Bus, bus => bus.driver)
  @JoinColumn()
  bus = Bus

  
}
