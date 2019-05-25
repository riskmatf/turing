import {FilterCriteria, IReportService, ReportData, ReportFilter, ReportUpdateBuilder} from "./i_report_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/admin_side/report";
import {SetStateAction} from "react";
import {ServiceLocator} from "./service_locator";
import {Result} from "../../utils/result";
import {addReport, fetchReportByID, fetchReports} from "./fetch_functions";
import has = Reflect.has;


type Wraper = {report: Result<Error, Report|undefined>, metaData:{time: number}};
type Wraper1 = {reports: Result<Error, Array<Report>>, metaData: {time: number}}
type Wrapper2 = {reports: Result<Error, Array<number>>; metaData:{time: number; hasNext: boolean}}

export type UpdatePayload =
    {
        action: 'update' | 'solve';
        idReport: number;
        comment?: string;
    };

export class RemoteReportService implements IReportService
{

    private reports_: Map<number, Wraper>;
    private classroomReportView_: Map<string, Wraper1>;
    private emitter_: EventEmitter;
    private static FETCH_ON = 10 * 60 * 1000;
    private static ON_REPORTS_CHANGED = 'ON_REPORT_CHANGE';

    constructor()
    {
        this.reports_ = new Map<number, Wraper>();
        this.classroomReportView_ = new Map<string, Wraper1>();

        this.emitter_ = new EventEmitter();

    }

    addReport(data: ReportData): Promise<Result<Error,Report>>
    {
        return (async ()=>
        {
            const res = await addReport(data);
            const time = new Date().getTime();
            if(res.isError())
            {
                return res;
            }

            this.reports_.set(res.value.idReport, {report:res, metaData:{time:time}});

            const classroom = this.classroomReportView_.get(res.value.classroomName);
            if(classroom !== undefined && !classroom.reports.isError())
            {
                const index = classroom.reports.value.findIndex(value => value.idReport === res.value.idReport);
                if(index !== -1)
                {
                    classroom.reports.value.splice(index, 1, res.value);
                }
                else
                {
                    classroom.reports.value.push(res.value);
                }
            }

            this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
            return res;
        })();
    }


    updateReport(id: number): Result<Error, ReportUpdateBuilder>
    {
        if(this.reports_.has(id))
        {
            return Result.value<Error, ReportUpdateBuilder>(new RemoteReportService.ReportUpdateBuilder(id, this));
        }
        else
        {
            return Result.error<Error, ReportUpdateBuilder>(new Error('No such element: ' + id));
        }
    }

    onReportsChanged(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(RemoteReportService.ON_REPORTS_CHANGED, handler);
    }

    removeReport(id: number): Promise<Result<Error,void>>
    {
        return (async ()=>
        {


            this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);

            return Result.success<Error>();
        })();

    }

    fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            let wrapper = this.reports_.get(id);
            const time = new Date().getTime();

            if(wrapper === undefined)
            {
                this.reports_.set(id, {report: Result.value(undefined), metaData: {time: time}});
                wrapper = this.reports_.get(id);
            }
            else if(time - wrapper.metaData.time >= RemoteReportService.FETCH_ON || force ||
                wrapper.report.isError())
            {
                wrapper.metaData.time = time;
            }
            else
            {
                return Result.success<Error>();
            }

            console.log('Making a request');
            const res = await fetchReportByID(id);

            if(wrapper === undefined)
            {
                return Result.error<Error, void>(new Error('This should not happen'));
            }


            wrapper.report = res;

            if(!res.isError())
            {
                const rep = res.value;
                const classroom = this.classroomReportView_.get(rep.classroomName);
                if(classroom !== undefined && !classroom.reports.isError())
                {
                    const index = classroom.reports.value.findIndex(value => value.idReport === rep.idReport);
                    if(index !== -1)
                    {
                        classroom.reports.value.splice(index, 1, rep);
                    }
                    else
                    {
                        classroom.reports.value.push(rep);
                    }
                }
            }


            this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
            if(res.isError())
            {
                return Result.error<Error, void>(res.error);
            }
            else
            {
                return Result.success<Error>();
            }
        })();

    }

    fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
            {
                for(const id of ids)
                {
                    const res = await this.fetchReport(id, force);
                    if(res.isError())
                    {
                        return res;
                    }
                }
                return Result.success<Error>();
            }
        )();
    }


    filterReports(criteria: FilterCriteria): ReportFilter
    {
        return new RemoteReportService.ReportFilter(this, criteria);
    }

    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            let wrapper = this.classroomReportView_.get(classroomName);
            const time = new Date().getTime();

            if(wrapper === undefined)
            {
                this.classroomReportView_.set(classroomName, {reports: Result.value([]), metaData: {time: time}});
                wrapper = this.classroomReportView_.get(classroomName);
            }
            else if(time - wrapper.metaData.time >= RemoteReportService.FETCH_ON || force || wrapper.reports.isError())
            {
                wrapper.metaData.time = time;
            }
            else
            {
                return Result.success<Error>();
            }

            console.log('Making a request');
            const resp = await fetchReports({classrooms:[classroomName]});

            if(wrapper === undefined)
            {
                return Result.error<Error, void>(new Error('This should not happen'));
            }

            wrapper.reports = resp;

            if(resp.isError())
            {
                return Result.error<Error, void>(resp.error);
            }


            for(const rep of resp.value)
            {
                const repWrapper = this.reports_.get(rep.idReport);
                if(repWrapper === undefined)
                {
                    this.reports_.set(rep.idReport, {report: Result.value(rep), metaData:{time:time}});
                }
                else
                {
                    repWrapper.report = Result.value(rep);
                    repWrapper.metaData.time = time;
                }
            }



            this.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);
            return Result.success<Error>();

        })();
    }

    getReport(id: number): Result<Error, Report | undefined>
    {
        this.fetchReport(id);

        const res = this.reports_.get(id);
        if(res !== undefined)
        {
            return res.report;
        }
        else
        {
            return Result.value(undefined);
        }
    }

    getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>
    {

        // Add this back when getReports is different from getting one by one report
        //this.fetchReports(ids);

        const arr = [];
        for(const id of ids)
        {
            const res = this.getReport(id);
            arr.push(res);
        }

        return Result.value(arr);
    }

    getReportsForClassroom(classroomName: string): Result<Error, Array<Report>>
    {
        this.fetchReportsForClassroom(classroomName);

        const res = this.classroomReportView_.get(classroomName);
        if(res === undefined)
        {
            return Result.value([]);
        }
        else
        {
            return res.reports;
        }
    }




    /**
     * Updates happend at fixed order not as they are wrote.
     * And that order is:
     * addAdminComment, changeAdminComment, removeAdminComment, setFix
     * Actions are not executed if they are not used
     */
    private static readonly ReportUpdateBuilder =
    class implements ReportUpdateBuilder
    {


        /**
         * This fields should be static but then you can not access them because your class has no name
         * Possible bug open issue for TS if somebody didnt do that
         */
        private ACTION_ADD_ADMIN_COMMENT_: 0 = 0;
        private ACTION_REMOVE_ADMIN_COMMENT: 1 = 1;
        private ACTION_SET_FIX: 2 = 2;

        private servie_: RemoteReportService;
        private actions_: Array<{type: 0|1|2; value: any}>;
        private id_: number;

        constructor(id: number, service: RemoteReportService)
        {
            this.servie_ = service;
            this.actions_ = [];
            this.id_ = id;
        }

        addAdminComment(comment: SetStateAction<string>): ReportUpdateBuilder
        {
            this.actions_.push({type:this.ACTION_ADD_ADMIN_COMMENT_, value:{comment: comment}});
            return this;
        }



        /*Send request and update actual data*/
        executeUpdate(): Promise<void>
        {
            return (async ()=>
            {
                const wrapper = this.servie_.reports_.get(this.id_);

                if(wrapper === undefined || wrapper.report.isError() || wrapper.report.value === undefined)
                {
                    throw new Error(`Cant update report with id ${this.id_} because it dose not exist`);
                }


                const payloadSolve: UpdatePayload = {idReport: this.id_, action: 'solve'};
                const payloadUpdate: UpdatePayload = {idReport: this.id_, action: 'update'};
                const model = wrapper.report.value;
                let hasCommentBeenUpdated = false;
                let hasBeenSolvde = false;

                for(const action of this.actions_)
                {
                    switch(action.type)
                    {
                        case this.ACTION_ADD_ADMIN_COMMENT_:
                            if(action.value.comment === undefined)
                            {
                                throw new Error('Action addAdminComment does not contain comment argument');
                            }

                        {
                            const admin = ServiceLocator.getAuthService().whoIsLogedIn();
                            if(admin === undefined)
                            {
                                throw new Error('You dont have permission to do this');

                            }
                            const idAdmin = admin.userName

                            if(typeof(action.value.comment) === 'function')
                            {
                                const comment = model.isAdminCommentSet() ? model.adminComment : undefined;
                                model.addAdminComment(idAdmin, action.value.comment(comment));
                            }
                            else
                            {
                                model.addAdminComment(idAdmin, action.value.comment);
                            }
                        }
                            hasCommentBeenUpdated = true;
                            break;

                        case this.ACTION_REMOVE_ADMIN_COMMENT:
                            if(model.isAdminCommentSet())
                            {
                                const admin = ServiceLocator.getAuthService().whoIsLogedIn();
                                if(admin === undefined)
                                {
                                    throw new Error('You dont have permission to do this');

                                }
                                const idAdmin = admin.userName;

                                model.removeAdminComment(idAdmin);
                                hasCommentBeenUpdated = true;
                            }
                            break;

                        case this.ACTION_SET_FIX:
                            if(action.value.value === undefined)
                            {
                                throw new Error('Action setFix does not contain value argument');
                            }

                            if(typeof(action.value.value) === 'function')
                            {
                                model.fixed = action.value.value(model.fixed);
                            }
                            else
                            {
                                model.fixed = action.value.value;
                            }
                            hasBeenSolvde = true;
                            break;
                    }
                }


                if(hasCommentBeenUpdated)
                {
                    if(model.isAdminCommentSet())
                    {
                        payloadUpdate.comment = model.adminComment;
                    }

                    // send request
                }

                if(hasBeenSolvde && model.fixed)
                {
                    //send request
                }
                this.servie_.emitter_.emit(RemoteReportService.ON_REPORTS_CHANGED);

            })();
        }

        removeComment(): ReportUpdateBuilder
        {
            this.actions_.push({type: this.ACTION_REMOVE_ADMIN_COMMENT, value:{}});
            return this;
        }

        setFix(value: SetStateAction<boolean>): ReportUpdateBuilder
        {
            this.actions_.push({type: this.ACTION_SET_FIX, value: {value: value}});
            return this;
        }
    }


    private static readonly ReportFilter =
    class implements ReportFilter
    {
        private service_: RemoteReportService;
        private pages_: Map<number, Wrapper2>;

        constructor(service: RemoteReportService, criteria: FilterCriteria)
        {
            this.service_ = service;
            this.pages_= new Map<number, Wrapper2>()
        }

        fetchPage(page: number, force?: boolean): Promise<Result<Error, void>>
        {
            return (async ()=>
            {
                return Result.success<Error>();
            })();
        }

        getPage(page: number): Result<Error, Array<Report> | undefined>
        {

        }

        hasNextPage(page: number): Result<Error, boolean>
        {
            const numOfPages = Math.floor(this.data_.length / this.pageSize_) + (this.data_.length % this.pageSize_ === 0 ? 0 : 1);
            if(page + 1 >= numOfPages)
            {
                return Result.value<Error, boolean>(false);
            }
            else
            {
                return Result.value<Error, boolean>(true);
            }
        }
    }
}