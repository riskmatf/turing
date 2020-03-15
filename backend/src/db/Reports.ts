import { getRepository } from "typeorm";
import { Report } from "../../entities/Report";

interface IReport{
    reportId: number, 
    description: string,
    hasAdminComment: boolean,
    timestamp: number,
    urgent: boolean,
}

export async function getReportsForComputerInClassroom(computerId: number, classroomName: string){

	const reportsRepo = getRepository(Report);

	const reports = await reportsRepo.find({
		where:{
			classroomName: classroomName,
			computerId: computerId,
			fixed: false
		}
	});

	const mappedReports: IReport[] = reports.map(rep=>{

		return {
			reportId: rep.reportId,
			description: rep.description, 
			hasAdminComment: rep.adminComment ? true : false,
			timestamp: rep.timestamp, 
			urgent: rep.urgent
		}
	})

	return mappedReports;

}