import { Computer} from "../../entities/Computer";
import {AbstractRepository, EntityRepository, getCustomRepository} from "typeorm";
import {ClassroomsRepository} from "./Classrooms";
import {ReportsRepository} from "./Reports";
import {Classroom} from "../../entities/Classroom";
interface IComputer {
    computerId: number,
	classroomName: string,
	isBroken: boolean,
	hasReports: boolean,
}

export interface IReportOverview{
    reportId: number,
    description: string,
    hasAdminComment: boolean,
    timestamp: number,
    urgent: boolean,
}

export interface IAdminReportOverview extends IReportOverview{
	fixed: boolean
}

@EntityRepository(Computer)
export class ComputersRepository extends AbstractRepository<Computer>{
	public async getComputersFromClassroom(classroomName: string){
		const computers = await this.repository
							.createQueryBuilder("computer")
							.where("computer.classroomName = :cName", {cName: classroomName})
							.getMany();
		const reportsRepo = getCustomRepository(ReportsRepository);
		const mappedComputers: IComputer[] = await Promise.all(computers.map(async comp=>{
			const isBroken: boolean = comp.broken;
			const reports = await reportsRepo.getReportsForComputer(comp);
			const hasReports = reports.length > 0;
			return {
				computerId: comp.id,
				classroomName: comp.classroomName.name,
				isBroken,
				hasReports,
			}
		}));
		return mappedComputers;
	}

	public async getReportsForComputerInClassroom(computerId: number, classroomName: string){
		const classroomRepo = getCustomRepository(ClassroomsRepository);
		const reportsRepository = getCustomRepository(ReportsRepository);
		const classroom = await classroomRepo.getClassroomByName(classroomName);
		if(!classroom){
			return undefined;
		}
		const computer = await this.repository.findOne({
			where:{
				classroomName: classroom,
				id: computerId,
			}
		});
		if(!computer){
			return undefined;
		}
		const reports = await reportsRepository.getReportsForComputer(computer);
		const mappedReports: IReportOverview[] = reports.map(rep=>{
			return {
				reportId: rep.reportId,
				description: rep.description,
				hasAdminComment: !!rep.adminComment,
				timestamp: rep.timestamp,
				urgent: rep.urgent
			}
		});
		return mappedReports;
	}
	public async deleteComputersFromClassroom(classroomName: Classroom){
		return this.repository.delete({ classroomName });
	}
	public async setBrokenFlag(computerId: number, classroomName: string, broken: boolean){
		const qb = await this.repository
			.createQueryBuilder("computer")
			.update(Computer)
			.set({broken})
			.where("id = :computerId and classroomName = :classroomName", {computerId, classroomName})
			.execute();
		if(qb.raw.affectedRows !== 1){
			return undefined; // no computer matched
		}
		return qb.raw.changedRows === 1;
	}

	public async getComputer(computerId: number, classroomName: string){
		const classroomRepo = getCustomRepository(ClassroomsRepository);
		const classroom = await classroomRepo.getClassroomByName(classroomName);
		if(!classroom){
			return undefined;
		}
		return await this.repository.findOne({
			where:{
				classroomName: classroom,
				id: computerId,
			}
		});
	}
}
