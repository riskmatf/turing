import {AbstractRepository, EntityRepository, getCustomRepository} from "typeorm";
import {Report} from "../../entities/Report";
import {Classroom} from "../../entities/Classroom";
import {Computer} from "../../entities/Computer";
import {ComputersRepository, IAdminReportOverview, IReportOverview} from "./Computers";
import {Admin} from "../../entities/Admin";
import {AdminRepository} from "./Admins";


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
		locations?: string[];
		classrooms?: string[];
		urgent?: boolean;
		fixed?: boolean;
		computerId? : number
	},
	take : number,
	skip: number,
	whereString: string
}
export const PAGE_SIZE = 20;
@EntityRepository(Report)
export class ReportsRepository extends AbstractRepository<Report>
{
	public async getReportsWithFilters(params : IFilter){
		const reports = await this
			.createQueryBuilder("reports")
			.leftJoinAndSelect(Admin, "admins",
							"reports.adminUsername = admins.username")
			.leftJoinAndSelect(Classroom, "classrooms",
				"reports.classroomName = classrooms.name")
			.where(params.whereString, params.whereParams)
			.take(params.take)
			.skip(params.skip)
			.orderBy("reports.urgent", "DESC")
			.addOrderBy("reports.timestamp", "DESC")
			.getMany();
		const mappedReports: IAdminReportOverview[] = reports.map(rep=>{
			return {
				reportId: rep.reportId,
				description: rep.description,
				hasAdminComment: !!rep.adminComment,
				timestamp: rep.timestamp,
				urgent: rep.urgent,
				fixed: rep.fixed,
			}
		});
		return mappedReports;
	}
	public async getReportById(reportId: number, loggedUser: string = ""){
		const compRepo = getCustomRepository(ComputersRepository);
		const {raw, entities} = await this
			.createQueryBuilder("reports")
			.leftJoinAndSelect("reports.adminUsername","admins")
			.leftJoinAndSelect( "reports.classroomName", "classrooms")
			.leftJoinAndSelect(Computer, "computers", "computers.id = reports.computerId and computers.classroomName = reports.classroomName")
			.where("reports.reportId = :reportId", {reportId})
			.getRawAndEntities();
		if(entities.length === 0){
			return undefined;
		}
		const report = entities[0];
		const comp = await compRepo.getComputer(raw[0].reports_computerId as number, report.classroomName.name);
		report.computerId = comp ? comp : null;
		return ReportsRepository._mapReport(report, loggedUser);
	}

	public async getMaxNumberOfPages(params : IFilter){
		const numberOfReports = await this
			.createQueryBuilder("reports")
			.leftJoinAndSelect(Admin, "admins",
				"reports.adminUsername = admins.username")
			.leftJoinAndSelect(Classroom, "classrooms",
				"reports.classroomName = classrooms.name")
			.where(params.whereString, params.whereParams)
			.getCount();
		return Math.floor(numberOfReports/PAGE_SIZE);
	}
	public async solveReport(reportId: number){
		const report = await this.repository.findOne(reportId);
		if(report === undefined){
			return undefined;
		}
		report.fixed = true;
		return this.repository.save(report);
	}
	public async deleteReport(reportId: number){
		return this.repository.delete(reportId);
	}
	private static _mapReport(report: Report, loggedUser: string = ""){
		const {classroomName, adminUsername, computerId, ...rest} = report;
		const mappedReport: IReportForSending = {
			...rest,
			hasAdminComment: !!report.adminComment,
			adminDisplayName: adminUsername ? adminUsername.displayName : null,
			classroomName: classroomName.name,
			computerId: computerId ? computerId.id : null,
			canChangeComment: adminUsername ?  adminUsername.username === loggedUser : false
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

	public async setComment(reportId: number, comment: string, adminUsername: string){
		const report = await this.repository.findOne(
			{
				where:{
					reportId
				},
				relations: ["adminUsername"]
			});
		const adminRepo = getCustomRepository(AdminRepository);
		const admin = await adminRepo.findByUsername(adminUsername);
		// admin will never be undef but check is needed for type reasons
		if(report === undefined || admin === undefined){
			return undefined;
		}
		if(report.adminUsername !== null && report.adminUsername.username !== adminUsername){
			return false;
		}
		report.adminComment = comment;
		report.adminUsername = admin;
		return this.repository.save(report);
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