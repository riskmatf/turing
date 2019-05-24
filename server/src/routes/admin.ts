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
//TODO clear this list sometimes
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
//TODO: nacin da proveri da li je ulogovan i da vrati ko je ulogovan


router.post("/signup", (req, res)=>{
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

router.use('/admin', passport.authenticate('jwt', {session : false}));


router.post('/admin/classrooms', (req, res)=>{
	let body = req.body;
	
	const requiredFields : string[] = ["name", "location", "numOfComputers", "schema"];
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

	addClassroom(body['name'], body.location, body.numOfComputers, body.schema,
				(msg = "All OK!", httpCode = 200)=>{
					res.status(httpCode).send(msg);
				});
});

router.delete("/admin/classrooms/:name", (req, res)=>{
	deleteClassroom(req.params.name, ()=>{
		res.send("classroom is no more!");
	});
})



router.put("/admin/reports/:id", (req, res)=>{
	let token : string = req.cookies['jwt'];
	let userInfo : string | {[key:string] : string} | null = jwt.decode(token);
	let body = req.body;
	let comment = body["adminComment"] != undefined ? body["adminComment"] : null;
	if(userInfo != null && typeof(userInfo) != "string" && userInfo["username"] != null){
		solveReport(req.params.id, userInfo["username"], comment,
			(msg = "All ok", code = 200)=>{
				res.status(code).send(msg);
		});
	}
})

router.delete("/admin/reports/:id",(req, res)=>{
	const repID = req.params.id;
	if(repID <= 0){
		res.status(400).send('INVALID ID!');
		return;
	}
	else{
		deleteReport(repID,()=>{
			res.send("report is no more");
		})
	}
})

router.put("/admin/reports/update/:id", (req, res)=>{
	let token : string = req.cookies['jwt'];
	let userInfo : string | {[key:string] : string} | null = jwt.decode(token);
	let body = req.body;
	let comment = body["adminComment"] != undefined ? body["adminComment"] : null;
	if(userInfo != null && typeof(userInfo) != "string" && userInfo["username"] != null){
		updateReport(req.params.id, userInfo["username"], comment,
			(msg = "All ok", code = 200)=>{
				res.status(code).send(msg);
		});
	}
})

//this is /admin/logout because validaton is required even for logout
//and user can logout only if it has a valid jwt token
router.post('/admin/logout', (req, res)=>{
	let token : string = req.cookies['jwt'];
	tokenBlacklist.push(token);
	let userInfo : string | {[key:string] : string} | null = jwt.decode(token);
	if(userInfo != null && typeof(userInfo) != "string"){
		loggedUsers.splice(loggedUsers.indexOf(userInfo["username"]), 1);
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