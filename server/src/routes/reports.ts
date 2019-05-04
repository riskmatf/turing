import {Router} from 'express';
import {report, nextObject} from "../types/types";
import {json} from 'body-parser';
import { getReportById, getReports } from '../db/functions/reportsDB';

 /***
  * TODO:
  * bice GET na /subscribe
  * vratim neke headere:
  * 	conn type :keep alive
  * 	i sacuvam resp objekat u globalan niz
  */
const router = Router();

router.use(json());

router.get('/reports', (req, res)=>{

	let offset : number = 0;
	let limit : number = 42;
	let whereClauseParams : Map<string, string | number> = new Map();
	if(req.query.classroomName != undefined){
		whereClauseParams.set("classroomName", req.query.classroomName);
	}
	if(req.query.fixed != undefined){
		if(req.query.fixed != 0 && req.query.fixed != 1){
			res.status(400).send("ERROR! Fixed must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("fixed", req.query.fixed);
	}
	if(req.query.urgent != undefined){
		if(req.query.urgent != 0 && req.query.urgent != 1){
			res.status(400).send("ERROR! Urgent must be either 0 or 1!");
			return;
		}
		whereClauseParams.set("urgent", req.query.urgent);
	}
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
				res.json({
						reports: results,
						next : nextObject
					})
			});
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
