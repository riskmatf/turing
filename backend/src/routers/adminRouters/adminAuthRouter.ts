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
                else{
                    failureCallback("BAD PASSWORD");
                }
            }
            else{
                failureCallback("BAD USERNAME");
            }
        })
}

authRouter.post("/login", (req, res)=>{
    if(req.session && req.session.username){
        res.status(400).send({message: "ALREADY LOGGED IN"});
        return;
    }
    checkLogin(req.body.username, req.body.password,
        (username, displayName)=>{
            if(!req.session){
                console.error("SESSION NOT INITIALIZED");
                res.status(500).send({});
                throw Error("SESSION NOT INITIALIZED");
            }
            // setting data in session to mark user as logged in
            req.session.username = username;
            req.session.displayName = displayName;
            res.send({message: "SUCCESS"});
        },
        (msg: string)=>{
            res.status(401).send({message: msg});
        });
});

authRouter.post("/logout", (req, res)=>{
    if(req.session && req.session.username) {
        req.session.destroy(() => {
            res.send({message:"SUCCESS"});
        });
    }else{
        res.send({message: "ERROR, not logged in, can't logout."});
    }
});
export default authRouter;
