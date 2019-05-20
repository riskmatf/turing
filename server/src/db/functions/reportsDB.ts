import { report, nextObject } from "../../types/types";
import { dbCon } from "../dbConnection";


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
		whereClauseParams.forEach((val : string | number, key : string)=>{
			whereClauseConidtions.push(key + "=" + dbCon.escape(val) + " ");
		})
		whereClause += whereClauseConidtions.join(" and ");
	}
	return whereClause;
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
		const URL_START = "http://localhost:8888/api/turing"; //TODO: CHANGE THIS WHEN DEPLOYING
		let whereClause = createWhereClause(reportsParameters);
		let reportsQuery : string = "select r.*, a.displayName from reports r left join admins a on r.adminUsername = a.username " + 
		whereClause + "limit " + dbCon.escape(limit) + " offset " + dbCon.escape(offset);
		let countQuery : string = "select count(*) as numOfCols from reports " + whereClause;
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
				nextUrl = URL_START + "/reports"
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

export {getReportById, getReports};