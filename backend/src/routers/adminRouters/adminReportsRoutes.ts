import express from 'express';
import {getCustomRepository} from "typeorm";
import {IFilter, ReportsRepository} from "../../db/Reports";
import {getFirstUrl, getLastUrl, getNextUrl, getPreviousUrl} from "./utils/urlCreatorFuncs";
import {getQueryParameters} from "./utils/queryParmetersParser";
import {IAdminReportOverview} from "../../db/Computers";

const adminReportsRouter = express.Router();

adminReportsRouter.get("/:id", (req, resp)=>{
    const repId = +req.params.id;
    if(isNaN(repId)){
        resp.status(400).send({message: "Los id!"});
        return;
    }
    const repo = getCustomRepository(ReportsRepository);
    repo.getReportById(repId, req.username).then(report=>{
        if(report === undefined){
            resp.status(400).send({message: "Nije moguce naći traženi izveštaj!"});
            return;
        }
        resp.send(report);
    })
});

adminReportsRouter.get("/", async (req, res)=>{
        const params : IFilter | undefined = getQueryParameters(req);
        if(params === undefined){
            res.status(400).send({message: "LOŠI PARAMETRI!"});
            return;
        }
        const repo = getCustomRepository(ReportsRepository);
        const maxNumOfPages = await repo.getMaxNumberOfPages(params);
        const nextUrl = getNextUrl(req, maxNumOfPages);
        const prevUrl = getPreviousUrl(req);
        const firstUrl = getFirstUrl(req);
        const lastUrl = getLastUrl(req, maxNumOfPages);
        repo.getReportsWithFilters(params).then((reports : IAdminReportOverview[]) =>{
            const ret = {
                reports,
                paging: {
                    nextUrl,
                    prevUrl,
                    firstUrl,
                    lastUrl,
                    maxNumOfPages
                }
            };

            res.send(ret);
        })
});

export default adminReportsRouter;