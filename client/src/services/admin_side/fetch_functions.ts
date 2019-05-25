import axios from 'axios';
import config from "../../config";
import { User } from '../../models/admin_side/user';
import { Result } from '../../utils/result';
import {addReport as userAddReport, fetchReports as userFetchReports,
	fetchReportByID as userFetchReportByID, fetchAllClassrooms as userFetchAllClassrooms,
	fetchClassroomByName as userFetchClassoormByName} from '../user_side/fetch_functions';

export const addReport = userAddReport;
export const fetchReports = userFetchReports;
export const fetchReportByID = userFetchReportByID;
export const fetchAllClassrooms = userFetchAllClassrooms;
export const fetchClassroomsByName = userFetchClassoormByName;


// axios.interceptors.response.use(response => {
// 	return response;
// 	}, error => {
// 		if (error.response.status === 401) {
// 			return Result.error<Error, User>(new Error("Not logged in!"));
//    		}
//    }
//    );

function fetchLogin(username : string, password : string) : Promise<Result<Error, User>>{
	return (async()=>{
		let resp = await axios.post(config.API_URL + "/login", {username : username, password: password});
		if(resp.status == 400){
			let info = resp.data.message;
			return Result.error<Error, User>(info);
		}
		else{
			let userInfo = resp.data.user;
			let user : User = new User(userInfo.username, userInfo.displayName);
			return Result.value<Error, User>(user);
		}
	})();
}

function fetchLogout(){
	return (async ()=>{
		let resp = await axios.post(config.API_URL + "/admin/logout");
		if(resp.status === 401){
			return Result.error<Error, void>(new Error("logout failed, unauth!"));
		}
		else{
			return Result.success<Error>();
		}
	})();
}

function fetchWhoami(){
	return (async()=>{
		try{
			let resp = await axios.get(config.API_URL + "/admin/whoami");
			let userInfo = resp.data.user;
			let user : User = new User(userInfo.username, userInfo.displayName);
			return Result.value<Error, User>(user);
		}catch(e){
			// console.log(e);
			return Result.error<Error, User>(e);
		}
		
		// if(resp.status == 401){
		// 	console.log(resp);
		// 	return Result.error<Error, User>(new Error("Not logged in!"));
		// }
		
			
		

	})()
}

function getUrlFromFile(file: File): Promise<string>
{
    const fileReader = new FileReader();
    const promise = new Promise<string>((resolve, reject) =>
    {

        fileReader.onload = (ev)=>
        {
            if(fileReader.result !== null && typeof(fileReader.result) === 'string')
            {
                resolve(fileReader.result);
            }
            else
            {
                reject(new Error('FileReader dose not have result after onLoad event or it is not string'));
            }

        };
    });

    fileReader.readAsText(file, 'base64');

    return promise;

}

export {fetchLogin, fetchLogout, fetchWhoami};
