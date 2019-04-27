import {IClassroomService} from './i_classroom_service';
import {IReportService} from "./i_report_service";

class ServiceLocator
{
    /**
     * Declare static private variable for service
     * Declare register function and get function for service
     * All services should be interfaces and you should never work with specific implementation of
     * the service
     *
     * In this directory place all services (interfaces and implementations) also each service (interface) should
     * provide hook api to be used with
     * For this look at the example10 ( currently it is not completed but it will be soon so code may be ugly it is
     * only the idea needs little refactoring to make it more pretty coming soon)
     * This is only for shared data (local or from server)
     */

    private static classroomService_ : IClassroomService | undefined = undefined;
    private static reportService_: IReportService | undefined = undefined;

    public static  registerClassroomService(service: IClassroomService): void
    {
        ServiceLocator.classroomService_ = service;
    }

    public static getClassroomService(): IClassroomService
    {
        if(ServiceLocator.classroomService_ === undefined)
        {
            throw new Error('Classroom service is not set');
        }

        return ServiceLocator.classroomService_;
    }

    public static registerReportService(service: IReportService)
    {
        this.reportService_ = service;
    }

    public static getReportService(): IReportService
    {
        if(this.reportService_ === undefined)
        {
            throw new Error('Report service not registered');
        }

        return this.reportService_;
    }
}


export {ServiceLocator};
