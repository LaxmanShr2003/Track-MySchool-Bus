import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcrypt";

@Entity()
export class BaseUserEntity {
  @PrimaryColumn({
    type: "varchar",
    nullable: false,
  })
  id: string;

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
    nullable: false,
    unique: true,
  })
  userName: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  profileImageUrl: string;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
  })
  mobileNumber: string;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: "enum",
    enum: ["MALE", "FEMALE"],
    default: "MALE",
    nullable: false,
  })
  gender: string;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
  })
  password: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  address: string;

  @Column({
    type: "enum",
    enum: ["ADMIN", "STUDENT", "DRIVER"],
    default: "STUDENT",
  })
  role: "DRIVER" | "STUDENT" | "ADMIN";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  hash() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
