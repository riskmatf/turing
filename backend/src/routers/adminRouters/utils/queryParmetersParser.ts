import {Request} from "express";
import {IFilter, PAGE_SIZE} from "../../../db/Reports";

function parseBoolean(value: string): boolean {
    if (value === "true") {
        return true;
    } else if (value === "false") {
        return false;
    } else {
        throw new Error("BAD BOOLEAN PARAMETER");
    }
}

export function getQueryParameters(req: Request) {
    const query = req.query;
    const page = req.query.page ? +req.query.page : 0;
    const whereStrings : string[] = [];
    if (page < 0) {
        return undefined;
    }
    const params: IFilter = {
        whereParams: {},
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE,
        whereString: " "
    };
    if (query.classrooms) {
        params.whereParams.classrooms = query.classrooms as string[];
        whereStrings.push(" reports.classroomName in (:classrooms) ");
    }
    if (query.locations) {
        params.whereParams.locations = query.locations as string[];
        whereStrings.push(" classrooms.location in (:locations) ");
    }
    if (query.comments) {
        let tmp = " reports.adminComment is ";
        try {
            const hasComments = parseBoolean(query.comments as string);
            if (hasComments) {
                tmp += " not ";
            }
            tmp += " null ";
            whereStrings.push(tmp);
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if (query.urgent) {
        try {
            params.whereParams.urgent = parseBoolean(query.urgent as string);
            whereStrings.push("reports.urgent = :urgent");
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if (query.fixed) {
        try {
            params.whereParams.fixed = parseBoolean(query.fixed as string);
            whereStrings.push(" reports.fixed = :fixed ");
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if(query.computerId){
        const cId : number =  +(query.computerId as string);
        if(isNaN(cId)){
            return undefined;
        }
        params.whereParams.computerId = cId;
        whereStrings.push(" reports.computerId = :computerId");
    }
    if(query.isGeneral){
        try{
            params.whereParams.isGeneral = parseBoolean(query.isGeneral as string);
            whereStrings.push(" reports.isGeneral = :isGeneral ");
        }catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if(whereStrings.length > 0){
        params.whereString += whereStrings.join(" AND ");
    }
    else{
        // no params given, set this so we get all results because typeorm will not ignore empty string in where function
        // and that will cause sql syntax error
        params.whereString = " 1 = 1 ";
    }
    return params;
}