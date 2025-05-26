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
    nullable: false,
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
  })
  mobileNumber: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  password: string;

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
