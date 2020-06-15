import express from 'express';
// import MemoryStore from 'memorystore';
// import {Admin} from "../../entities/Admin";
import {AdminRepository} from "../../db/Admins";
import {getCustomRepository} from "typeorm";
import accountManagementRouter from "./adminAccountManagementRouter";
import authRouter from "./adminAuthRouter";
import adminReportsRouter from "./adminReportsRoutes";
import adminClassroomsRouter from "./adminClassroomsRouter";

const adminRouter = express.Router();
declare global {
    namespace Express {
        interface Request {
            username: string
        }
    }
}
// router for login logout and session
adminRouter.use(authRouter);

// middleware for protecting routes
adminRouter.use( (req, res, next)=>{
    if(!req.session || !req.session.username){
        res.status(401).send({message: "Niste ulogovani!"});
        return;
    }
    else{
        req.username = req.session.username;
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
            res.status(400).send({message: `Nedostaje obavezni parametar: ${param}`});
            return;
        }
    }

    if(req.body.displayName.length > 20){
        res.status(400).send({message: "Predugačko ime!"});
        return;
    }
    if(req.body.username.length > 20){
        res.status(400).send({message: "Predugačko korisničko ime!"});
        return;
    }
    const adminRepo = getCustomRepository(AdminRepository);
    adminRepo.addUser(req.body.username, req.body.password, req.body.displayName)
        .then((user)=>{
            if(user)
                res.send({message: "Korisnik dodat"});
            else{
                res.status(400).send({message: "Korisnik već postoji"});
            }
            return;
        })
        .catch(err=>{
            console.error(JSON.stringify(err));
            if(err.errno && err.errno === 1062){
                res.status(400).send({message: "displayName već postoji"});
            }
            else{
                res.status(500).send({message: "Pravljenje naloga nije uspelo zbog nepoznate greške! Kontaktirajte administratora!"});
            }
        })
});
adminRouter.head('/displayName', (req, res)=>{
    if(req.query && req.query.displayName){
        const adminRepo = getCustomRepository(AdminRepository);
        adminRepo.findByDisplayName(req.query.displayName.toString())
            .then(user=>{
                if(user){
                    res.send();
                }
                else{
                    res.status(404).send();
                }
            })
            .catch(err=>{
                console.error(JSON.stringify(err));
                res.status(500).send({message: "Nepoznata greška na serveru. Obratite se administratoru"});
            })
    }
});

adminRouter.use("/reports", adminReportsRouter);
adminRouter.use("/classrooms", adminClassroomsRouter);

adminRouter.head('/username', (req, res)=>{
    if(req.query && req.query.username){
        const adminRepo = getCustomRepository(AdminRepository);
        adminRepo.findByUsername(req.query.username.toString())
            .then(user=>{
                if(user){
                    res.send();
                }
                else{
                    res.status(404).send();
                }
            })
            .catch(err=>{
                console.error(JSON.stringify(err));
                res.status(500).send({message: "Nepoznata greška na serveru. Obratite se administratoru"});
            })
    }
});
// middleware for protecting account management routes
// this has to go here because it uses req.params ant that cant go without a route
adminRouter.use('/:username', (req, res, next)=>{
    if(!req.body){
        res.status(400).send({message: "Fali telo(body) zahteva!"});
        return;
    }
    if(req.session){
        if(req.session.username !== req.params.username){
            console.error(`${req.session.username} logged but ${req.params.username} received`);
            res.status(401).send({message: "Ne možete izvršiti akciju za drugog korisnika!"});
            return;
        }
        next();
    }
    else{
        console.error(`SESSION IS NOT DEFINED FOR URL ${req.url}`);
        res.status(400).send({message:"Ulogujte se da bi odradili akciju!"});
    }
});

adminRouter.use('/:username', accountManagementRouter);



export default adminRouter;
