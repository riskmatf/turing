import { report, nextObject } from "../../types/types";
import { dbCon } from "../dbConnection";
import config from '../../config';


/**
 * When time is right, do this: https://use-the-index-luke.com/sql/partial-results/fetch-next-page
 */

 /**
  * 
  * @param whereClauseParams key value pairs of params for where clause
  */
function createWhereClause(whereClauseParams : Map<string, string | number>){
	let whereClause = "";
	let whereClauseConidtions : string[] = [];
	if(whereClauseParams.size > 0){
		whereClause += "where ";
		whereClauseParams.forEach((val : any, key : string)=>{
			//if given queryParam is array of values, like classrooms = [718, jag1, 704]

			if(key == "classroomName"){
			//	console.log(val);
				if(val.length > 0){
					let tmp : string[] = [];
					val.forEach((v : string) =>{
						tmp.push(key + "=" + dbCon.escape(v) + " ")
					});
					whereClauseConidtions.push("(" + tmp.join(" or ") + ") ");
				}
			}//reportComment is NULL or NOT NULL so it has to go like this
			else if(key == "adminComment"){
				whereClauseConidtions.push(key + " IS " + ((val == 1) ? " NOT " : "") + " NULL ")
			}
			else{
				whereClauseConidtions.push(key + "=" + dbCon.escape(val) + " ");
			}
		})
		whereClause += whereClauseConidtions.join(" and ");
	}
	//console.log(whereClause);
	return whereClause == "where " ? "" : whereClause;
}

/**
 * 
 * @param reportsParameters key value pairs of given query parameters
 * @param limit current limit
 * @param offset current offset(new offset is calculated in this function)
 */
function createUrlQueryPart(reportsParameters : Map<string, string | number>, limit : number,
							offset : number)
	{
		let urlQueryPart : string = "";
		let urlQueryParams : string[] = [];
		urlQueryPart =  "?limit=" + limit + "&offset=" + (offset + limit);
		if(reportsParameters.size > 0){
			reportsParameters.forEach((val : string | number, key : string)=>{
				urlQueryParams.push(key+"="+val);
			})
			urlQueryPart += "&" + urlQueryParams.join("&");;
		}
		return urlQueryPart;

}
/**
 * 
 * @param reportsParameters params for selecting reports
 * @param offset page offset
 * @param limit page limit
 * @param finalCallback Callback for sending data
 */
function getReports(	reportsParameters : Map<string, string | number>, offset : number,
						limit : number,
						finalCallback : ((reports : report[], next : nextObject | null)=>void))
	{
		//const URL_START = "http://localhost:8888/api/turing"; //TODO: CHANGE THIS WHEN DEPLOYING
		let whereClause = createWhereClause(reportsParameters);
		let reportsQuery : string = "select r.*, a.displayName from reports r left join admins a on "
									+"r.adminUsername = a.username " + whereClause + "limit " 
									+ dbCon.escape(limit) + " offset " + dbCon.escape(offset);
		let countQuery : string = "select count(*) as numOfCols from reports " + whereClause;
		//console.log(reportsQuery);
		dbCon.query(reportsQuery + ";" + countQuery, (err, res, _fields)=>{
			if(err){
				console.log(err.message);
				throw err;
			}
			//res is now array of arrays
			//res[0] is resp for first query(reports)
			//res[1] is resp for second query(count)
			let totalNumOfCols : number = res[1][0].numOfCols;
			let itemsRemaining : number = Math.max((totalNumOfCols - (offset + limit)), 0);
			let next : nextObject | null = null;
			if(itemsRemaining > 0){
				let nextUrl : string = "";
				nextUrl = config.API_URL + "/reports"
									+ createUrlQueryPart(reportsParameters, limit, offset);
				next = {itemsRemaining : itemsRemaining, nextPageUrl : nextUrl}
			}
			finalCallback(res[0], next);
		})
}
/**
 * 
 * @param reportID ID of report to get
 * @param finalCallback Callback for sending data
 */
function getReportById(reportID : number, finalCallback : ((reports : report[])=>void))
{
	dbCon.query('select * from reports where reportID = ? limit 1', 
				[reportID],
				(err, res : report[], _fields)=>
				{
					if(err){
						console.log(err.message);
						throw(err);
					}
					finalCallback(res);
				})
}

function deleteReport(reportID : number, finalCallback : (()=>void)){
	dbCon.query("delete from reports where reportId = ?", [reportID],
				(err, _res : report[], _fields)=>
					{
						if(err){
							console.log(err.message);
							throw(err);
						}
						finalCallback();
					}
				)
}
function createReport(reportColumns : Map<string, string | number>,
					finalCallback : (msg : string, httpCode : number, id?: number, )=>void){
	let query : string = "insert into reports ";
	query += "(" + Array.from(reportColumns.keys()).join(",") + ")";
	query += " values (" + Array(reportColumns.size).fill("?").join(",") + ")";
	dbCon.query(query, Array.from(reportColumns.values())
			,(err, res, _fields)=>{
				if(err){
					if(err.sqlState == "45000"){
						finalCallback(err.message, 400);
						return;
					}
					else{
						throw err;
					}
				}
				finalCallback("All OK!", 200, res.insertId);
			});
}

function solveReport(reportID: number, adminUsername: string, adminComment : string | null,
					finalCallback : (message? : string, httpCode? : number)=>void )
{
	dbCon.query("select * from reports where reportId = ?", [reportID],
				(err, res : report[], _fields)=>{
					if(err){
						throw err;
					}
					if(res.length == 0){
						finalCallback("BAD REPORT ID", 400);
						return;
					}
					else if(res[0].fixed){
						finalCallback("Report allready solved", 400)
						return;
					}
					else{
						let query = "update reports set fixed = 1, urgent = 0, adminUsername = ?, " + 
						" adminComment = ? where reportId = ?";
						let vals = [adminUsername, adminComment, reportID];
						dbCon.query(query, vals, (err, _res, _fields)=>{
							if(err){
								throw err;
							}
							finalCallback();
						});
					}
				})
}

function updateReport(reportID: number, adminUsername: string, adminComment : string | null,
				finalCallback : (message? : string, httpCode? : number)=>void)
{
	dbCon.query("select * from reports where reportId = ?", [reportID],
	(err, res : report[], fields)=>{
		if(err){
			throw err;
		}
		if(res.length == 0){
			finalCallback("BAD REPORT ID!", 400);
			return;
		}
		/* else if(!res[0].fixed){
			finalCallback("CAN'T UPDATE UNSOLVED REPORT!", 400);
			return;
		} */
		else if(res[0].adminUsername != null && res[0].adminUsername != adminUsername){
			finalCallback("CAN'T UPDATE REPORT SOMEONE ELSE SOLVED!", 400);
			return;
		}
		else{
			let query = "update reports set adminComment = ?, adminUsername = ? where reportId = ?";
			let vals = [adminComment, adminUsername, reportID];
			dbCon.query(query, vals, (err, _res, _fields)=>{
				if(err){
					throw err;
				}
				finalCallback();
			});
		}
	})
}

export {getReportById, getReports, deleteReport, createReport, solveReport, updateReport};