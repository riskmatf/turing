import express from 'express';
import {getCustomRepository} from "typeorm";
import {IFilter, IReportForSending, ReportsRepository} from "../../db/Reports";
import {getFirstUrl, getLastUrl, getNextUrl, getPreviousUrl} from "./utils/urlCreatorFuncs";
import {getQueryParameters} from "./utils/queryParmetersParser";

const adminReportsRouter = express.Router();

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
        repo.getReportsWithFilters(params, req.username).then((reports : IReportForSending[]) =>{
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