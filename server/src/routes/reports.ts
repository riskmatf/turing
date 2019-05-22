import {Router, Response} from 'express';
import {report, nextObject} from "../types/types";
import {json} from 'body-parser';
import { getReportById, getReports } from '../db/functions/reportsDB';

function parseQueryParams(query : any, res : Response) : Map<string, string | number> | undefined
{
	let whereClauseParams : Map<string, string | number> = new Map();
	let offset : number = 0;
	let limit : number = 42;
	if(query.classrooms != undefined){
		whereClauseParams.set("classroomName", query.classrooms);
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
		whereClauseParams.set("reportComment", query.comment);
	}
	if(query.urgent != undefined){
		if(query.urgent != 0 && query.urgent != 1){
			res.status(400).send("ERROR! Urgent must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("urgent", query.urgent);
	}
	if(query.offset != undefined){
		offset = parseInt(query.offset);
		if(isNaN(offset)){
			res.status(400).send("ERROR! Offset is NaN");
			return;
		}
	}
	if(query.limit != undefined){
		limit = parseInt(query.limit);
		if(isNaN(limit)){
			res.status(400).send("ERROR! Limit is NaN");
			return;
		}
	}
	return whereClauseParams;

}
const router = Router();

router.use(json());


router.get('/reports', (req, res)=>{

	let offset : number = 0;
	let limit : number = 42;
	let whereClauseParams = parseQueryParams(req.query, res);
	if (whereClauseParams == undefined){
		return;
	}
	else{
		getReports(whereClauseParams, offset, limit,
				(results : report[], nextObject : nextObject | null)=>{
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
