import {IReportService, ReportCollection, ReportData} from './i_report_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/user_side/report";
import {Result} from "../../utils/result";
import {Proxy} from "../../utils/Proxy";



// export class LocalReportService implements IReportService
// {
//     private emitter_: EventEmitter;
//     private static ON_REPORT_CHANGE = 'on_report_change';
//
//     constructor()
//     {
//     }
//
//
//     addReport(data: ReportData): Promise<Result<Error,Report>>
//     {
//         return (async ()=>
//         {
//             this.emitter_.emit(LocalReportService.ON_REPORT_CHANGE);
//             return Result.value<Error, Report>(newRep);
//         })();
//     }
//
//     fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//         })();
//
//     }
//
//     fetchReportPage(pageNumber: number, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//         })();
//     }
//
//     fetchReportPages(pages: Array<number>, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//         })();
//     }
//
//     fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//             {
//             }
//         )();
//     }
//
//     fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//         })();
//     }
//
//     getReport(id: number): Result<Error, Report | undefined>
//     {
//
//     }
//
//     getReportPage(pageNumber: number): Result<Error, Array<Report> | undefined>
//     {
//
//     }
//
//     getReportPages(pages: Array<number>): Result<Error, Array<Result<Error, Array<Report> | undefined>>>
//     {
//
//     }
//
//     getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>
//     {
//     }
//
//     getReportsForClassroom(classroomName: string): Result<Error, Array<Report>>
//     {
//
//     }
//
//     hasNextPage(currentPage: number): Result<Error, boolean>
//     {
//     }
//
//
//     onReportChange(handler: () => void): EventSubscription
//     {
//     }
//
// }