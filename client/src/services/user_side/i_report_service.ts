import {Report, ReportType} from "../../models/user_side/report";
import {EventSubscription} from "fbemitter";
import {ServiceLocator} from "./serviceLocator";
import {useCallback, useEffect, useState} from "react";
import {Result} from "../../utils/result";

/*export type ReportCollection =
    {
        [classroomName: string]: Array<Report>;
    }
*/

/*Deprecated*/
export type ReportCollection = Map<string, Array<Report>>;

export type ReportData =
    {
        classroomName: string;
        idComputer?: number;
        description: string;
        date: number;
        type: ReportType;
        urgent: boolean;
    }


export interface IReportService
{


    // TODO implement later
    // fetchReportPage(pageNumber: number, force?: boolean): Promise<Result<Error, void>>;
    // getReportPage(pageNumber: number): Result<Error, Array<Report> | undefined>;
    // hasNextPage(currentPage: number): Result<Error, boolean>;

    // TODO implement later
    // fetchReportPages(pages: Array<number>, force?: boolean): Promise<Result<Error, void>>;
    // getReportPages(pages: Array<number>): Result<Error, Array<Result<Error, Array<Report> | undefined>>>;



    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<Result<Error, void>>;
    getReportsForClassroom(classroomName: string): Result<Error, Array<Report>>;


    fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>;
    getReport(id: number): Result<Error, Report | undefined>;

    fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>;
    getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>

    addReport(data: ReportData): Promise<Result<Error, Report>>;
    onReportChange(handler: ()=>void): EventSubscription;
}

// export function useReportsPage(initPage: number, forceRender: ()=>void):
//     {
//         reports: Result<Error, Array<Report> | undefined>
//         nextPage: ()=>Result<Error, void>;
//         prevPage: ()=>Result<Error, void>;
//         hasNextPage: ()=>void;
//         page: number;
//         fetchPage: (force?: boolean)=>Promise<Result<Error, void>>;
//     }
// {
//     const [page, setPage] = useState<number>(initPage);
//     const service = ServiceLocator.getReportService();

    // const nextPage = useCallback(()=>
    // {
    //     if(service.hasNextPage(page))
    //     {
    //         setPage(prevState => prevState+1);
    //         return Result.success<Error>();
    //     }
    //     else
    //     {
    //         return Result.error<Error, void>(new Error('There is no next page'));
    //     }
    // }, [page, setPage, service]);

    // const prevPage = useCallback(()=>
    // {
    //     if(page !== 0)
    //     {
    //         setPage(prevState => prevState-1);
    //         return Result.success<Error>();
    //     }
    //     else
    //     {
    //         return Result.error<Error, void>(new Error('There is no previous page'));
    //     }
    // }, [page, setPage, service]);


    // const hasNextPage = useCallback(()=>
    // {
    //     return service.hasNextPage(page);
    // }, [page, service]);

    // const fetchPage = useCallback((force?: boolean)=>
    // {
    //     return service.fetchReportPage(page, force);
    // }, [page, service]);

    // useEffect(()=>
    // {
    //     const sub = service.onReportChange(forceRender);
    //     return ()=>
    //     {
    //         sub.remove();
    //     }
    // }, [service, forceRender]);


//     return (
//         {
//             reports: service.getReportPage(page),
//             hasNextPage: hasNextPage,
//             nextPage: nextPage,
//             prevPage: prevPage,
//             page: page,
//             fetchPage: fetchPage
//         }
//     );
// }

export function useReportsForClassroom(classroomName: string, forceRender: ()=>void):
    {
        reports: Result<Error, Array<Report>>;
        fetchReportsForClassroom: (force?: boolean)=>Promise<Result<Error, void>>;
    }
{
    const service = ServiceLocator.getReportService();

    useEffect(()=>
    {
        const sub = service.onReportChange(forceRender);
        return ()=>
        {
            sub.remove();
        }
    }, [service, forceRender]);

    const fetchReports = useCallback((force?: boolean)=>
    {
        return service.fetchReportsForClassroom(classroomName, force);
    }, [service]);


    return (
        {
            reports: service.getReportsForClassroom(classroomName),
            fetchReportsForClassroom: fetchReports
        }
    );
}

export function useReport(id: number, forceRender: ()=>void):
    {
        report: Result<Error, Report| undefined>;
        fetchReport: (force?: boolean)=>Promise<Result<Error, void>>;
    }
{
    const service = ServiceLocator.getReportService();

    useEffect(()=>
    {
        const sub = service.onReportChange(forceRender);
        return ()=>
        {
            sub.remove();
        }
    }, [service, forceRender]);

    const fetchReport = useCallback((force?: boolean)=>
    {
        return service.fetchReport(id, force);
    }, [service, id]);

    return (
        {
            report: service.getReport(id),
            fetchReport: fetchReport
        });
}


/**
 *  useReportsPages
 *  think about jumping more pages
 */
