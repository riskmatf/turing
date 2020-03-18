import { getRepository, QueryFailedError } from "typeorm";
import { Report } from "../../entities/Report";
import { Classroom } from "../../entities/Classroom";

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

export interface IReportData{
	computerId?: number,
    classroomName: string,
    isGeneral: boolean,
    description: string,
    urgent: boolean
}

export async function addReport(data: IReportData){

	const classroom = new Classroom();
	classroom.name = data.classroomName;
	let {classroomName, ...tmp} = data;
	let report = new Report();
	
	report = {...report, ...tmp};
	// report.computerId = data.computerId;
	report.classroomName = classroom;
	// report.isGeneral = data.isGeneral;
	// report.description = data.description;
	// report.urgent = data.urgent;
	report.fixed = false;
	report.timestamp = Math.floor((+ new Date) / 1000) ;

	const repo = getRepository(Report);
	return repo.save(report); //returning promise, error handling in caller code
}