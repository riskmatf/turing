import { EntityRepository, AbstractRepository } from "typeorm";
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

@EntityRepository(Report)
export class ReportsRepository extends AbstractRepository<Report>
{
	//TODO ovo treba u computer
	public async getReportsForComputerInClassroom(computerId: number, classroomName: string){
		const reports = await this.repository.find({
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

	public async getReportById(reportId: number){
		let report = await this.repository.findOne({
			relations:["adminUsername", "classroomName"],
			where: {
				reportId: reportId,
			}
		});
		//TODO testiraj ovo, promenjeno je sa find na findOne
		if(report === undefined){
			return null;
		}
		const {classroomName, adminUsername, ...rest} = report;
		const mappedReport: IReport = {
			...rest,
			hasAdminComment: report.adminComment ? true : false,
			adminDisplayName: adminUsername ? adminUsername.displayName : null,
			classroomName: classroomName.name
		};

		return mappedReport;
	}


	public async addGeneralReport(data: IGeneralReport){
		//can't use just if(!data.isGeneral) because that includes undefs and nulls
		if(data.isGeneral === false){
			throw new Error("Report not marked as general!");
		}
		let reportData: IReportData = data;

		return this._addReport(reportData);
	}

	public async addComputerReport(data: IComputerReport){
		return this._addReport(data);
	}


/*********************************************PRIVATE******************************************* */

	private async _addReport(data: IReportData){
		let report = this._reportDataToReport(data);
		return this.repository.save(report);
	}

	private _reportDataToReport(data: IReportData){
		let report: Report = new Report();
		let classroom = new Classroom();

		classroom.name = data.classroomName; // save fill fail if name is bad
		report.classroomName = classroom;

		let {classroomName, ...tmp} = data;
		//this is shortcut for filling data, because tmp will have all the missing stuff that report needs
		report = {...report, ...tmp};
		report.fixed = false;
		report.timestamp = Math.floor((+ new Date) / 1000);

		return report;
	}
}

interface IReportData{
	computerId?: number,
    classroomName: string,
    isGeneral: boolean,
    description: string,
    urgent: boolean
}

export interface IGeneralReport{
	classroomName: string,
	isGeneral: boolean, 
	description: string, 
	urgent: boolean,
}

export interface IComputerReport{
	computerId: number,
    classroomName: string,
    isGeneral: boolean,
    description: string,
    urgent: boolean
}