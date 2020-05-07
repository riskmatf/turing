import {AbstractRepository, EntityRepository, FindOperator} from "typeorm";
import {Report} from "../../entities/Report";
import {Classroom} from "../../entities/Classroom";
import {Computer} from "../../entities/Computer";
import {IReportOverview} from "./Computers";


export interface IReportForSending{
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
	canChangeComment?: boolean
}


export interface IFilter{
    whereParams: {
		urgent?: boolean;
		fixed?: boolean;
		adminComment?: FindOperator<any>;
		classroomName? : FindOperator<Classroom>,
		computerId? : string
	},
	locations?: string[],
	take : number,
	skip: number
}
export const PAGE_SIZE = 20;
@EntityRepository(Report)
export class ReportsRepository extends AbstractRepository<Report>
{
	public async getReportsWithFilters(params : IFilter, loggedUser: string){
		let reports = await this.repository.find({
			relations:["adminUsername", "classroomName"],
			where:{
				...params.whereParams

			},
			take: params.take,
			skip: params.skip,
			order:{
				urgent: "DESC",
				timestamp: "DESC",
			}

		});
		if(params.locations !== undefined){
			reports = reports.filter(report => {
			    // ignore warning bcs it has if above... rly typescript?
				// @ts-ignore
				return params.locations.indexOf(report.classroomName.location) !== -1;
			})
		}
		return reports .map(report => {
			return ReportsRepository._mapReport(report, loggedUser);
		});
	}
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
		return ReportsRepository._mapReport(report);
	}

	public async getMaxNumberOfPages(params : IFilter){
		let reports = await this.repository.find({
			relations: ["classroomName"],
			where:{
				...params.whereParams
			}
		});
		if(params.locations !== undefined){
			reports = reports.filter(report => {
				// ignore warning bcs it has if above... rly typescript?
				// @ts-ignore
				return params.locations.indexOf(report.classroomName.location) !== -1;
			})
		}
		return Math.floor(reports.length/PAGE_SIZE);
	}

	private static _mapReport(report: Report, loggedUser: string = ""){
		const {classroomName, adminUsername, computerId, ...rest} = report;
		const mappedReport: IReportForSending = {
			...rest,
			hasAdminComment: !!report.adminComment,
			adminDisplayName: adminUsername ? adminUsername.displayName : null,
			classroomName: classroomName.name,
			computerId: computerId ? computerId.id : null,
			canChangeComment: adminUsername? adminUsername.username === loggedUser : false
		};
		return mappedReport;
	}

	public async addGeneralReport(data: IGeneralReport){
		if(!data.isGeneral){
			throw new Error("Report not marked as general!");
		}
		const reportData: IReportData = data;

		return this._addReport(reportData);
	}

	public async addComputerReport(data: IComputerReport){
		return this._addReport(data);
	}

	public async deleteReportsFromClassroom(classroomName: Classroom){
		return this.repository.delete({ classroomName });
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
	public async hasGeneralReports(classroomName: string, fixed: boolean = false) {
		const reports = await this.repository.find({
			where: {
				classroomName,
				fixed
			}
		});
		return reports.length !== 0;
	}

	public async getReportsForComputer(computer : Computer, fixed: boolean = false){
		return await this.repository.find({
			where: {
				computerId: computer,
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
		if(data.computerId !== undefined)
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