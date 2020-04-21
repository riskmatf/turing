import {Entity, PrimaryColumn, OneToMany, ManyToOne, JoinColumn, Column} from 'typeorm';
import { Classroom } from './Classroom';
import { Report } from './Report';
import { BooleanTransformer } from '@anchan828/typeorm-transformers';

@Entity("computers", { schema: "turing" })
export class Computer{

	@PrimaryColumn()
	id: number;

	@PrimaryColumn("varchar")
	@ManyToOne(
		()=>Classroom,
		classroom=> classroom.computers,
		{onDelete: "RESTRICT", onUpdate: "RESTRICT"}
	)
	@JoinColumn({name: "classroomName", referencedColumnName: "name"})
	classroomName: Classroom;

	@Column("tinyint", {
		name: "broken",
		width: 1,
		default: () => "'0'",
		transformer: new BooleanTransformer(),
	})
	broken: boolean;

	// @OneToMany(
	// 	()=>Report,
	// 	report => report.computerId
	// )
	// reports:Report[];
}