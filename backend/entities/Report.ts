import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Classroom } from "./Classroom";
import { Admin } from "./Admin";
import { Computer } from "./Computer";
import {BooleanTransformer} from '@anchan828/typeorm-transformers'

@Index("classroomName", ["classroomName"], {})
@Index("adminUsername", ["adminUsername"], {})
@Entity("reports", { schema: "turing" })
export class Report {
  @PrimaryGeneratedColumn({ type: "int", name: "reportId" })
  reportId: number;

  @Column("tinyint", {
			name: "isGeneral",
			width: 1,
			transformer: new BooleanTransformer(),
		})
  isGeneral: boolean;

  @ManyToOne(
	  ()=>Computer,
	  computer => computer.reports,
	  {onDelete: "RESTRICT", onUpdate: "RESTRICT"}
  )
  @JoinColumn([{name: "computerId", referencedColumnName: "id"}])
  computerId: number | null;

  @Column({	type:"varchar",  name: "description", nullable: true, length: 1000, charset:"utf8mb4",
  			collation: "utf8mb4_unicode_ci" })
  description: string;

  @Column("tinyint", {
		name: "fixed",
		width: 1,
		default: () => "'0'",
		transformer: new BooleanTransformer(),
	})
  fixed: boolean;

  @Column({	type: "varchar", name: "adminComment", nullable: true, length: 1000, charset:"utf8mb4",
  			collation: "utf8mb4_unicode_ci"  })
  adminComment: string | null;

  @Column("int", { name: "timestamp" })
  timestamp: number;

  @Column("tinyint", {
			  name: "urgent",
			  width: 1,
			  default: () => "'0'",
			  transformer: new BooleanTransformer(),
			})
  urgent: boolean;

  @ManyToOne(
    () => Classroom,
    classroom => classroom.reports,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "classroomName", referencedColumnName: "name" }])
  classroomName: Classroom;

  @ManyToOne(
    () => Admin,
    admin => admin.reports,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "adminUsername", referencedColumnName: "username" }])
  adminUsername: Admin | null;
}
