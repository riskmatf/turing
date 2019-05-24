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
			tmp.schemaPath = "http://localhost:8888/turing/assets/schemas/" + tmp.name + ".svg";
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
			allClassrooms.forEach(classroom => {
				classroom.schemaPath = "http://localhost:8888/turing/assets/schemas/" + classroom.name + ".svg";
			});
			res.json({
				classrooms: allClassrooms
			});
		});
	}
	else{
		getClassroomsByLocation(req.query.location, (classroomArr : classroom[])=>{
			classroomArr.forEach(classroom => {
				classroom.schemaPath = "http://localhost:8888/turing/assets/schemas/" + classroom.name + ".svg";
			});
			res.json({
				classrooms : classroomArr
			})
		})
	}
});


	/**
	 * Admin ima CRUD za ucionice i admine
	 * CUD ide na poseban endpoint /admin/endpoint
	 * R ide na ovaj koji vec imam
	 * 
	 */

export default router;

