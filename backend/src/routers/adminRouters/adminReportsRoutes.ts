import express, {Request} from 'express';
import {getCustomRepository, In} from "typeorm";
import {IFilter, IReportForSending, PAGE_SIZE, ReportsRepository} from "../../db/Reports";
import qs from 'qs';

const adminReportsRouter = express.Router();

interface IAdminReport  extends IReportForSending
{
    canChangeComment? : boolean
}
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

async function getNextUrl(req: Request, params: IFilter){
    const repo = getCustomRepository(ReportsRepository);
    if( +req.query.page >= (await repo.getMaxNumberOfPages(params))){
        return undefined;
    }
    const baseUrl = req.baseUrl;
    const queryParams = req.query;
    queryParams.page = (+queryParams.page + 1).toString();
    return baseUrl + qs.stringify(queryParams);
}


function getPreviousUrl(req: Request) {
    if(+req.query.page <= 0){
        return undefined;
    }
    const baseUrl = req.baseUrl;
    const queryParams = req.query;
    queryParams.page = (+queryParams.page - 1).toString();
    return baseUrl + qs.stringify(queryParams);
}

function getFirstUrl(req: Request) {
    const baseUrl = req.baseUrl;
    const queryParams = req.query;
    queryParams.page = '0';
    return baseUrl + qs.stringify(queryParams);
}

async function getLastUrl(req: Request, params : IFilter) {
    const repo = getCustomRepository(ReportsRepository);
    const baseUrl = req.baseUrl;
    const queryParams = req.query;
    queryParams.page = (await repo.getMaxNumberOfPages(params)).toString();
    return baseUrl + qs.stringify(queryParams);
}

adminReportsRouter.get("/", (req, res)=>{
    const params : IFilter = getQueryParameters(req);
    const repo = getCustomRepository(ReportsRepository);
    repo.getReportsWithFilters(params, req.username).then(async (reports : IReportForSending[]) =>{
        const ret = {
            reports,
            links: {
                current: req.baseUrl + req.url,
                next: await getNextUrl(req, params),
                prev: getPreviousUrl(req),
                first: getFirstUrl(req),
                last: await getLastUrl(req, params)
            }
        };


        res.send(ret);
    })
});

export default adminReportsRouter;