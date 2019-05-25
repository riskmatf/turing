import {FilterCriteria, IReportService, ReportData, ReportFilter, ReportUpdateBuilder} from "./i_report_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/admin_side/report";
import {SetStateAction} from "react";
import {ServiceLocator} from "./service_locator";
import {Result} from "../../utils/result";


export class LocalReportService implements IReportService
{

    private reports_: Map<number, Report>;
    private classroomReportView_: Map<string, Array<Report>>;
    private emitter_: EventEmitter;
    private static ON_REPORTS_CHANGED = 'ON_REPORT_CHANGE';

    constructor()
    {
        this.reports_ = new Map<number, Report>([
            [0, new Report(0, '704', 1, 'Some error', false, true,
                Report.TYPE_COMPUTER_REPORT, 1, 'admin', 'cao')],
            [1, new Report(1, '704', 3, 'Some error also', false, false,
                Report.TYPE_COMPUTER_REPORT, 3, 'admin1', 'cao1')],
            [2, new Report(2, '704', 5, 'Some error hey', false, false,
                Report.TYPE_COMPUTER_REPORT, 5)],

            [3, new Report(3, '718', 1, 'Some error', true, false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [4, new Report(4, '718', 5, 'Some erro asr', false, false,
                Report.TYPE_COMPUTER_REPORT, 5)],
            [5, new Report(5, '718', 7, 'Some errora ', true, false,
                Report.TYPE_COMPUTER_REPORT, 7)],

            [6, new Report(6, 'rlab', 1, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [7, new Report(7, 'rlab', 2, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 2)],
            [8, new Report(8, 'rlab', 3, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 3)],
        ]);

        this.classroomReportView_ = new Map<string, Array<Report>>();

        this.emitter_ = new EventEmitter();

        this.reports_.forEach(value =>
        {
            if(this.classroomReportView_.has(value.classroomName))
            {
                const arr = this.classroomReportView_.get(value.classroomName);

                if(arr !== undefined)
                {
                    arr.push(value);
                }
            }
            else
            {
                this.classroomReportView_.set(value.classroomName, [value]);
            }
        });

    }

    addReport(data: ReportData): Promise<Result<Error, Report>>
    {
        return (async ()=>
        {
            const report  = new Report(this.reports_.size, data.classroomName, new Date().getTime(), data.description,
                false, data.urgent,  data.type, data.idComputer);

            this.reports_.set(report.idReport, report);
            if(this.classroomReportView_.has(report.classroomName))
            {
                const arr = this.classroomReportView_.get(report.classroomName);
                if(arr !== undefined)
                {
                    arr.push(report);
                }
            }
            else
            {
                this.classroomReportView_.set(report.classroomName, [report]);
            }


            this.emitter_.emit(LocalReportService.ON_REPORTS_CHANGED);

            return Result.value<Error, Report>(report);
        })();
    }

    updateReport(id: number): Result<Error, ReportUpdateBuilder>
    {
        if(this.reports_.has(id))
        {
            return Result.value<Error, ReportUpdateBuilder>(new LocalReportService.ReportUpdateBuilder(id, this));
        }
        else
        {
            return Result.error<Error, ReportUpdateBuilder>(new Error('No such element: ' + id));
        }
    }


    onReportsChanged(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalReportService.ON_REPORTS_CHANGED, handler);
    }

    removeReport(id: number): Promise<Result<Error,void>>
    {
        return (async ()=>
        {

            if(!this.reports_.has(id))
            {
                throw new Error('There is no report with that id');
            }

            this.reports_.delete(id);
            this.classroomReportView_.forEach(value=>
            {
              const index = value.findIndex(value1 => value1.idReport === id) ;
              if(index !== -1)
              {
                  value.splice(index, 1);
              }
            });
            this.emitter_.emit(LocalReportService.ON_REPORTS_CHANGED);

            return Result.success<Error>();
        })();

    }

    fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            if(this.reports_.has(id))
            {
                return Result.success<Error>()
            }
            else
            {
                return Result.error<Error, void>(new Error('No such element'));
            }
        })();
    }

    fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            for(const id of ids)
            {
                const res =  await this.fetchReport(id);
                if(res.isError())
                {
                    return res;
                }
            }
            return Result.success<Error>();
        })();

    }

    fetchReportsForClassroom(classroom: string, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            if(this.classroomReportView_.has(classroom))
            {
                return Result.success<Error>();
            }
            return Result.error<Error, void>(new Error('There is no such element'));
        })();
    }

    filterReports(criteria: FilterCriteria): ReportFilter
    {
        return new LocalReportService.ReportFilter(this, criteria);
    }

    getReport(id: number): Result<Error, Report | undefined>
    {
        if(this.reports_.has(id))
        {
            const res = this.reports_.get(id);
            if(res !== undefined)
            {
                return Result.value<Error, Report | undefined>(res);
            }
            else
            {
                return Result.error<Error, Report | undefined>(new Error('This should not happen'));
            }
        }
        else
        {
            return Result.error<Error, Report | undefined>(new Error('There is no such element'));
        }
    }

    getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>
    {
        const res: Array<Result<Error, Report | undefined>> = [];

        for(const id of ids)
        {
            res.push(this.getReport(id));
        }

        return Result.value<Error, Array<Result<Error, Report | undefined>>>(res);
    }

    getReportsForClassroom(classroom: string): Result<Error, Array<Report> | undefined>
    {
        if(this.classroomReportView_.has(classroom))
        {
            const res = this.classroomReportView_.get(classroom);

            if(res !== undefined)
            {
                return Result.value<Error, Array<Report> | undefined>(res);
            }
            else
            {
                return Result.error<Error, Array<Report> | undefined>(new Error('This should not happen'));
            }
        }
        else
        {
            return Result.error<Error, Array<Report> | undefined>(new Error('There is not such element: ' + classroom));
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

        private servie_: LocalReportService;
        private actions_: Array<{type: 0|1|2; value: any}>;
        private id_: number;

        constructor(id: number, service: LocalReportService)
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
                const model = this.servie_.reports_.get(this.id_);

                if(model === undefined)
                {
                    throw new Error(`Cant update report with id ${this.id_} because it dose not exist`);
                }

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
                            break;
                    }
                }
                this.servie_.emitter_.emit(LocalReportService.ON_REPORTS_CHANGED);

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
        private service_: LocalReportService;
        private data_: Array<Report>;
        private pageSize_: number = 1;

        constructor(service: LocalReportService, criteria: FilterCriteria)
        {
            this.service_ = service;
            this.data_  = this.filterData(criteria);
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
            const index = page * this.pageSize_;
            let end = index + this.pageSize_;

            if(index >= this.data_.length)
            {
                return Result.error<Error, Array<Report> | undefined>(new Error('Index out of bound'));
            }

            if(end > this.data_.length)
            {
                end = this.data_.length;
            }

            return Result.value<Error, Array<Report> | undefined>(this.data_.slice(index, end));

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

        private filterData(filters: FilterCriteria): Array<Report>
        {
            const arr: Array<Report> = [];
            for(let it = this.service_.reports_.values(), curr = it.next(); !curr.done; curr = it.next())
            {
                arr.push(curr.value);
            }


            return arr.filter(value =>
            {
                let allowClassroom = true;
                let allowComment = true;
                let allowFixed = true;

                if(filters.classrooms.length !== 0)
                {
                    const index = filters.classrooms.findIndex(value1=>value1 === value.classroomName);
                    allowClassroom = index !== -1;
                }

                if(filters.comments === 'has' && !value.isAdminCommentSet())
                {
                    allowComment = false;
                }
                else if(filters.comments === 'dontHave' && value.isAdminCommentSet())
                {
                    allowComment = false;
                }

                if(filters.fixed === 'fixed' && !value.fixed)
                {
                    allowFixed = false;
                }
                else if(filters.fixed === 'notFixed' && value.fixed)
                {
                    allowFixed = false;
                }

                return allowFixed && allowComment && allowClassroom;
            });
        }
    }
}