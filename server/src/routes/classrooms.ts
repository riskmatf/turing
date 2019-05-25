import {Router} from 'express';
import {classroom} from "../types/types";
import {json} from 'body-parser';
import { getClassroomsByLocation, getClassroomByName, getAllClassrooms }
																from '../db/functions/classroomsDB';
import config from '../config';

const router = Router();
router.use(json());

router.get('/classrooms/:name', (req, res)=>{
	getClassroomByName(req.params.name, (classroomArr : classroom[])=>{
		let tmp : classroom | null = null;
		if(classroomArr.length > 0){
			tmp = classroomArr[0];
			tmp.schemaPath = config.SCHEMAS_URL + tmp.name + ".svg";
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
				classroom.schemaPath = config.SCHEMAS_URL + classroom.name + ".svg";
			});
			res.json({
				classrooms: allClassrooms
			});
		});
	}
	else{
		getClassroomsByLocation(req.query.location, (classroomArr : classroom[])=>{
			classroomArr.forEach(classroom => {
				classroom.schemaPath = config.SCHEMAS_URL + classroom.name + ".svg";
			});
			res.json({
				classrooms : classroomArr
			})
		})
	}
});


export default router;

