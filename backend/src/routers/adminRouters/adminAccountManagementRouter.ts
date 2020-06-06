import express from 'express';
import {getCustomRepository} from "typeorm";
import {AdminRepository} from "../../db/Admins";
// import adminRouter from "./adminRouter";

const accountManagementRouter = express.Router();

accountManagementRouter.put("/password", (req, res)=>{
    const adminRepo = getCustomRepository(AdminRepository);
    if(!req.body.password){
        res.status(400).send({message:"BAD REQUEST! MISSING PASSWORD"});
        return;
    }
    adminRepo.changePassword(req.username, req.body.password)
        .then(user=>{
            if(user){
                res.send({message: "SUCCESS"});
            }
            else{
                console.error(`ERROR TRYING TO CHANGE PASSWORD FOR USER ${req.username}.
                                SESSION DATA: ${JSON.stringify(req.session)}`);
                res.status(400).send({message:"UNKNOWN ERROR! CONTACT ADMINISTRATOR"});
            }
        })
        .catch(err=>{
            console.error(err);
            res.status(400).send({message:"UNKNOWN ERROR! CONTACT ADMINISTRATOR"});
        });
});


accountManagementRouter.put('/displayName', (req, res)=>{
    if(!req.body.displayName){
        res.status(400).send({message:"BAD REQUEST! MISSING DISPLAY NAME!"});
        return;
    }
    const adminRepo = getCustomRepository(AdminRepository);
    adminRepo.changeDisplayName(req.username, req.body.displayName)
        .then(user=>{
            if(user){
                res.send({message: "SUCCESS"});
            }
            else{
                console.error(`ERROR TRYING TO CHANGE DISPLAY NAME FOR USER ${req.username}.
                                SESSION DATA: ${JSON.stringify(req.session)}`);
                res.status(400).send({message:"UNKNOWN ERROR! CONTACT ADMINISTRATOR"});
            }
        })
        .catch(err=>{
            console.error(err);
            res.status(400).send({message:"UNKNOWN ERROR! CONTACT ADMINISTRATOR"});
        });
});

export default accountManagementRouter;
