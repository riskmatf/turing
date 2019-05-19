import {IReportService, ReportData, ReportUpdateBuilder} from "./i_report_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/admin_side/report";
import {SetStateAction} from "react";
import {ServiceLocator} from "./service_locator";

export class LocalReportService implements IReportService
{

    private reports_: Map<number, Report>;
    private classroomReportView_: Map<string, Array<Report>>;
    private emitter_: EventEmitter;
    private static ON_REPORTS_CHANGED = 'ON_REPORT_CHANGE';

    constructor()
    {
        this.reports_ = new Map<number, Report>([
            [0, new Report(0, '704', 1, 'Some error', false,
                Report.TYPE_COMPUTER_REPORT, 1, 'admin', 'cao')],
            [1, new Report(1, '704', 3, 'Some error also', false,
                Report.TYPE_COMPUTER_REPORT, 3, 'admin1', 'cao1')],
            [2, new Report(2, '704', 5, 'Some error hey', false,
                Report.TYPE_COMPUTER_REPORT, 5)],

            [3, new Report(3, '718', 1, 'Some error', false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [4, new Report(4, '718', 5, 'Some erro asr', false,
                Report.TYPE_COMPUTER_REPORT, 5)],
            [5, new Report(5, '718', 7, 'Some errora ', false,
                Report.TYPE_COMPUTER_REPORT, 7)],

            [6, new Report(6, 'rlab', 1, 'Some error', false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [7, new Report(7, 'rlab', 2, 'Some error', false,
                Report.TYPE_COMPUTER_REPORT, 2)],
            [8, new Report(8, 'rlab', 3, 'Some error', false,
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

    addReport(data: ReportData): Promise<Report>
    {
        return (async ()=>
        {
            const report  = new Report(this.reports_.size, data.classroomName, new Date().getTime(), data.description,
                false,  data.type, data.idComputer);

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
            return report;
        })();
    }

    updateReport(id: number): ReportUpdateBuilder
    {
        return new LocalReportService.ReportUpdateBuilder(id, this);
    }

    fetchReport(id: number, force?: boolean): Promise<void>
    {
        return (async ()=>
        {

        })();
    }

    fetchReports(force?: boolean): Promise<void>
    {
        return (async ()=>
        {

        })();
    }

    fetchReportsForClassroom(classroom: string, force?: boolean): Promise<void>
    {
        return (async ()=>
        {

        })();
    }

    getReport(id: number): Report | undefined
    {
        return this.reports_.get(id);
    }

    getReports(): Map<string, Array<Report>>
    {
        return this.classroomReportView_;
    }

    getReportsForClassroom(classroom: string): Array<Report>
    {
        if(this.classroomReportView_.has(classroom))
        {
            const arr = this.classroomReportView_.get(classroom);
            if(arr !== undefined)
            {
                return arr;
            }
        }
            return [];
    }

    onReportsChanged(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalReportService.ON_REPORTS_CHANGED, handler);
    }


    removeReport(id: number): Promise<void>
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
        })();

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
}