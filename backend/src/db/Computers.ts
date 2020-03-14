import { Computer} from "../../entities/Computer";
import { getRepository } from "typeorm";

interface IComputer {
    computerId: number,
    classroomName: string,
    status: 'broken' | 'working' | 'hasReports'
}

export async function getComputersFromClassroom(classroomName: string){
	let computersRepo = getRepository(Computer);

	let computers = await computersRepo
						.createQueryBuilder("computer")
						.leftJoinAndSelect("computer.reports", "report",
								"report.classroomName = computer.classroomName and report.fixed=0")
						.where("computer.classroomName = :cName", {cName: classroomName})
						.getMany();

	const mappedComputers: IComputer[] = computers.map(comp=>{
		let status: 'broken' | 'working' | 'hasReports';
		if(comp.broken){
			status = "broken";
		}
		else if(comp.reports.length > 0){
			status = "hasReports";
		}
		else{
			status = "working";
		}
		return {
			computerId: comp.id,
			classroomName: comp.classroomName.name,
			status: status
		}
	});
	return mappedComputers;
}