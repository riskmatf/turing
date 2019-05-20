import {Report, ReportType} from "../../models/admin_side/report";
import {EventSubscription} from "fbemitter";
import {SetStateAction, useCallback, useEffect} from "react";
import {ServiceLocator} from "./service_locator";

export type ReportCollection = Map<string, Array<Report>>;

export type ReportData =
    {
        classroomName: string;
        idComputer?: number;
        description: string;
        date: number;
        type: ReportType;
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

export interface IReportService
{
    getReport(id: number): Report | undefined;
    fetchReport(id: number, force?: boolean): Promise<void>;
    getReports(): ReportCollection;
    fetchReports(force?: boolean): Promise<void>
    getReportsForClassroom(classroom: string): Array<Report>;
    fetchReportsForClassroom(classroom: string, force?: boolean): Promise<void>;
    addReport(data: ReportData): Promise<Report>;
    removeReport(id: number): Promise<void>;
    updateReport(id: number): ReportUpdateBuilder;
    onReportsChanged(handler: ()=>void): EventSubscription;
}

export function useReports(forceRender: ()=>void):
    {
        reports: ReportCollection;
        fetchReports: (force?: boolean)=>Promise<void>;
    }
{
    const service = ServiceLocator.getReportService();

    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);

        return ()=>
        {
            sub.remove();
        }
    }, [forceRender]);

    const fetchReports = useCallback((force?: boolean)=>
    {

        return service.fetchReports(force);

    }, [service]);

    return {
        reports: service.getReports(),
        fetchReports: fetchReports
    };
}

export function useReportForClassroom(classroomName: string, forceRender: ()=>void):
    {
        reports: Array<Report>;
        fetchReports: (force?: boolean)=>Promise<void>;
    }
{

    const service = ServiceLocator.getReportService();

    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);

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
        report: Report | undefined;
        fetchReport: (force?: boolean)=>Promise<void>;
        updateReport: ()=>ReportUpdateBuilder;
        removeReport: ()=>Promise<void>
    }
{


    const service = ServiceLocator.getReportService();


    useEffect(()=>
    {
        const sub = service.onReportsChanged(forceRender);

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

