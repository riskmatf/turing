import express, {Request} from 'express';
import {getCustomRepository, In, IsNull, Not} from "typeorm";
import {IFilter, IReportForSending, PAGE_SIZE, ReportsRepository} from "../../db/Reports";
import qs from 'qs';

const adminReportsRouter = express.Router();
function parseBoolean(value: string) : boolean{
    if(value === "true"){
        return true;
    }
    else if(value === "false"){
        return false;
    }
    else{
        throw new Error("BAD BOOLEAN PARAMETER");
    }
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
        params.whereParams.classroomName = In(query.classrooms as string[]);
    }
    if(query.locations){
        params.locations = query.locations as string[];
    }
    if(query.comments){
        try{
            const hasComments = parseBoolean(query.comments as string);
            if(hasComments){
                params.whereParams.adminComment = Not(IsNull());
            }
            else{
                params.whereParams.adminComment = IsNull();
            }
        }
        catch(err){
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if(query.urgent){
        try{
            params.whereParams.urgent = parseBoolean(query.urgent as string);
        }
        catch(err){
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if(query.fixed){
        try{
            params.whereParams.fixed = parseBoolean(query.fixed as string);
        }
        catch(err){
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    return params;
}

function createUrl(req: Request, queryParams: any){
    const host = req.headers.host;
    let baseUrl = req.baseUrl;
    if(!baseUrl.endsWith("?")){
        baseUrl += "?";
    }
    const query = qs.stringify(queryParams);
    return host + baseUrl + query;
}

function getNextUrl(req: Request, maxNumOfPages: number){
    let page : number = 0;
    if(req.query.page !== undefined){
        page = +req.query.page;
    }
    if( page >= maxNumOfPages ){
        return undefined;
    }
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (page + 1).toString();
    return createUrl(req, queryParams);
}


function getPreviousUrl(req: Request) {
    let page : number = 0;
    if(req.query.page !== undefined){
        page = +req.query.page;
    }
    if(page <= 0){
        // no previous page
        return undefined;
    }
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (page - 1).toString() ;
    return createUrl(req, queryParams);
}

function getFirstUrl(req: Request) {
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = '0';
    return createUrl(req, queryParams);
}

function getLastUrl(req: Request, maxNumOfPages : number) {
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (maxNumOfPages).toString();
    return createUrl(req, queryParams);
}

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