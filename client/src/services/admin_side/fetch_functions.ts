import axios from 'axios';
import config from "../../config";
import { User } from '../../models/admin_side/user';
import { Result } from '../../utils/result';


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
			//console.log(e);
			return Result.error<Error, User>(e);
		}
		
		// if(resp.status == 401){
		// 	console.log(resp);
		// 	return Result.error<Error, User>(new Error("Not logged in!"));
		// }
		
			
		

	})()
}

export {fetchLogin, fetchLogout, fetchWhoami};