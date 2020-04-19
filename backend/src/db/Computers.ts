import { Computer} from "../../entities/Computer";
import { AbstractRepository, EntityRepository } from "typeorm";

interface IComputer {
    computerId: number,
	classroomName: string,
	isBroken: boolean,
	hasReports: boolean,
}

interface IReportOverview{
    reportId: number,
    description: string,
    hasAdminComment: boolean,
    timestamp: number,
    urgent: boolean,
}

@EntityRepository(Computer)
export class ComputersRepository extends AbstractRepository<Computer>{
	public async getComputersFromClassroom(classroomName: string){
		const computers = await this.repository
							.createQueryBuilder("computer")
							.leftJoinAndSelect("computer.reports", "report",
									"report.classroomName = computer.classroomName and report.fixed=0")
							.leftJoinAndSelect("computer.classroomName", "classroom")
							.where("computer.classroomName = :cName", {cName: classroomName})
							.getMany();
		const mappedComputers: IComputer[] = computers.map(comp=>{
			const isBroken: boolean = comp.broken;
			const hasReports = comp.reports.length > 0;
			return {
				computerId: comp.id,
				classroomName: comp.classroomName.name,
				isBroken,
				hasReports,
			}
		});
		return mappedComputers;
	}

	public async getReportsForComputerInClassroom(computerId: number, classroomName: string){
		const computer = await this.repository.findOne({
			where:{
				classroomName,
				id: computerId,
				fixed: false
			},
			relations: ["reports"]
		});
		if(!computer){
			return undefined;
		}

		const mappedReports: IReportOverview[] = computer.reports.map(rep=>{
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
}
