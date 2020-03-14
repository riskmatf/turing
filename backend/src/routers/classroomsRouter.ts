import express from 'express';
import { getAllClassrooms } from '../db/Classrooms';
import { getComputersFromClassroom } from '../db/Computers';
const classroomsRouter = express.Router();


classroomsRouter.get("/", (req, resp)=>{
	const baseUrl = req.protocol + "://" + req.get("host") + "/";
	getAllClassrooms(baseUrl).then(allClassrooms => resp.send(allClassrooms));
});

classroomsRouter.get("/:classroomName/computers", (req, resp)=>{
	getComputersFromClassroom(req.params.classroomName).then(comps => resp.send(comps));
})

export default classroomsRouter;