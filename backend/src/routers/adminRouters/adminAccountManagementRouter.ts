import express from 'express';
import {getCustomRepository} from "typeorm";
import {AdminRepository} from "../../db/Admins";
// import adminRouter from "./adminRouter";

const accountManagementRouter = express.Router();

accountManagementRouter.put("/password", (req, res)=>{
    const adminRepo = getCustomRepository(AdminRepository);
    if(!req.body.password){
        res.status(400).send({message:"LOŠ ZAHTEV! NEDOSTAJE ŠIFRA!"});
        return;
    }
    if(!req.body.currentPassword){
        res.status(400).send({message:"LOŠ ZAHTEV! NEDOSTAJE TRENUTNA ŠIFRA!"});
        return;
    }
    adminRepo.changePassword(req.username, req.body.password, req.body.currentPassword)
        .then(user=>{
            if(user){
                res.send({message: "USPEŠNA AKCIJA!"});
            }
            else{
                console.error(`ERROR TRYING TO CHANGE PASSWORD FOR USER ${req.username}.
                                SESSION DATA: ${JSON.stringify(req.session)}`);
                res.status(400).send({message:"Nepoznata greška! Kontaktirajte administratora!"});
            }
        })
        .catch(err=>{
            // todo aj malo bolje ovo keve ti
            if(err.message.indexOf("trenutna") > -1){
                res.status(401).send({message: err.message});
            }
            else{
                console.error(err);
                res.status(400).send({message:"Nepoznata greška! Kontaktirajte administratora!"});
            }
        });
});


accountManagementRouter.put('/displayName', (req, res)=>{
    if(!req.body.displayName){
        res.status(400).send({message:"Loš zahtev! Fali displayName!"});
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
                res.status(400).send({message:"Nepoznata greška! Kontaktirajte administratora!"});
            }
        })
        .catch(err=>{
            console.error(err);
            res.status(400).send({message:"Nepoznata greška! Kontaktirajte administratora!"});
        });
});

export default accountManagementRouter;
