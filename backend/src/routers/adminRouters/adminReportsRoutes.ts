import express, {Request} from 'express';
import {getCustomRepository, In} from "typeorm";
import {IFilter, PAGE_SIZE, ReportsRepository} from "../../db/Reports";
const adminReportsRouter = express.Router();

function getQueryParameters(req: Request){
    const query = req.query;
    const page = req.query.page ? +req.query.page : 0;
    const params :IFilter = {
        whereParams: {},
        take: PAGE_SIZE,
        skip: page*PAGE_SIZE
    };
    if(query.classrooms){
        params.whereParams.classrooms = In(query.classrooms as string[]);
    }
    if(query.locations){
        params.whereParams.locations = In(query.locations as string[]);
    }
    if(query.broken){
        params.whereParams.broken = JSON.parse(query.broken as string);
    }
    if(query.comments){
        params.whereParams.comments = JSON.parse(query.comments as string);
    }
    if(query.urgent){
        params.whereParams.urgent = JSON.parse(query.urgent as string);
    }
    if(query.fixed){
        params.whereParams.fixed = JSON.parse(query.fixed as string);
    }
    return params;
}

adminReportsRouter.get("/", (req, res)=>{
    const params : IFilter = getQueryParameters(req);
    const repo = getCustomRepository(ReportsRepository);
    repo.getReportsWithFilters(params).then(reports=>{
        res.send(reports);
    })
});

export default adminReportsRouter;