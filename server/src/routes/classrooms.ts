import {Router} from 'express';
import {classroom} from "../types/types";
import {json} from 'body-parser';
import { addClassroom, getClassroomsByLocation, getClassroomByName, getAllClassrooms }
																from '../db/functions/classroomsDB';

const router = Router();
router.use(json());

router.get('/classrooms/:name', (req, res)=>{
	getClassroomByName(req.params.name, (classroomArr : classroom[])=>{
		let tmp : classroom | null = null;
		if(classroomArr.length > 0){
			tmp = classroomArr[0];
		}
		res.json({
			classroom : tmp
		})
	})
})


router.get('/classrooms', (req, res) =>
{
	if (req.query.location == undefined){
		getAllClassrooms((allClassrooms : classroom[])=>{
			res.json({
				classrooms: allClassrooms
			});
		});
	}
	else{
		getClassroomsByLocation(req.query.location, (classroomArr : classroom[])=>{
			res.json({
				classrooms : classroomArr
			})
		})
	}
});


router.post('/classrooms', (req, res)=>{
	let body = req.body;
	
	const requiredFields : string[] = ["name", "location", "numOfComputers"];
	for(let field of requiredFields){
		if(body[field] == null){
			res.status(400).send(`${field} is not provided or is null!`);
			return;
		}
	}
	if(body.numOfComputers < 0){
		res.status(400).send("number of computer must be >= 0");
		return;
	}

	addClassroom(body['name'], body.location, body.numOfComputers,
				(msg = "All OK!", httpCode = 200)=>{
					res.status(httpCode).send(msg);
				});
	});

	/**
	 * Admin ima CRUD za ucionice i reportove i admine
	 * CUD ide na poseban endpoint /admin/endpoint
	 * R ide na ovaj koji vec imam
	 * 
	 */

export default router;

