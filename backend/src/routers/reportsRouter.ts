import express from 'express';
import {ReportsRepository} from '../db/Reports';
import { Report } from '../../entities/Report';
import { getCustomRepository } from 'typeorm';
import { serverError } from '../apiRouter';
import { ComputersRepository } from '../db/Computers';

const reportsRouter = express.Router();

reportsRouter.get("/", (req, resp)=>{
	let computerId: number | undefined;
	if(!req.query.hasOwnProperty("classroomName")){
		resp.status(400).send({message: `Missing required param classroomName`});
		return;
	}
	const classroomName : string = req.query.classroomName.toString();
	if(req.query.hasOwnProperty("computerId")){
		computerId = +req.query.computerId;
	}
	if(computerId){
		const repo = getCustomRepository(ComputersRepository);
		repo.getReportsForComputerInClassroom(computerId, req.query.classroomName.toString())
			.then(reports=>{
				if(reports)
					resp.send(reports);
				else{
					resp.status(404).send({message:"Given computer/classroom does not exist"});
				}
			})
			.catch(err=>{serverError(err, resp)});
	}
	else{
	    const repo = getCustomRepository(ReportsRepository);
	    repo.getGeneralReports(classroomName)
			.then( reports =>{
				resp.send(reports);
			})
			.catch(err=>{
				console.log(`Error while getting general reports for classroom ${classroomName}: ${JSON.stringify(err)}`);
				resp.status(500).send({message: "NEPOZNATA GREŠKA NA SERVERU!"})
			})
	}
});


reportsRouter.get("/:id", (req, resp)=>{
	const repo = getCustomRepository(ReportsRepository);
	repo.getReportById(+req.params.id).then(report=>{
						if(report){
							resp.send(report);
						}
						else{
							resp.status(404).send({message: "Report not found"});
						}
					});
});


reportsRouter.post("/", (req, resp)=>{
	const repo = getCustomRepository(ReportsRepository);
	const requiredParams = ["classroomName", "description", "isGeneral", "urgent"];

	for(const param of requiredParams){
		if(!req.body.hasOwnProperty(param)){
			resp.status(400).send(`Missing required param ${param}`);
			return;
		}
	}
	if(req.body.isGeneral === false){
		if(!req.body.hasOwnProperty("computerId")){
			resp.status(400).send(`Missing required param computerId`);
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
			computerId,
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
		// TODO: send email
		resp.send({message:"Report successfully added"});
	}).catch(
		err=>{
			serverError(err, resp);
		})
});

export default reportsRouter;