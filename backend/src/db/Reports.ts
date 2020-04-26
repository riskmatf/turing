import {AbstractRepository, EntityRepository} from "typeorm";
import {Report} from "../../entities/Report";
import {Classroom} from "../../entities/Classroom";
import {Computer} from "../../entities/Computer";
import {IReportOverview} from "./Computers";


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
	public async getReportById(reportId: number){
		const report = await this.repository.findOne({
			relations:["adminUsername", "classroomName", "computerId"],
			where: {
				reportId,
			}
		});
		if(report === undefined){
			return undefined;
		}
		console.log(report);
		const {classroomName, adminUsername, computerId, ...rest} = report;
		const mappedReport: IReport = {
			...rest,
			hasAdminComment: !!report.adminComment,
			adminDisplayName: adminUsername ? adminUsername.displayName : null,
			classroomName: classroomName.name,
			computerId: computerId ? computerId.id : null
		};

		return mappedReport;
	}


	public async addGeneralReport(data: IGeneralReport){
		// can't use just if(!data.isGeneral) because that includes undefs and nulls
		if(!data.isGeneral){
			throw new Error("Report not marked as general!");
		}
		const reportData: IReportData = data;

		return this._addReport(reportData);
	}

	public async addComputerReport(data: IComputerReport){
		return this._addReport(data);
	}

	public async getGeneralReports(classroomName: string, fixed: boolean = false){
		const reports = await this.repository.find({
			where:{
				classroomName,
				isGeneral: true,
				fixed
			},
			order:{
				urgent: "DESC",
				timestamp: "DESC",
			}
		});
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

	public async getReportsForComputer(computer : Computer, fixed: boolean = false){
		return await this.repository.find({
			where: {
				computerId: computer.id,
				classroomName: computer.classroomName,
				fixed
			},
			order:{
				urgent: "DESC",
				timestamp: "DESC",
			}
		});
	}


/*********************************************PRIVATE******************************************* */

	private async _addReport(data: IReportData){
		const report = ReportsRepository._reportDataToReport(data);
		return this.repository.save(report);
	}

	private static _reportDataToReport(data: IReportData){
		let report: Report = new Report();
		const classroom = new Classroom();
		const computer = new Computer();

		classroom.name = data.classroomName; // save fill fail if name is bad
		if(data.computerId)
			computer.id = data.computerId;
		report.classroomName = classroom;
		if(!data.isGeneral)
			report.computerId = computer;

		const {classroomName, computerId, ...tmp} = data;
		// this is shortcut for filling data, because tmp will have all the missing stuff that report needs
		report = {...report, ...tmp};
		report.fixed = false;
		report.timestamp = Math.floor((+ new Date()) / 1000);

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