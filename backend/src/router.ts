import express from 'express';
import { getRepository } from 'typeorm';
import { Classroom } from '../entities/Classroom';
import { imagesPaths } from '../src/index';
const router = express.Router();

// router.use((req, _res, next)=>{
// 	console.log("challenge : " + req.baseUrl);
// 	next();
// });

router.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

router.get("/classrooms", (req, res)=>{
	let classroomsRepo = getRepository(Classroom);
	classroomsRepo.find({relations: ["computers"]}).then(classrooms=>{
		const baseUrl = req.protocol + "://" + req.get("host") + "/";
		let mappedClassrooms = classrooms.map(classroom=>{
			let numOfBroken = classroom.computers.reduce((acc, comp) => acc += (comp.broken ? 1 : 0)
														, 0);
			let numOfWorking = classroom.computers.length - numOfBroken;
			const schemaUrl = baseUrl + `static/schemas/${classroom.name}.svg`
			return {
				name: classroom.name,
				location: classroom.location,
				numberOfComputers: {
					working: numOfWorking,
					broken: numOfBroken
				},
				imageUrl: baseUrl + "static/images/" + imagesPaths.get(classroom.name),
				schemaUrl: schemaUrl,
			}
		})
		res.send(mappedClassrooms);
	});
});

export {router};