import express from 'express';
import { getAllClassrooms } from '../db/Classrooms';
import { getComputersFromClassroom } from '../db/Computers';
const classroomsRouter = express.Router();


classroomsRouter.get("/", (req, resp)=>{
	const baseUrl = req.protocol + "://" + req.get("host") + "/";
	getAllClassrooms(baseUrl).then(allClassrooms => resp.send(allClassrooms));
});

classroomsRouter.get("/:classroomName/computers", (req, resp)=>{
	getComputersFromClassroom(req.params.classroomName).then(comps => {
		if(comps.length > 0)
			resp.send(comps)
		else{
			//TODO: aj vrati ovo iz baze keve ti nevenke
			resp.status(404).send({message:"Classroom not found"});
		}
	});
})

export default classroomsRouter;