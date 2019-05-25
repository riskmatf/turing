import axios from 'axios';
import config from "../../../../config";
import { Classroom } from '../../models/user_side/classroom';

//TODO: process errors

function fetchAllClassrooms(){
	return new Promise((resolve, _reject)=>{
		let classrooms : Classroom[] = [];
		axios.get(config.API_URL + "/classrooms/").then((response)=>{
			let tmp : any[] = JSON.parse(response.data)["classrooms"];
			tmp.forEach(classroom =>{
				classrooms.push(new Classroom(classroom.name, classroom.location, classroom.schemaUrl,
												classroom.numOfComputers));
			});
		});
		resolve(classrooms);
	})
	
}

function fetchClassroomByName(name : string){
	return new Promise((resolve, reject)=>{
		let classroom : Classroom | null= null;
		axios.get(config.API_URL + "/classrooms/" + name).then((response)=>{
			let tmp : any = JSON.parse(response.data)["classroom"];
			if (tmp != null){
				classroom = new Classroom(tmp.name, tmp.location, tmp.schemaUrl,
					tmp.numOfComputers);
			}
		});
		if(classroom != null){
			resolve(classroom);
		}
		else{
			reject(classroom);
		}
	})
}

export {fetchAllClassrooms, fetchClassroomByName};