import {Router} from 'express';
import passport from 'passport';
import { initPassport, initJWTPassport } from '../auth/auth';
import jwt from 'jsonwebtoken';
import { json } from 'body-parser';
import { user } from '../types/types';
import CookieParser from 'cookie-parser';
import authConf from '../auth/authConfig';
import { solveReport, updateReport, deleteReport } from '../db/functions/reportsDB';
import { addClassroom, deleteClassroom } from '../db/functions/classroomsDB';

initPassport(passport);
initJWTPassport(passport);

const router = Router();

let loggedUsers : string[] = [];
let tokenBlacklist : string[] = []; //used for tokens that are logged out

//reference:
//https://youtu.be/VvUsFQbWZFs?t=26
function canYouPlayBass(token : string) : boolean{//checks if token is in black list
	return !(tokenBlacklist.indexOf(token) == -1);
}


router.use(CookieParser());
router.use(json());
router.use(passport.initialize());
router.use(passport.session());

router.post('/login', (req, res)=>{
	passport.authenticate('local-login',{session: false},(err, user : user, info)=>{
		if(err){
			console.log(err.message);
			return;
		}
		req.login(user, {session: false},(err)=>{
			if(err){
				res.send(err);
			}
			if(!user){
				return res.status(400).send(info);
			}

			if(loggedUsers.indexOf(user.username) == -1){//user not logged in
				let token = jwt.sign(
					{
						username: user.username,
						displayName : user.displayName
					},
					authConf.jwtSecret,
					{
						expiresIn: authConf.jwtExpire["jwt"]
					}
				);
				loggedUsers.push(user.username);

				res.cookie('jwt', token,
								{
									maxAge : authConf.jwtExpire["cookie"],
									httpOnly : true
									//,secure:true //TODO: uncomment this when migrating to https
								});
				return res.send({user: user, token: token});
			}
			else{//user allready logged in
				res.status(400).send({message: "Allready logged in"});
			}
		})
	})(req, res);

})



router.use('/admin', passport.authenticate('jwt', {session : false}));


router.post("/admin/signup", (req, res)=>{
	passport.authenticate('local-signup',(err, user, info)=>{
		if(err){
			console.log(err.message);
			return;
		}
		if(!user){
			return res.status(400).send(info);
		}
		res.send("WELCOME!");
	})(req, res);
	
})

router.get("/admin/whoami", (req, res)=>{
	let token : string | null = null;
	if(req.cookies["jwt"] != undefined){
		token = req.cookies["jwt"];
		if(typeof(token) === "string" && canYouPlayBass(token)){
			res.status(401).send("token is on blacklist");
			return;
		}
		let userInfo : string | {[key:string] : any} | null = null;
		if(token != null){
			userInfo = jwt.decode(token);
		}
		if(userInfo !== null && typeof(userInfo) !== "string"){
			res.send({
				username : userInfo["username"],
				displayName : userInfo["displayName"]
				});
		}
	}
	else{
		res.status(401).send("this should never happen!");
	}
})
router.post('/admin/classrooms', (req, res)=>{
	let body = req.body;
	const requiredFields : string[] = ["name", "location", "numOfComputers", "schema"];
	for(let field of requiredFields){
		if(body[field] == null){
			res.status(400).send({message:`${field} is not provided or is null!`});
			return;
		}
	}
	if(body.numOfComputers < 0){
		res.status(400).send({message:"number of computers must be >= 0"});
		return;
	}

	addClassroom(body['name'], body.location, body.numOfComputers, body.schema,
				(msg = "All OK!", httpCode = 200)=>{
					res.status(httpCode).send({message : msg});
				});
});

router.delete("/admin/classrooms/:name", (req, res)=>{
	deleteClassroom(req.params.name, ()=>{
		res.send("classroom is no more!");
	});
})


router.delete("/admin/reports/:id",(req, res)=>{
	const repID = req.params.id;
	if(repID <= 0){
		res.status(400).send({message:'INVALID ID!'});
		return;
	}
	else{
		deleteReport(repID,()=>{
			res.send({message:"report is no more"});
		})
	}
})

router.put("/admin/reports/:id", (req, res)=>{
	let token : string = req.cookies['jwt'];
	let userInfo : string | {[key:string] : string} | null = jwt.decode(token);
	let body = req.body;
	let comment = body["adminComment"] != undefined ? body["adminComment"] : null;

	if(userInfo != null && typeof(userInfo) != "string" && userInfo["username"] != null){
		if(body["update"] != null && body["update"] == true){
			updateReport(req.params.id, userInfo["username"], comment,
			(msg = "All ok", code = 200)=>{
				res.status(code).send(msg);
			});
		}
		else if(body["solve"] != null && body["solve"] == true){
			solveReport(req.params.id, userInfo["username"], comment,
			(msg = "All ok", code = 200)=>{
				res.status(code).send(msg);
			});
		}
		else{
			res.status(400).send({message : "INVALID REQUEST, solve/update has to be specified"})
		}
	}
	
})

//this is /admin/logout because validaton is required even for logout
//and user can logout only if it has a valid jwt token
router.post('/admin/logout', (req, res)=>{
	let token : string = req.cookies['jwt'];
	let userInfo : string | {[key:string] : any} | null = jwt.decode(token);
	/**this should be
	 * let userInfo : string | {[key:string] : string | number} | null = jwt.decode(token);
	 * but ts is....... ts*/
	
	if(userInfo != null && typeof(userInfo) != "string"){
		loggedUsers.splice(loggedUsers.indexOf(userInfo["username"]), 1);
		var d = new Date();
		var seconds = Math.round(d.getTime() / 1000);
		if(seconds < userInfo.exp){
			tokenBlacklist.push(token);
			setTimeout(()=>{
					let tmp = tokenBlacklist.indexOf(token)
					if(tmp != -1){
						tokenBlacklist.splice(tmp,1);
						// console.log("izbrisano!");
						// console.log(tokenBlacklist);
					}
				},(userInfo.exp - seconds)*1000);//deleting element from array when its time is due
		}
	}
	req.logout();
	res.clearCookie("jwt");
	res.send("You are out");
})

router.get('/admin/test',(req,res)=>{
	res.send("hello");
})

export default router;
export {canYouPlayBass};