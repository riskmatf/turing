import { Computer} from "../../entities/Computer";
import { AbstractRepository, EntityRepository } from "typeorm";

interface IComputer {
    computerId: number,
	classroomName: string,
	isBroken: boolean,
	hasReports: boolean,
}

@EntityRepository(Computer)
export class ComputersRepository extends AbstractRepository<Computer>{
	public async getComputersFromClassroom(classroomName: string){
		let computers = await this.repository
							.createQueryBuilder("computer")
							.leftJoinAndSelect("computer.reports", "report",
									"report.classroomName = computer.classroomName and report.fixed=0")
							.leftJoinAndSelect("computer.classroomName", "classroom")
							.where("computer.classroomName = :cName", {cName: classroomName})
							.getMany();

		const mappedComputers: IComputer[] = computers.map(comp=>{
			let isBroken: boolean = comp.broken;
			const hasReports = comp.reports.length > 0;
			return {
				computerId: comp.id,
				classroomName: comp.classroomName.name,
				isBroken: isBroken,
				hasReports: hasReports,
			}
		});
		return mappedComputers;
	}
}
