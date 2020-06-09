import express from 'express';
import {getCustomRepository} from "typeorm";
import {ClassroomsRepository} from "../../db/Classrooms";
import {ComputersRepository} from "../../db/Computers";

const adminClassroomsRouter = express.Router();

adminClassroomsRouter.put("/:cname/computers/:cid",async (req, resp)=>{
    const classroomName = req.params.cname;
    const compId: number = +req.params.cid;
    if(isNaN(compId)){
        resp.status(400).send({message: "Dati id nije broj"});
        return;
    }
    const broken = req.body.broken;
    const repo = getCustomRepository(ComputersRepository);
    const res = await repo.setBrokenFlag(compId, classroomName, broken); // result can be true false or undef but ignoring true and false here
    if(res !== undefined){
        resp.send({message: "Uspeh!"});
    }
    else{
        resp.status(400).send({message:"Nije moguće naći dati računar!"});
    }
});

adminClassroomsRouter.delete("/:cName", (req, res)=>{
    const repo = getCustomRepository(ClassroomsRepository);
    repo.deleteClassroom(req.params.cName).then(deleteResult =>{
        if(deleteResult === undefined){
            res.status(404).send({message:"Nije pronađena učionica"});
        }
        else{
            res.send({message: "Uspešno brisanje učionice"});

        }
    }) .catch(err=>{
            console.log(err);
            res.status(500).send({message:"Neuspelo brisanje učionice"});
        })
});

export default adminClassroomsRouter;

