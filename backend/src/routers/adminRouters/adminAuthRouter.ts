import express from 'express';
import {getCustomRepository} from "typeorm";
import {AdminRepository} from "../../db/Admins";
import session from "express-session";
import {Md5} from "ts-md5";
import authConf from "../../auth/authConfig";

const authRouter = express.Router();

const sessionOptions: session.SessionOptions = {
    secret: authConf.secret,
    cookie:{
        secure: false,
    },
    resave: false,
    saveUninitialized: false,
};

authRouter.use(session(sessionOptions));

function checkLogin(username: string, password: string, successCallback: (username: string, displayName: string) => void,
                    failureCallback: (message: string)=>void)
{
    const adminRepo = getCustomRepository(AdminRepository);
    adminRepo.findByUsername(username)
        .then(user=>{
            if(user){
                if(user.password === Md5.hashStr(password).toString()){
                    successCallback(user.username, user.displayName);
                }
                // bad pass
                else{
                    failureCallback("Loše korisničko ime i/ili šifra!");
                }
            }
            // bad username
            else{
                failureCallback("Loše korisničko ime i/ili šifra!");
            }
        })
}

authRouter.post("/login", (req, resp)=>{
    if(req.session && req.session.username){
        resp.status(400).send({message: "ALREADY LOGGED IN"});
        return;
    }
    checkLogin(req.body.username, req.body.password,
        (username, displayName)=>{
            if(!req.session){
                console.error("SESSION NOT INITIALIZED");
                resp.status(500).send({});
                throw Error("SESSION NOT INITIALIZED");
            }
            // setting data in session to mark user as logged in
            req.session.username = username;
            req.session.displayName = displayName;
            resp.send({message: "SUCCESS"});
        },
        (msg: string)=>{
            resp.status(401).send({message: msg});
        });
});

authRouter.post("/logout", (req, resp)=>{
    if(req.session && req.session.username) {
        req.session.destroy(() => {
            resp.send({message:"Uspeh!"});
        });
    }
    // not logged in, can't logout but no need for different message
    else{
        resp.send({message: "Uspeh!"});
    }
});
export default authRouter;
