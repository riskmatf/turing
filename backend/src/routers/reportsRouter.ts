import express from 'express';
import {ReportsRepository} from '../db/Reports';
import { Report } from '../../entities/Report';
import { getCustomRepository } from 'typeorm';
import { serverError } from '../apiRouter';
import { ComputersRepository } from '../db/Computers';

const reportsRouter = express.Router();

reportsRouter.get("/", (req, resp)=>{
	const requiredParams : string[] = ["classroomName", "computerId"];
	for (const param of requiredParams) {
		if(!req.query[param]){
			resp.status(400).send(`Missing required param ${param}`);
			return;
		}
	}
	const repo = getCustomRepository(ComputersRepository);
	repo.getReportsForComputerInClassroom(req.query.computerId, req.query.classroomName)
									.then(reports=>{
											if(reports)
												resp.send(reports)
											else{
												resp.status(404).send({message:"Given computer/classroom does not exist"});
											}
										})
									.catch(err=>{serverError(err, resp)});
})


reportsRouter.get("/:id", (req, resp)=>{
	const repo = getCustomRepository(ReportsRepository);
	repo.getReportById(+req.params.id).then(report=>{
						if(report){
							resp.send(report);
						}
						else{
							resp.status(404).send("Report not found");
						}
					});
});


reportsRouter.post("/", (req, resp)=>{
	const repo = getCustomRepository(ReportsRepository);
	const requiredParams = ["classroomName", "computerId", "description", "isGeneral", "urgent"];

	for(const param of requiredParams){
		if(!req.body.hasOwnProperty(param)){
			resp.status(400).send(`Missing required param ${param}`);
			return;
		}
	}
	let promise : Promise<Report>;
	if(!req.body.isGeneral){
		const computerId = Number(req.body.computerId);
		if(isNaN(computerId)){
			resp.status(400).send(`ComputerId is NaN`);
			return;
		}
		promise = repo.addComputerReport({
			classroomName : req.body.classroomName,
			computerId: computerId,
			description: req.body.description,
			isGeneral: req.body.isGeneral,
			urgent: req.body.urgent
		});
	}
	else{
		promise = repo.addGeneralReport({
			classroomName : req.body.classroomName,
			description: req.body.description,
			isGeneral: req.body.isGeneral,
			urgent: req.body.urgent
		});
	}

	promise.then(_res=>{
		//TODO: send email
		resp.send({message:"Report successfully added"});
	}).catch(
		err=>{
			serverError(err, resp);
		})
})

export default reportsRouter;