import express from 'express';
import session from 'express-session';
// import MemoryStore from 'memorystore';
// import {Admin} from "../../entities/Admin";
import {AdminRepository} from "../db/Admins";
import {getCustomRepository} from "typeorm";
import {Md5} from "ts-md5";

const adminRouter = express.Router();

const sessionOptions: session.SessionOptions = {
    secret: "trla baba lan",
    cookie:{
        secure: false,
    },
    resave: false,
    saveUninitialized: false,
};
adminRouter.use(session(sessionOptions));

function checkLogin(username: string, password: string,
                    successCallback: (uname: string, displayName: string) => void,
                    failureCallback: (message: string)=>void) {
    const adminRepo = getCustomRepository(AdminRepository);
    console.log(`got user ${username} with pass ${password}`);
    adminRepo.findByUsername(username)
        .then(user=>{
            if(user){
                console.log(`pronasao ${user}`);
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

adminRouter.post("/login", (req, res)=>{
    console.log(req.body);
    checkLogin(req.body.username, req.body.password,
        (username, displayName)=>{
                if(!req.session){
                    console.error("SESSION NOT INITIALIZED");
                    res.status(500).send();
                    throw Error("SESSION NOT INITIALIZED");
                }
                req.session.username = username;
                req.session.displayName = displayName;
                res.send("SUCCESS");
    },
    (msg: string)=>{
        res.status(401).send({message: msg});
    });
});

adminRouter.post("/logout", (req, res)=>{
    if(req.session && req.session.username) {
        req.session.destroy(() => {
            res.send("SUCCESS");
        });
    }else{
        res.send("ERROR, not logged in, can't logout");
    }
});

// middleware for protecting routes
adminRouter.use( (req, res, next)=>{
    if(!req.session || !req.session.username){
        res.status(401).send("NOT LOGGED IN");
    }
    next();
});

// bellow are protected routes
adminRouter.get('/whoami', ((req, res) =>{
        if(req.session){
            res.send({
                username: req.session.username,
                displayName: req.session.displayName
            });
        }
    }
));


export default adminRouter;


