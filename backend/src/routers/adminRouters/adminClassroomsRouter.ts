import express from 'express';
import {getCustomRepository} from "typeorm";
import {ClassroomsRepository} from "../../db/Classrooms";

const adminClassroomsRouter = express.Router();

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
            res.status(500).send({message:"Neuspelo brisanje ucionice"});
        })
});

export default adminClassroomsRouter;

