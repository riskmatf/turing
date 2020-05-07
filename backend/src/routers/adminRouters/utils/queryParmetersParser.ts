import {Request} from "express";
import {IFilter, PAGE_SIZE} from "../../../db/Reports";
import {In, IsNull, Not} from "typeorm";

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
    if (page < 0) {
        return undefined;
    }
    const params: IFilter = {
        whereParams: {},
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE
    };
    if (query.classrooms) {
        params.whereParams.classroomName = In(query.classrooms as string[]);
    }
    if (query.locations) {
        params.locations = query.locations as string[];
    }
    if (query.comments) {
        try {
            const hasComments = parseBoolean(query.comments as string);
            if (hasComments) {
                params.whereParams.adminComment = Not(IsNull());
            } else {
                params.whereParams.adminComment = IsNull();
            }
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if (query.urgent) {
        try {
            params.whereParams.urgent = parseBoolean(query.urgent as string);
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    if (query.fixed) {
        try {
            params.whereParams.fixed = parseBoolean(query.fixed as string);
        } catch (err) {
            console.log("ERROR PARSING BOOLEAN");
            return undefined;
        }
    }
    return params;
}