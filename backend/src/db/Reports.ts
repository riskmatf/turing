import { getRepository } from "typeorm";
import { Report } from "../../entities/Report";

interface IReportOverview{
    reportId: number, 
    description: string,
    hasAdminComment: boolean,
    timestamp: number,
    urgent: boolean,
}

interface IReport{
    reportId: number, 
    computerId: number | null,
    classroomName: string,
    isGeneral: boolean,
    fixed: boolean,
    description: string,
    hasAdminComment: boolean,
    adminComment: string | null,
    timestamp: number,
    urgent: boolean,
	adminDisplayName: string | null,
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

	const mappedReports: IReportOverview[] = reports.map(rep=>{
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

export async function getReportById(reportId: number){
	console.log(reportId);
	const reportsRepo = getRepository(Report);
	let report = await reportsRepo.find({
		relations:["adminUsername", "classroomName"],
		where: {
			reportId: reportId,
		}
	});
	if(report.length === 0){
		return null;
	}
	const tmp = report[0];
	const {classroomName, adminUsername, ...rest} = tmp;
	const mappedReport: IReport = {
		...rest,
		hasAdminComment: tmp.adminComment ? true : false,
		adminDisplayName: adminUsername ? adminUsername.displayName : null,
		classroomName: classroomName.name
	};

	return mappedReport;
}