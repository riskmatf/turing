import {Report, ReportType} from "../../models/admin_side/report";
import {EventSubscription} from "fbemitter";
import {SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {ServiceLocator} from "./service_locator";
import {Result} from "../../utils/result";
import {bool} from "prop-types";

export type ReportCollection = Map<string, Array<Report>>;

export type ReportData =
    {
        classroomName: string;
        idComputer?: number;
        description: string;
        date: number;
        type: ReportType;
        urgent: boolean;
    };

export type ChangeReportData =
    {
        fixed: boolean;
        adminComment?: string;
    };

export interface ReportUpdateBuilder
{
    executeUpdate(): Promise<void>;
    removeComment(): ReportUpdateBuilder;
    addAdminComment(comment: SetStateAction<string>): ReportUpdateBuilder;
    setFix(value: SetStateAction<boolean>): ReportUpdateBuilder;
}

export type FilterCriteria =
    {
        fixed: 'fixed' | 'notFixed' | 'all';
        classrooms: Array<string>;
        comments: 'has' | 'dontHave' | 'all';
    };

export interface ReportFilter
{
    getPage(page: number): Result<Error, Array<Report> | undefined>;
    fetchPage(page:number, force?: boolean): Promise<Result<Error, void>>;
    // getPages(pages: Array<number>): Result<Error, Array<Result<Error, Array<Report> | undefined>>>;
    // fetchPages(pages: Array<number>): Promise<Result<Error, void>>;
    hasNextPage(page: number): Result<Error, boolean>;
}

export interface IReportService
{
    // getReport(id: number): Report | undefined;
    // fetchReport(id: number, force?: boolean): Promise<void>;
    // getReports(): ReportCollection;
    // fetchReports(force?: boolean): Promise<void>
    // getReportsForClassroom(classroom: string): Array<Report>;
    // fetchReportsForClassroom(classroom: string, force?: boolean): Promise<void>;

    // TODO: implement
    // getReportsPage(page: number): Result<Error, Array<Report> | undefined>;
    // fetchReportsPage(page: number, force?: boolean): Promise<Result<Error, void>>;

    // TODO: implement
    // getReportsPages(pages: Array<number>): Result<Error, Array<Result<Error, Array<Report> | undefined>>>;
    // fetchReportsPages(pages: Array<number>, force?: boolean): Promise<Result<Error, void>>;

    getReport(id: number): Result<Error, Report | undefined>;
    fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>;

    getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>;
    fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>;

    getReportsForClassroom(classroom: string): Result<Error, Array<Report> | undefined>;
    fetchReportsForClassroom(classroom: string, force?: boolean): Promise<Result<Error, void>>;

    filterReports(criteria: FilterCriteria): ReportFilter;

    addReport(data: ReportData): Promise<Result<Error, Report>>;
    removeReport(id: number): Promise<Result<Error, void>>;
    updateReport(id: number): Result<Error, ReportUpdateBuilder>;
    onReportsChanged(handler: ()=>void): EventSubscription;
}

// export function useReportsPage(page: number, forceRender: ()=>void):
//     {
//         reports: Result<Error, Array<Report>>;
//         hasNextPage: ()=>Result<Error, boolean>;
//         nextPage: ()=>void;
//         prevPage: ()=>void;
//         fetchReports: (force?: boolean)=>Promise<void>;
//         page: number;
//     }
// {
//     const service = ServiceLocator.getReportService();
//
//     useEffect(()=>
//     {
//         const sub = service.onReportsChanged(forceRender);
//
//         return ()=>
//         {
//             sub.remove();
//         }
//     }, [forceRender]);
//
//     const fetchReports = useCallback((force?: boolean)=>
//     {
//         return service.fetchReports(force);
//
//     }, [service]);
//
//     return {
//         reports: service.getReports(),
//         fetchReports: fetchReports
//     };
// }

export function useReportForClassroom(classroomName: string, forceRender: ()=>void):
    {
        reports: Result<Error, Array<Report> | undefined>;
        fetchReports: (force?: boolean)=>Promise<Result<Error, void>>;
    }
{

    const service = ServiceLocator.getReportService();

    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);

        forceRender(); 
        return ()=>
        {
            sub.remove();
        };
    }, [service]);

    const fetch = useCallback((force?: boolean)=>
    {
        return service.fetchReportsForClassroom(classroomName, force);
    }, [service, classroomName]);


    return {
        reports: service.getReportsForClassroom(classroomName),
        fetchReports: fetch

    };
}

export function useReport(id: number, forceRender: ()=>void):
    {
        report: Result<Error, Report | undefined>;
        fetchReport: (force?: boolean)=>Promise<Result<Error, void>>;
        updateReport: ()=>Result<Error, ReportUpdateBuilder>;
        removeReport: ()=>Promise<Result<Error, void>>
    }
{


    const service = ServiceLocator.getReportService();


    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);

        forceRender(); 
        return ()=>
        {
            sub.remove();
        }
    }, [service]);

    const fetchReport = useCallback((force?: boolean)=>
    {
        return service.fetchReport(id, force);
    }, [service, id]);

    const changeData = useCallback(()=>
    {
        return service.updateReport(id);
    }, [service, id]);

    const removeReport = useCallback(()=>
    {
        return service.removeReport(id);
    }, [service, id]);

    return {
        report: service.getReport(id),
        fetchReport: fetchReport,
        updateReport: changeData,
        removeReport: removeReport
    };
}


export function useFilterReports(criteria: FilterCriteria, forceRender: ()=>void):
    {
        reports: Result<Error, Array<Report> | undefined>;
        fetchReports: (force?: boolean)=> Promise<Result<Error, void>>;
        hasNextPage: ()=>Result<Error, boolean>;
        hasPrevPage: ()=>Result<Error, boolean>;
        nextPage: ()=>Result<Error, void>;
        prevPage: ()=>Result<Error, void>;
        page: number;

    }
{
    const service = ServiceLocator.getReportService();

    const ref = useRef<ReportFilter>();
    const [page, setPage] = useState(0);

    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);
        forceRender();

        return ()=>
        {
            sub.remove();
        };
    }, [service]);

    useEffect(()=>
    {
        ref.current = service.filterReports(criteria);
        setPage(0);
        forceRender();

    }, [criteria, service, setPage, forceRender]);

    const fetchReport = useCallback((force?: boolean)=>
    {
        return (async ()=>
        {
            if(ref.current === undefined)
            {
                return Result.error<Error, void>(new Error('This should not happen'));
            }

            return await ref.current.fetchPage(page, force);
        })();

    }, [page, ref.current]);

    const hasNextPage = useCallback(()=>
    {
        if(ref.current === undefined)
        {
            return Result.value<Error, boolean>(false);
        }

        return ref.current.hasNextPage(page);
    }, [page, ref.current]);

    const nextPage = useCallback(()=>
    {
        if(ref.current === undefined)
        {
            return Result.error<Error, void>(new Error('This should not happen'));
        }

        if(!ref.current.hasNextPage(page))
        {
            return Result.error<Error, void>(new Error('There is no next page'));
        }

        setPage(prevState => prevState+1);

        return Result.success<Error>();
    }, [setPage, ref.current, page]);

    const prevPage = useCallback(()=>
    {
        if(ref.current === undefined)
        {
            return Result.error<Error, void>(new Error('This should not happen'));
        }

        if(page === 0)
        {
            return Result.error<Error, void>(new Error('There is no previous page'));
        }

        setPage(prevState => prevState-1);
        return Result.success<Error>();

    }, [setPage, page, ref.current]);

    const hasPrevPage = useCallback(()=>
    {
        return Result.value<Error, boolean>(page !== 0);
    }, [page]);

    const reports = ref.current !== undefined ?
        ref.current.getPage(page) : Result.value<Error, Array<Report> | undefined>(undefined);

    return (
        {
            reports: reports,
            fetchReports: fetchReport,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
            nextPage: nextPage,
            prevPage: prevPage,
            page: page
    });
}


//useReports(ids)
//usePages(pages)
//usePage(page)
