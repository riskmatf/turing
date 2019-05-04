import {IReportService} from "./i_report_service";
import {IClassroomService} from "./i_classroom_service";
import {IAuthService} from "./i_auth_service";

export class ServiceLocator
{

    private static reportService_: IReportService | undefined = undefined;
    private static classroomService_: IClassroomService| undefined = undefined;
    private static authService_: IAuthService| undefined = undefined;


    public static registerReportService(service: IReportService): void
    {
        ServiceLocator.reportService_ = service;
    }

    public static getReportService(): IReportService
    {
        if(ServiceLocator.reportService_ === undefined)
        {
            throw new Error('Report service not registered');
        }

        return ServiceLocator.reportService_;
    }

    public static registerClassroomService(service: IClassroomService): void
    {
        ServiceLocator.classroomService_ = service;
    }

    public static getClassroomService(): IClassroomService
    {
        if(ServiceLocator.classroomService_ === undefined)
        {
            throw new Error('Classroom service not registered');
        }

        return ServiceLocator.classroomService_;
    }

    public static registerAuthService(service: IAuthService): void
    {
        ServiceLocator.authService_= service;
    }

    public static getAuthService(): IAuthService
    {
        if(ServiceLocator.authService_ === undefined)
        {
            throw new Error('Auth service not registered');
        }

        return ServiceLocator.authService_;
    }
}