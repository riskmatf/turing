import {FilterCriteria, IReportService, ReportData, ReportFilter, ReportUpdateBuilder} from "./i_report_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/admin_side/report";
import {SetStateAction} from "react";
import {ServiceLocator} from "./service_locator";
import {Result} from "../../utils/result";


type Wraper = {report: Result<Error, Report|undefined>, metaData:{time: number}};
type Wraper1 = {reports: Result<Error, Array<Report>>, metaData: {time: number}}

// export class RemoteReportService implements IReportService
// {
//
//     private reports_: Map<number, Wraper>;
//     private classroomReportView_: Map<string, Wraper1>;
//     private emitter_: EventEmitter;
//     private static ON_REPORTS_CHANGED = 'ON_REPORT_CHANGE';
//
//     constructor()
//     {
//         this.reports_ = new Map<number, Report>();
//         this.classroomReportView_ = new Map<string, Array<Report>>();
//
//         this.emitter_ = new EventEmitter();
//
//     }
//
//     addReport(data: ReportData): Promise<Result<Error, Report>>
//     {
//         return (async ()=>
//         {
//
//
//             this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
//
//         })();
//     }
//
//     updateReport(id: number): Result<Error, ReportUpdateBuilder>
//     {
//         if(this.reports_.has(id))
//         {
//             return Result.value<Error, ReportUpdateBuilder>(new RemoteReportService.ReportUpdateBuilder(id, this));
//         }
//         else
//         {
//             return Result.error<Error, ReportUpdateBuilder>(new Error('No such element: ' + id));
//         }
//     }
//
//
//     onReportsChanged(handler: () => void): EventSubscription
//     {
//         return this.emitter_.addListener(RemoteReportService.ON_REPORTS_CHANGED, handler);
//     }
//
//     removeReport(id: number): Promise<Result<Error,void>>
//     {
//         return (async ()=>
//         {
//
//
//             this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
//
//             return Result.success<Error>();
//         })();
//
//     }
//
//     fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//
//         })();
//     }
//
//     fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//         })();
//
//     }
//
//     fetchReportsForClassroom(classroom: string, force?: boolean): Promise<Result<Error, void>>
//     {
//         return (async ()=>
//         {
//
//         })();
//     }
//
//     filterReports(criteria: FilterCriteria): ReportFilter
//     {
//         return new RemoteReportService.ReportFilter(this, criteria);
//     }
//
//     getReport(id: number): Result<Error, Report | undefined>
//     {
//
//     }
//
//     getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>
//     {
//
//         return Result.value<Error, Array<Result<Error, Report | undefined>>>(res);
//     }
//
//     getReportsForClassroom(classroom: string): Result<Error, Array<Report> | undefined>
//     {
//
//     }
//
//
//
//
//     /**
//      * Updates happend at fixed order not as they are wrote.
//      * And that order is:
//      * addAdminComment, changeAdminComment, removeAdminComment, setFix
//      * Actions are not executed if they are not used
//      */
//     private static readonly ReportUpdateBuilder =
//     class implements ReportUpdateBuilder
//     {
//
//
//         /**
//          * This fields should be static but then you can not access them because your class has no name
//          * Possible bug open issue for TS if somebody didnt do that
//          */
//         private ACTION_ADD_ADMIN_COMMENT_: 0 = 0;
//         private ACTION_REMOVE_ADMIN_COMMENT: 1 = 1;
//         private ACTION_SET_FIX: 2 = 2;
//
//         private servie_: RemoteReportService;
//         private actions_: Array<{type: 0|1|2; value: any}>;
//         private id_: number;
//
//         constructor(id: number, service: RemoteReportService)
//         {
//             this.servie_ = service;
//             this.actions_ = [];
//             this.id_ = id;
//         }
//
//         addAdminComment(comment: SetStateAction<string>): ReportUpdateBuilder
//         {
//             this.actions_.push({type:this.ACTION_ADD_ADMIN_COMMENT_, value:{comment: comment}});
//             return this;
//         }
//
//
//
//         /*Send request and update actual data*/
//         executeUpdate(): Promise<void>
//         {
//             return (async ()=>
//             {
//                 const model = this.servie_.reports_.get(this.id_);
//
//                 if(model === undefined)
//                 {
//                     throw new Error(`Cant update report with id ${this.id_} because it dose not exist`);
//                 }
//
//                 for(const action of this.actions_)
//                 {
//                     switch(action.type)
//                     {
//                         case this.ACTION_ADD_ADMIN_COMMENT_:
//                             if(action.value.comment === undefined)
//                             {
//                                 throw new Error('Action addAdminComment does not contain comment argument');
//                             }
//
//                         {
//                             const admin = ServiceLocator.getAuthService().whoIsLogedIn();
//                             if(admin === undefined)
//                             {
//                                 throw new Error('You dont have permission to do this');
//
//                             }
//                             const idAdmin = admin.userName
//
//                             if(typeof(action.value.comment) === 'function')
//                             {
//                                 const comment = model.isAdminCommentSet() ? model.adminComment : undefined;
//                                 model.addAdminComment(idAdmin, action.value.comment(comment));
//                             }
//                             else
//                             {
//                                 model.addAdminComment(idAdmin, action.value.comment);
//                             }
//                         }
//                             break;
//
//                         case this.ACTION_REMOVE_ADMIN_COMMENT:
//                             if(model.isAdminCommentSet())
//                             {
//                                 const admin = ServiceLocator.getAuthService().whoIsLogedIn();
//                                 if(admin === undefined)
//                                 {
//                                     throw new Error('You dont have permission to do this');
//
//                                 }
//                                 const idAdmin = admin.userName;
//
//                                 model.removeAdminComment(idAdmin);
//                             }
//                             break;
//
//                         case this.ACTION_SET_FIX:
//                             if(action.value.value === undefined)
//                             {
//                                 throw new Error('Action setFix does not contain value argument');
//                             }
//
//                             if(typeof(action.value.value) === 'function')
//                             {
//                                 model.fixed = action.value.value(model.fixed);
//                             }
//                             else
//                             {
//                                 model.fixed = action.value.value;
//                             }
//                             break;
//                     }
//                 }
//                 this.servie_.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
//
//             })();
//         }
//
//         removeComment(): ReportUpdateBuilder
//         {
//             this.actions_.push({type: this.ACTION_REMOVE_ADMIN_COMMENT, value:{}});
//             return this;
//         }
//
//         setFix(value: SetStateAction<boolean>): ReportUpdateBuilder
//         {
//             this.actions_.push({type: this.ACTION_SET_FIX, value: {value: value}});
//             return this;
//         }
//     }
//
//
//     private static readonly ReportFilter =
//     class implements ReportFilter
//     {
//         private service_: RemoteReportService;
//         private data_: Array<Report>;
//         private pageSize_: number = 1;
//
//         constructor(service: RemoteReportService, criteria: FilterCriteria)
//         {
//             this.service_ = service;
//             this.data_  = this.filterData(criteria);
//         }
//
//         fetchPage(page: number, force?: boolean): Promise<Result<Error, void>>
//         {
//             return (async ()=>
//             {
//                 return Result.success<Error>();
//             })();
//         }
//
//         getPage(page: number): Result<Error, Array<Report> | undefined>
//         {
//             const index = page * this.pageSize_;
//             let end = index + this.pageSize_;
//
//             if(index >= this.data_.length)
//             {
//                 return Result.error<Error, Array<Report> | undefined>(new Error('Index out of bound'));
//             }
//
//             if(end > this.data_.length)
//             {
//                 end = this.data_.length;
//             }
//
//             return Result.value<Error, Array<Report> | undefined>(this.data_.slice(index, end));
//
//         }
//
//         hasNextPage(page: number): Result<Error, boolean>
//         {
//             const numOfPages = Math.floor(this.data_.length / this.pageSize_) + (this.data_.length % this.pageSize_ === 0 ? 0 : 1);
//             if(page + 1 >= numOfPages)
//             {
//                 return Result.value<Error, boolean>(false);
//             }
//             else
//             {
//                 return Result.value<Error, boolean>(true);
//             }
//         }
//
//         private filterData(filters: FilterCriteria): Array<Report>
//         {
//             const arr: Array<Report> = [];
//             for(let it = this.service_.reports_.values(), curr = it.next(); !curr.done; curr = it.next())
//             {
//                 arr.push(curr.value);
//             }
//
//
//             return arr.filter(value =>
//             {
//                 let allowClassroom = true;
//                 let allowComment = true;
//                 let allowFixed = true;
//
//                 if(filters.classrooms.length !== 0)
//                 {
//                     const index = filters.classrooms.findIndex(value1=>value1 === value.classroomName);
//                     allowClassroom = index !== -1;
//                 }
//
//                 if(filters.comments === 'has' && !value.isAdminCommentSet())
//                 {
//                     allowComment = false;
//                 }
//                 else if(filters.comments === 'dontHave' && value.isAdminCommentSet())
//                 {
//                     allowComment = false;
//                 }
//
//                 if(filters.fixed === 'fixed' && !value.fixed)
//                 {
//                     allowFixed = false;
//                 }
//                 else if(filters.fixed === 'notFixed' && value.fixed)
//                 {
//                     allowFixed = false;
//                 }
//
//                 return allowFixed && allowComment && allowClassroom;
//             });
//         }
//     }
// }