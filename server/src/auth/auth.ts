import {PassportStatic as Passport} from 'passport';
import {Strategy as localStrategy} from 'passport-local';
import { dbCon } from '../db/dbConnection';
import {Strategy as jwtStrategy, VerifiedCallback} from 'passport-jwt';
import { canYouPlayBass } from '../routes/admin';
import { Request } from 'express';
import authConf from './authConfig';
import {Md5} from 'ts-md5';

function initPassport(passport : Passport){
	passport.serializeUser<any, any>((user : {username : string} & any, done)=>{
		done(undefined, user.username);
	});
	passport.deserializeUser<any, any>((username : string, done)=>{
		dbCon.query("select * from admins where username = ?", [username], (err, res, _fields)=>{
			if(err){
				console.log(err.message);
				throw err;
			}
			done(err, res[0]);
		});
	});
	passport.use('local-signup', new localStrategy(
		{
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		(req, username, password, done)=>{
			dbCon.query("select * from admins where username = ?", [username], (err, res : any[], _fields)=>{
				if(err){
					console.log(err.message);
					return done(err);
				}
				if(res.length > 0){
					//allready exists
					return done(undefined, false, {message : "user allready exists"});
				}
				if(req.body["displayName"] == undefined){
					return done(undefined, false, {message : "no displayName provided"});	
				}
				else{
					//create new
					dbCon.query("insert into admins (username, password, displayName) values(?,?,?)",
								[username, Md5.hashStr(password) , req.body["displayName"]], 
								(err, _res, _fields)=>{
									if(err){
										console.log(err.message);
										done(err);
									}
									return done(undefined, {message: "signup successfull"});
								});
				}
			})
		}
	)
	);

	passport.use('local-login', new localStrategy(
		{
			usernameField : 'username',
			passwordField : 'password'
		},
		(username, password, done)=>{
			dbCon.query("select * from admins where username = ?",
						[username],
						(err, res : any[], _fields)=>{
							if(err){
								console.log(err.message);
								done(err);
							}
							if(res.length == 0){
								return done(undefined, false, {message : "no such username"});
							}
							else{
								if(res[0].password == Md5.hashStr(password)){
									return done(
										undefined,
										{
											username : res[0].username, 
											displayName : res[0].displayName
										});
								}
								else{
									//console.log("Bad password");
									return done(undefined, false, {message : "auth failed"});
								};
							}
						})
			}
		)
	)
}

function cookieExtractor(req : Request){
	let token : string  = "";
	if(req && req.cookies) token = req.cookies['jwt'];
	return token;
}

function initJWTPassport(passport : Passport){
	passport.use('jwt',new jwtStrategy(
		{
			jwtFromRequest : cookieExtractor,
			secretOrKey: authConf.jwtSecret,
			passReqToCallback: true,

	}, (req : Request, payload : Object, done : VerifiedCallback)=>{
			if(req && req.cookies){
				let token = cookieExtractor(req);//extracting cookie 2nd time, can it be fixed?
				if(canYouPlayBass(token)){//you can play bass => you are black
					return done(null, false, null);//null as info bcs user does not need to know why is he 401(unauth)
				}
			}
			return done(null, payload);
		})
	);
}

export {initPassport, initJWTPassport};