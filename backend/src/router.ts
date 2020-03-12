import express from 'express';
import { getRepository } from 'typeorm';
import { Classroom } from '../entities/Classroom';
const router = express.Router();

router.use((req, _res, next)=>{
	console.log("challenge : " + req.baseUrl);
	next();
});

router.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

router.get("/classrooms", (_req, res)=>{
	let classroomsRepo = getRepository(Classroom);
	classroomsRepo.find().then(dbRes => res.send(dbRes));
});

export {router};