import express from 'express';
import { getReportsForComputerInClassroom } from '../db/Reports';

const reportsRouter = express.Router();

reportsRouter.get("/", (req, resp)=>{
	const requiredParams : string[] = ["classroomName", "computerId"];
	for (const param of requiredParams) {
		if(!req.query[param]){
			resp.status(400).send(`Missing required param ${param}`);
			return;
		}
	}
	getReportsForComputerInClassroom(req.query.computerId, req.query.classroomName)
									.then(reports=>{resp.send(reports)});
})
export default reportsRouter;