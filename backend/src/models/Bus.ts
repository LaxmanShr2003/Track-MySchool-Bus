import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Driver } from "./Driver";
import { BusRoute } from "./BusRoute";

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

  @OneToOne(() => Driver, (driver) => driver.bus, {
    cascade: true,
    onDelete: "CASCADE",
  })
  driver: Driver;

  @OneToOne(() => BusRoute, (busRoute) => busRoute.bus)
  @JoinColumn()
  busRoute: BusRoute;
}
