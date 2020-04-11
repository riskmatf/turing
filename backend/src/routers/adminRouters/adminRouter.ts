import express from 'express';
// import MemoryStore from 'memorystore';
// import {Admin} from "../../entities/Admin";
import {AdminRepository} from "../../db/Admins";
import {getCustomRepository} from "typeorm";
import accountManagementRouter from "./adminAccountManagementRouter";
import authRouter from "./adminAuthRouter";

const adminRouter = express.Router();

// router for login logout and session
adminRouter.use(authRouter);

// middleware for protecting routes
adminRouter.use( (req, res, next)=>{
    if(!req.session || !req.session.username){
        res.status(401).send("NOT LOGGED IN");
        return;
    }
    else{
        next();
    }
});

// ###################################### bellow are protected routes ########################################

adminRouter.get('/whoami', ((req, res) =>{
        if(req.session){
            res.send({
                username: req.session.username,
                displayName: req.session.displayName
            });
        }
    }
));

adminRouter.post('/signup', (req, res)=>{
    const requiredParams = ["username", "displayName", "password"];
    for(const param of requiredParams){
        if(!req.body[param]){
            res.status(400).send({message: `MISSING REQUIRED PARAM: ${param}`});
            return;
        }
    }
    const adminRepo = getCustomRepository(AdminRepository);
    adminRepo.addUser(req.body.username, req.body.password, req.body.displayName)
        .then((user)=>{
            if(user)
                res.send("USER ADDED");
            else{
                res.status(400).send({message: "USER EXISTS"});
            }
            return;
        })
        .catch(err=>{
            console.error(JSON.stringify(err));
            if(err.errno && err.errno === 1062){
                res.status(400).send("Display name already exists");
            }
            else{
                res.status(500).send("SIGNUP FAILED. CONTACT ADMIN.");
            }
        })
});
// middleware for protecting account management routes
// this has to go here because it uses req.params ant that cant go without a route
adminRouter.use('/:username', (req, res, next)=>{
    if(!req.body){
        res.status(400).send({message: "MISSING REQ BODY!"});
        return;
    }
    if(req.session){
        if(req.session.username !== req.params.username){
            console.error(`${req.session.username} logged but ${req.params.username} received`);
            res.status(401).send({message: "CANT PERFORM ACTION FOR DIFFERENT USER"});
            return;
        }
        next();
    }
    else{
        console.error(`SESSION IS NOT DEFINED FOR URL ${req.url}`);
        res.status(400).send({message:"Session is not defined! Log in to perform action!"});
    }
});

adminRouter.use('/:username', accountManagementRouter);


export default adminRouter;


