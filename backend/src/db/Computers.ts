import { Computer} from "../../entities/Computer";
import { getRepository } from "typeorm";

interface IComputer {
    computerId: number,
	classroomName: string,
	isBroken: boolean,
	hasReports: boolean,
}

export async function getComputersFromClassroom(classroomName: string){
	let computersRepo = getRepository(Computer);

	let computers = await computersRepo
						.createQueryBuilder("computer")
						.leftJoinAndSelect("computer.reports", "report",
								"report.classroomName = computer.classroomName and report.fixed=0")
						.leftJoinAndSelect("computer.classroomName", "classroom")
						.where("computer.classroomName = :cName", {cName: classroomName})
						.getMany();

	const mappedComputers: IComputer[] = computers.map(comp=>{
		let isBroken: boolean = comp.broken ? true : false;
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