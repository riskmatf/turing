import {Entity, PrimaryColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import { Classroom } from './Classroom';

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

}