import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Report } from "./Report";
import { Computer } from "./Computer";

@Entity("classrooms", { schema: "turing" })
export class Classroom {
  @PrimaryColumn({	type: "varchar",  primary: true, name: "name", length: 20})
  name: string;

  @Column({type:"varchar",  name: "location", length: 20, charset:"utf8mb4", collation: "utf8mb4_unicode_ci" })
  location: string;

  @OneToMany(
    () => Report,
    report => report.classroomName
  )
  reports: Report[];


  @OneToMany(
	  ()=>Computer,
	  computer=>computer.classroomName,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  computers: Computer[];
}
