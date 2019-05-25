import { classroom } from "../../types/types";
import { dbCon } from "../dbConnection";
import { Readable } from "stream";
import fs from "fs";
import config from '../../config';


/**
 * @param finalCallback Callback for sending data
 *
 */
function getAllClassrooms(finalCallback : ((allClassrooms : classroom[]) => void)) : void
{
	let finalRes : classroom[] = [];
	dbCon.query('select * from classrooms', (err, results : classroom[], _fields)=>{
		if(err){
			console.error(err.message);
			throw(err);
		}
		finalCallback(results);
	});
}
/**
 * 
 * @param name name of classroom to get
 * @param finalCallback Callback for sending data
 * 	
 * NOTE: final callback gets array of classrooms to avoid dealing with null or undefined vals
 * its easier to check if array is empty than to deal with nulls and undefs.
 */

function getClassroomByName(name : string,
							finalCallback : ((allClassrooms : classroom[]) => void)) : void
{
	//NOTE: This "cast" in query callback DOES NOT GARANTIE that results will be array of classrooms
	//and there is no way to garantie that(maybe orm but its too late now), so BEWARE!!!!!
	dbCon.query('select * from classrooms where name = ? limit 1', [name.toLowerCase()],
	(err, results : classroom[], _fields)=>{
		if(err){
			console.log(err.message);
			throw(err);
		}
		
		finalCallback(results);
	});
}
/**
 * 
 * @param location location from where to get classrooms
 * @param finalCallback Callback for sending data
 * 
 */
function getClassroomsByLocation(location : string,
								finalCallback : ((allClassrooms : classroom[]) => void)) : void
{
	//NOTE: This "cast" in query callback DOES NOT GARANTIE that results will be array of classrooms
	//and there is no way to garantie that(maybe orm but its too late now), so BEWARE!!!!!
	dbCon.query('select * from classrooms where location = ?', [location.toLowerCase()],
	(err, results : classroom[], _fields)=>{
		if(err){
			console.log(err.message);
			throw(err);
		}
		finalCallback(results);

	});
}
/**
 * 
 * @param name name of classroom to add
 * @param location location of clasrrom to add
 * @param numOfComputers number of computers in classroom, must be >=0 
 * @param finalCallback Callback for sending data
 * 		
 */
function addClassroom(name : string, location : string, numOfComputers : number,
						schema : string,
						finalCallback : (message? : string, httpCode? : number)=>void ) : void
{
	let svgBuffer = Buffer.from(schema, 'base64').toString('utf8');
	fs.writeFileSync(config.SCHEMAS_PATH + name + ".svg", svgBuffer);
	//s.pipe(fs.createWriteStream(config.SCHEMAS_PATH + name + ".svg"));
	dbCon.query('insert into classrooms values(?, ?, ?)', [name, location, numOfComputers],
							(err, _res, _fields)=>{
								if(err){
									if(err.errno == 1062){
										console.error("DUPLICATE ENTRY!");
										finalCallback("DUPLICATE ENTRY!", 409);
										return;
									}
								}
								finalCallback();
							})
}

function deleteClassroom(name:string, finalCallback: () => void) {
	dbCon.query("delete from classrooms where name = ?", [name], 
				(err, res, fields)=>{
					if(err){
						console.log(err.message);
						throw err;
					}
					finalCallback();
				})
}

export {addClassroom, getAllClassrooms, getClassroomByName, getClassroomsByLocation, deleteClassroom}