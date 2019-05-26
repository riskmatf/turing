import {Router, Response} from 'express';
import {report, nextObject} from "../types/types";
import {json} from 'body-parser';
import { getReportById, getReports, createReport } from '../db/functions/reportsDB';

function parseQueryParams(query : any, res : Response) : Map<string, string | number> | undefined
{
	let whereClauseParams : Map<string, string | number> = new Map();
	let offset : number = 0;
	let limit : number = 42;
	console.log(query);
	if(query.classrooms != undefined){
		whereClauseParams.set("classroomName", JSON.parse(query.classrooms));
	}
	if(query.fixed != undefined){
		if(query.fixed != 0 && query.fixed != 1){
			res.status(400).send("ERROR! Fixed must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("fixed", query.fixed);
	}
	if(query.comment != undefined){
		if(query.comment != 0 && query.comment != 1){
			res.status(400).send("ERROR! Comment must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("adminComment", query.comment);
	}
	if(query.urgent != undefined){
		if(query.urgent != 0 && query.urgent != 1){
			res.status(400).send("ERROR! Urgent must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("urgent", query.urgent);
	}


	return whereClauseParams;

}
const router = Router();

router.use(json());

router.post("/reports",(req,res)=>{
	let body = req.body;
	const requiredFields : string[] = ["classroomName", "reportType"];
	const optionalFields : string[] = ["computerID", "reportComment", "urgent"];
	let reportColumns : Map<string, string | number> = new Map();
	for(let field of requiredFields){
		if(body[field] == null){
			res.status(400).send(`${field} is not provided or is null!`);
			return;
		}
		else{
			reportColumns.set(field, body[field]);
		}
	}
	for(let field of optionalFields){
		if(body[field] != null){
			reportColumns.set(field, body[field]);
		}
	}

	createReport(reportColumns, (msg="All OK!", httpCode = 200, id?)=>{
		if(httpCode == 200){
			res.status(httpCode).send({id:id});
		}
		else{
			res.status(httpCode).send({msg:msg});
		}
	})
})

router.get('/reports', (req, res)=>{

	let offset : number = 0;
	let limit : number = 42;
	console.log(req.query);
	let whereClauseParams = parseQueryParams(req.query, res);
	console.log(whereClauseParams);
	if (whereClauseParams == undefined){
		return;
	}
	else{
		if(req.query.offset != undefined){
			offset = parseInt(req.query.offset);
			if(isNaN(offset)){
				res.status(400).send("ERROR! Offset is NaN");
				return;
			}
		}
		if(req.query.limit != undefined){
			limit = parseInt(req.query.limit);
			if(isNaN(limit)){
				res.status(400).send("ERROR! Limit is NaN");
				return;
			}
		}
		getReports(whereClauseParams, offset, limit,
				(results : report[], nextObject : nextObject | null)=>{
					let nullableCols = ["adminComment", "adminUsername", "computerID", "reportComment"];
					results.forEach(report => {
						nullableCols.forEach(col => {
							if((report as any)[col] === null){
								(report as any)[col] = undefined;
							}
						});
					});
					res.json({
							reports: results,
							next : nextObject
						})
				});
	}
});

router.get('/reports/:id',
	(req, res)=>{
		const repID = req.params.id;
		if(repID <= 0){
			res.status(400).send('INVALID ID!');
		}
		else{
			getReportById(repID,
						(reports : report[])=>{
				let report = null;
				if(reports.length > 0){
					report = reports[0]
				}
				res.json({
					report : report
				});
			})
		}
	}
)

export default router;
