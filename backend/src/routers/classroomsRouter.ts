import express from 'express';
// import { getAllClassrooms, getClassroomByName } from '../db/Classrooms';
import { ComputersRepository } from '../db/Computers';
import { ClassroomsRepository } from '../db/Classrooms';
import { getCustomRepository } from 'typeorm';
import { serverError } from '../apiRouter';
const classroomsRouter = express.Router();


classroomsRouter.get("/", (req, resp)=>{
	const baseUrl = req.protocol + "://" + req.get("host") + "/";
	const repo = getCustomRepository(ClassroomsRepository);
	repo.getAllClassrooms(baseUrl).then(allClassrooms => {
		allClassrooms.sort((c1, c2)=>{return c1.name < c2.name ? -1 : 1});
		resp.send(allClassrooms)
	});
});

classroomsRouter.get("/:classroomName/computers", (req, resp)=>{
	const computerRepo = getCustomRepository(ComputersRepository);
	computerRepo.getComputersFromClassroom(req.params.classroomName)
				.then(comps => {
					if(comps.length > 0)
						resp.send(comps);
					else{
						resp.status(404).send({message:"Classroom not found"});
					}
				})
				.catch(err=>{
					serverError(err, resp);
				})

});

export default classroomsRouter;