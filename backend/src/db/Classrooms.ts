import { AbstractRepository, EntityRepository } from 'typeorm';
import { Classroom } from '../../entities/Classroom';
import { imagesPaths } from '../../src/index';
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
		let classrooms =  await this.repository.find({relations: ["computers"]});
		let mappedClassrooms : IClassroom[] = classrooms.map(classroom=>{
			let numOfBroken = classroom.computers.reduce((acc, comp) => acc += (comp.broken ? 1 : 0)
														, 0);
			let numOfWorking = classroom.computers.length - numOfBroken;
			const schemaUrl = baseUrl + `static/schemas/${classroom.name}.svg`
			const imageUrl =  baseUrl + "static/images/" + imagesPaths.get(classroom.name);
			return {
				name: classroom.name,
				location: classroom.location,
				numberOfComputers: {
					working: numOfWorking,
					broken: numOfBroken
				},
				imageUrl: imageUrl,
				schemaUrl: schemaUrl,
			}
		})
		return mappedClassrooms;
	}
}