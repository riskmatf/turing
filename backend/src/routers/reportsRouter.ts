import express from 'express';
import {ReportsRepository} from '../db/Reports';
import {getCustomRepository, InsertResult} from 'typeorm';
import { serverError } from '../apiRouter';
import { ComputersRepository } from '../db/Computers';

const reportsRouter = express.Router();

reportsRouter.get("/", (req, resp)=>{
	let computerId: number | undefined;
	if(!req.query.hasOwnProperty("classroomName")){
		resp.status(400).send({message: `Fali obavezni parametar classroomName`});
		return;
	}
	const classroomName : string = req.query.classroomName.toString();
	if(req.query.hasOwnProperty("computerId")){
		computerId = +req.query.computerId;
	}
	if(computerId !== undefined && isNaN(computerId)){
		resp.status(400).send({message:"Dati Id nije broj!"});
		return;
	}
	// get reports from computer
	if(computerId !== undefined){
		const repo = getCustomRepository(ComputersRepository);
		repo.getReportsForComputerInClassroom(computerId, req.query.classroomName.toString())
			.then(reports=>{
				if(reports)
					resp.send(reports);
				else{
					resp.status(404).send({message:"Dati računar/učionica ne postoji!"});
				}
			})
			.catch(err=>{serverError(err, resp)});
	}
	// get general reports
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
							resp.status(404).send({message: "Izveštaj nije pronađen!"});
						}
					});
});


reportsRouter.post("/", (req, resp)=>{
	const repo = getCustomRepository(ReportsRepository);
	const requiredParams = ["classroomName", "description", "isGeneral", "urgent"];

	for(const param of requiredParams){
		if(!req.body.hasOwnProperty(param)){
			resp.status(400).send(`Fali obavezni parametar  ${param}`);
			return;
		}
	}
	if(req.body.description.length > 1000){
		resp.status(400).send(`Predugačak opis!`);
		return;
	}
	if(req.body.isGeneral === false){
		if(!req.body.hasOwnProperty("computerId")){
			resp.status(400).send(`Fali obavezni parametar computerId`);
			return;
		}
	}
	let promise : Promise<InsertResult | undefined>;
	if(!req.body.isGeneral){
		const computerId = +req.body.computerId;
		if(isNaN(computerId)){
			resp.status(400).send(`ComputerId nije broj!`);
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

	promise.then(res=>{
		// TODO: send email
		if(res !== undefined)
		{
			resp.send({message:"Izeštaj uspešno dodat."});
		}
		else{
			resp.status(400).send( {message:"Loši parametri! Neuspelo dodavanje izveštaja."});
		}
	}).catch(
		err=>{
			serverError(err, resp);
		})
});

export default reportsRouter;