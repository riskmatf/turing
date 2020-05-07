import {Request} from "express";
import qs from "qs";

function createUrl(req: Request, queryParams: any) {
    const host = req.headers.host;
    let baseUrl = req.baseUrl;
    if (!baseUrl.endsWith("?")) {
        baseUrl += "?";
    }
    const query = qs.stringify(queryParams);
    return host + baseUrl + query;
}

export function getNextUrl(req: Request, maxNumOfPages: number) {
    let page: number = 0;
    if (req.query.page !== undefined) {
        page = +req.query.page;
    }
    if (page >= maxNumOfPages) {
        return undefined;
    }
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (page + 1).toString();
    return createUrl(req, queryParams);
}

export function getPreviousUrl(req: Request) {
    let page: number = 0;
    if (req.query.page !== undefined) {
        page = +req.query.page;
    }
    if (page <= 0) {
        // no previous page
        return undefined;
    }
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (page - 1).toString();
    return createUrl(req, queryParams);
}

export function getFirstUrl(req: Request) {
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = '0';
    return createUrl(req, queryParams);
}

export function getLastUrl(req: Request, maxNumOfPages: number) {
    const queryParams = JSON.parse(JSON.stringify(req.query));
    queryParams.page = (maxNumOfPages).toString();
    return createUrl(req, queryParams);
}