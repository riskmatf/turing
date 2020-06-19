import {AbstractRepository, EntityRepository, getCustomRepository} from 'typeorm';
import {Classroom} from '../../entities/Classroom';
import {imagesPaths} from '../index';
import {ReportsRepository} from "./Reports";
import {ComputersRepository} from "./Computers";

interface IClassroom {
	name: string,
    location: string,
    numberOfComputers:{
        working: number,
        broken: number
    },
    imageUrl: string,
	schemaUrl: string
}
@EntityRepository(Classroom)
export class ClassroomsRepository extends AbstractRepository<Classroom>{
	public async getClassroomByName(classroomName: string){
		return this.repository.findOne(classroomName);
	}

	public async getAllClassrooms(baseUrl : string){
		const classrooms =  await this.repository.find({relations: ["computers"]});
		const mappedClassrooms : IClassroom[] = classrooms.map(classroom=>{
			const numOfBroken = classroom.computers.reduce(
				(acc, comp) => {
					acc += (comp.broken ? 1 : 0);
					return acc
				} , 0);
			const numOfWorking = classroom.computers.length - numOfBroken;
			const schemaUrl = baseUrl + `static/schemas/${classroom.name}.svg`;
			const imageUrl =  baseUrl + "static/images/" + imagesPaths.get(classroom.name);
			return {
				name: classroom.name,
				location: classroom.location,
				numberOfComputers: {
					working: numOfWorking,
					broken: numOfBroken
				},
				imageUrl,
				schemaUrl,
			}
		});
		return mappedClassrooms;
	}
	public async deleteClassroom(classroomName: string){
		const classroom = await this.getClassroomByName(classroomName);
		if(classroom !== undefined){
			const reportsRepository = getCustomRepository(ReportsRepository);
			const computersRepository = getCustomRepository(ComputersRepository);
			await reportsRepository.deleteReportsFromClassroom(classroom);
			await computersRepository.deleteComputersFromClassroom(classroom);
			return await this.repository.delete(classroomName);
		}
		else
			return undefined
	}
}
