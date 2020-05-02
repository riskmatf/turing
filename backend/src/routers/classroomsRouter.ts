import express from 'express';
// import { getAllClassrooms, getClassroomByName } from '../db/Classrooms';
import { ComputersRepository } from '../db/Computers';
import { ClassroomsRepository } from '../db/Classrooms';
import { getCustomRepository } from 'typeorm';
import { serverError } from '../apiRouter';
import {ReportsRepository} from "../db/Reports";
const classroomsRouter = express.Router();


classroomsRouter.get("/", (req, resp)=>{
	const baseUrl = req.protocol + "://" + req.get("host") + "/";
	const repo = getCustomRepository(ClassroomsRepository);
	repo.getAllClassrooms(baseUrl).then(allClassrooms => {
		allClassrooms.sort((c1, c2)=>{return c1.name < c2.name ? -1 : 1});
		resp.send(allClassrooms)
	});
});

classroomsRouter.get("/:classroomName", (req, resp)=>{
	const computerRepo = getCustomRepository(ComputersRepository);
	const computersPromise = computerRepo.getComputersFromClassroom(req.params.classroomName);
	const reportsRepo = getCustomRepository(ReportsRepository);
	const hasGeneralReportsPromise = reportsRepo.hasGeneralReports(req.params.classroomName);
	Promise.all([computersPromise, hasGeneralReportsPromise]).then(([computers, hasGeneralReports])=>{
		if(computers.length > 0){
			resp.send({
				computers,
				hasGeneralReports
			});
		}
		else{
			resp.status(404).send({message:"Učionica nije pronađena!"});
		}
	})
	.catch(err=>{
		serverError(err, resp);
	})

});

export default classroomsRouter;