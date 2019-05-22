import {Router} from 'express';
import passport from 'passport';
import { initPassport, initJWTPassport } from '../auth/auth';
import jwt from 'jsonwebtoken';
import { json } from 'body-parser';
import { user } from '../types/types';
import CookieParser from 'cookie-parser';
import authConf from '../auth/authConfig';

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