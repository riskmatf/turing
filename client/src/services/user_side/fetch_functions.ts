import axios from 'axios';
import config from "../../config";
import { Classroom } from '../../models/user_side/classroom';
import { Report } from '../../models/user_side/report';
import { ReportData } from './i_report_service';
import { Result } from '../../utils/result';

//TODO: process errors

function fetchAllClassrooms(){
	return new Promise((resolve, _reject)=>{
		let classrooms : Classroom[] = [];
		axios.get(config.API_URL + "/classrooms/").then((response)=>{
			let tmp : any[] =response.data.classrooms;
			tmp.forEach(classroom =>{
				classrooms.push(new Classroom(classroom.name, classroom.location, classroom.schemaUrl,
												classroom.numberOfComputers));
			});
			resolve(classrooms);
		});
	})
	
}

function fetchClassroomByName(name : string){
	return new Promise((resolve, reject)=>{
		let classroom : Classroom | null= null;
		axios.get(config.API_URL + "/classrooms/" + name).then((response)=>{
			let tmp : any = response.data.classroom;
			if (tmp != null){
				classroom = new Classroom(tmp.name, tmp.location, tmp.schemaUrl,
					tmp.numOfComputers);
			}

            if(classroom != null){
                resolve(classroom);
            }
            else{
                reject(classroom);
            }
		});

	})
}

type nextObject = {
	itemsRemaining : number,
	nextPageUrl : string
}

function fetchReports(params : any) : Promise<Result<Error, Report[]>>{
	return (async ()=>{
		let reports : Report[] = [];
		let next : nextObject | null = null;
		let url : string = config.API_URL + "/reports/";
		do{
			let response = await axios.get(url, { params });
			let tmp : any[] = response.data.reports;
			next = response.data.next;
			params = {};//params are encoded in next url!;
			tmp.forEach(report=>{
				reports.push(new Report(report.reportId, report.classroomName, report.timestamp,
										report.reportComment,report.fixed, report.urgent, report.reportType,
										report.computerID, report.adminUsername, report.adminComment,
										report.displayName));
			});
			console.log(reports);
			if(next != null){
				url = next.nextPageUrl;
			}
		}while(next != null);
		return Result.value<Error, Report[]>(reports);
	})();
}

function fetchReportByID(id : number) : Promise<Result<Error, Report>>{
	return (async ()=>{
		let response = await axios.get(config.API_URL + "/reports/" + id);
		let report : Report | null = null;
		if(response.data.report != null){
			let tmp = response.data.report;
			report = new Report(
								tmp.tmpId, tmp.classroomName, tmp.timestamp,
								tmp.tmpComment, tmp.fixed, tmp.urgent, tmp.type,
								tmp.computerID, tmp.adminUsername, tmp.adminComment,
								tmp.displayName
			);
		}
		if(report == null){
			return Result.error<Error, Report>(new Error("Bad report id!"));
		}
		else{
			return Result.value<Error, Report>(report);
		}
	})();
}

function addReport(data : ReportData){
	return (async()=>{
		let response = await axios.post(config.API_URL + "/reports/", data);
		if(response.status == 200){
			let report : Report = new Report(response.data.id, data.classroomName, data.date,
											data.description, false, data.urgent, data.type,
											data.idComputer);
			return Result.value<Error, Report>(report);
		}
		else{
			return Result.error<Error, Report>(new Error(response.data.msg));
		}
	})();
}

export {fetchAllClassrooms, fetchClassroomByName, fetchReportByID, fetchReports, addReport};