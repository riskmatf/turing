import { Column, Entity, Index, OneToMany } from "typeorm";
import { Report } from "./Report";

@Index("displayName", ["displayName"], { unique: true })
@Entity("admins", { schema: "turing" })
export class Admin {
  @Column({type:"varchar", primary: true, name: "username", length: 20, charset:"utf8mb4",
  			collation: "utf8mb4_unicode_ci"  })
  username: string;

  @Column({type: "varchar", name: "displayName", unique: true, length: 20, charset:"utf8mb4",
  			collation: "utf8mb4_unicode_ci" })
  displayName: string;

  @Column("char", { name: "password", length: 32 })
  password: string;

  @OneToMany(
    () => Report,
    report => report.adminUsername
  )
  reports: Report[];
}
