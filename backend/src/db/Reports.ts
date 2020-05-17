import {AbstractRepository, EntityRepository, getCustomRepository} from "typeorm";
import {Report} from "../../entities/Report";
import {Classroom} from "../../entities/Classroom";
import {Computer} from "../../entities/Computer";
import {ComputersRepository, IAdminReportOverview, IReportOverview} from "./Computers";
import {Admin} from "../../entities/Admin";
import {AdminRepository} from "./Admins";
import {ClassroomsRepository} from "./Classrooms";


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
		const reports = await this.repository.createQueryBuilder("reports")
			.where("classroomName = :cname AND isGeneral = true AND fixed = :fixed", {cname: classroomName, fixed})
			.orderBy("reports.urgent", "DESC")
			.addOrderBy("reports.timestamp", "DESC")
			.getMany();

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
		const reportsCount = await this.repository.createQueryBuilder("reports")
			.where("classroomName = :cname AND fixed = :fixed and isGeneral = true", {cname: classroomName, fixed})
			.getCount();
		return reportsCount !== 0;
	}

	public async getReportsForComputer(computer : Computer, fixed: boolean = false){
		return await this.repository
			.createQueryBuilder("reports")
			.where("reports.computerId = :cid AND reports.classroomName = :cname AND fixed = :fixed",
				{
					cid: computer.id,
					cname: computer.classroomName,
					fixed
				})
			.orderBy("reports.urgent", "DESC")
			.addOrderBy("reports.timestamp", "DESC")
			.getMany();
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
		const report = await ReportsRepository._reportDataToReport(data);
		if(report === undefined)
			return undefined;
		// because repo.save does not work with the exact same object for some reason, we need this again
		return this.repository.createQueryBuilder("reports")
			.insert()
			.into(Report)
			.values([{
				...report
			}
			])
			.execute();
	}

	private static async _reportDataToReport(data: IReportData){
		let report: Report = new Report();
		const computerRepo = getCustomRepository(ComputersRepository);
		const classroomRepo = getCustomRepository(ClassroomsRepository);
		const classroom = await classroomRepo.getClassroomByName(data.classroomName);
		const computer = data.computerId !== undefined ? await computerRepo.getComputer(data.computerId, data.classroomName)
									: null;
		if(computer === undefined || classroom === undefined){
			return undefined;
		}
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