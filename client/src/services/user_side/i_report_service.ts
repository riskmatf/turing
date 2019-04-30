import {Report} from "../../models/user_side/report";
import {EventSubscription} from "fbemitter";
import {ServiceLocator} from "./serviceLocator";
import {useCallback, useEffect} from "react";

/*export type ReportCollection =
    {
        [classroomName: string]: Array<Report>;
    }
*/

export type ReportCollection = Map<string, Array<Report>>;

export type ReportData =
    {
        classroomName: string;
        idComputer: number;
        description: string;
    }

export interface IReportService
{
    fetchAllReports(force?: boolean): Promise<void>;
    getAllReports(): ReportCollection;
    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<void>;
    getReportsForClassroom(classroomName: string): Array<Report>;
    fetchReport(id: number, force?: boolean): Promise<void>;
    getReport(id: number): Report | undefined;
    addReport(data: ReportData): Promise<Report>;
    onReportChange(handler: ()=>void): EventSubscription;
}

export function useReports(forceRender: ()=>void):
    {
        reports: ReportCollection;
        fetchReports: (force?: boolean)=>Promise<void>;
        addReport: (data: ReportData)=> Promise<Report>;
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
        return service.fetchAllReports(force);
    }, [service]);

    const addReport = useCallback((data: ReportData)=>
    {
        return service.addReport(data);
    }, [service]);

    return (
        {
            reports: service.getAllReports(),
            addReport: addReport,
            fetchReports: fetchReports
        }
    );
}

export function useReportsForClassroom(classroomName: string, forceRender: ()=>void):
    {
        reports: Array<Report>;
        fetchReportsForClassroom: (force?: boolean)=>Promise<void>;
        addReport: (data: ReportData)=>Promise<Report>;
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

    const addReport = useCallback((data: ReportData)=>
    {
        return service.addReport(data);
    }, [service]);

    return (
        {
            reports: service.getReportsForClassroom(classroomName),
            addReport: addReport,
            fetchReportsForClassroom: fetchReports
        }
    );
}

export function useReport(id: number, forceRender: ()=>void):
    {
        report: Report| undefined;
        fetchReport: (force?: boolean)=>Promise<void>;
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
