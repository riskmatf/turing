import {IReportService, ReportCollection, ReportData} from './i_report_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/user_side/report";
import {Result} from "../../utils/result";
import {Proxy} from "../../utils/Proxy";



export class LocalReportService implements IReportService
{
    private reports_: Map<number, Proxy<Report>>;
    private reportClassroomView_: Map<string, Array<Proxy<Report>>>;
    private pages_: Map<number, Array<Proxy<Report>>>;
    private emitter_: EventEmitter;
    private static ON_REPORT_CHANGE = 'on_report_change';

    constructor()
    {
        this.reports_ = new Map<number, Proxy<Report>>([
            [0, new Proxy<Report>(new Report(0, '704', 1, 'Some error', false, true,
                Report.TYPE_COMPUTER_REPORT, 1))],
            [1, new Proxy<Report>(new Report(1, '704', 3, 'Some error also', false, false,
                Report.TYPE_COMPUTER_REPORT, 3))],
            [2, new Proxy<Report>(new Report(2, '704', 5, 'Some error hey', false, false,
                Report.TYPE_COMPUTER_REPORT, 5))],

            [3, new Proxy<Report>(new Report(3, '718', 1, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 1))],
            [4, new Proxy<Report>(new Report(4, '718', 5, 'Some erro asr', false, false,
                Report.TYPE_COMPUTER_REPORT, 5))],
            [5, new Proxy<Report>(new Report(5, '718', 7, 'Some errora ', false, false,
                Report.TYPE_COMPUTER_REPORT, 7))],

            [6, new Proxy<Report>(new Report(6, 'rlab', 1, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 1))],
            [7, new Proxy<Report>(new Report(7, 'rlab', 2, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 2))],
            [8, new Proxy<Report>(new Report(8, 'rlab', 3, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 3))],
        ]);

        this.reportClassroomView_ = new Map<string, Array<Proxy<Report>>>();

        this.reports_.forEach(value =>
        {
            if(this.reportClassroomView_.has(value.data.classroomName))
            {
                const arr = this.reportClassroomView_.get(value.data.classroomName);

                if(arr !== undefined)
                {
                    arr.push(value);
                }
            }
            else
            {
                this.reportClassroomView_.set(value.data.classroomName, [value]);
            }
        });

        this.pages_ = new Map();

        for(let it = this.reports_.entries(), curr = it.next(); !curr.done; curr = it.next())
        {
            const page = Math.floor(curr.value[0] / 3);

            if(this.pages_.has(page))
            {
                const values = this.pages_.get(page);
                if(values !== undefined)
                {
                    values.push(curr.value[1]);
                }
            }
            else
            {
                this.pages_.set(page, [curr.value[1]]);
            }
        }



        this.emitter_ = new EventEmitter();


    }


    addReport(data: ReportData): Promise<Result<Error,Report>>
    {
        return (async ()=>
        {
            const newRep = new Report(this.reports_.size, data.classroomName, data.date, data.description, false,
                data.urgent, data.type, data.idComputer);

            const  proxy = new Proxy(newRep);
            this.reports_.set(newRep.idReport, proxy);
            if(this.reportClassroomView_.has(newRep.classroomName))
            {
                const arr = this.reportClassroomView_.get(newRep.classroomName);
                if(arr !== undefined)
                {
                    arr.push(proxy);
                }
            }
            else
            {
                this.reportClassroomView_.set(newRep.classroomName, [proxy]);
            }

            this.emitter_.emit(LocalReportService.ON_REPORT_CHANGE);
            return Result.value<Error, Report>(newRep);
        })();
    }

    fetchReport(id: number, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            if(this.reports_.has(id))
            {
                return Result.success<Error>();
            }
            else
            {
                return Result.error<Error, void>(new Error('No such element'));
            }
        })();

    }

    fetchReportPage(pageNumber: number, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            return Result.success<Error>();
        })();
    }

    fetchReportPages(pages: Array<number>, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            return Result.success<Error>();
        })();
    }

    fetchReports(ids: Array<number>, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
            {
                for(const id of ids)
                {
                    if(!this.reports_.has(id))
                    {
                        return Result.error<Error, void>(new Error('No such element: ' + id));
                    }
                }

                return Result.success<Error>();
            }
        )();
    }

    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
           if(this.reportClassroomView_.has(classroomName))
           {
               return Result.success<Error>();
           }

           return Result.error<Error, void>(new Error('No such classroom: ' + classroomName));
        })();
    }

    getReport(id: number): Result<Error, Report | undefined>
    {
        if(this.reports_.has(id))
        {
            const value = this.reports_.get(id);
            if(value === undefined)
            {
                return Result.error<Error, Report | undefined>(new Error('This should not happen'));
            }
            return Result.value<Error, Report  | undefined>(value.data);
        }
        else
        {
            return Result.error<Error, Report>(new Error('No such element: ' + id));
        }
    }

    getReportPage(pageNumber: number): Result<Error, Array<Report> | undefined>
    {
        if(this.pages_.has(pageNumber))
        {
            const page = this.pages_.get(pageNumber);
            if(page !== undefined)
            {
                return Result.value<Error, Array<Report>|undefined>(page.map(value => value.data));
            }
            else
            {
                return Result.error<Error, Array<Report>|undefined>(new Error('This should not happen'));
            }
        }
        else
        {
            return Result.error<Error, Array<Report> | undefined>(new Error('No such element'));
        }
    }

    getReportPages(pages: Array<number>): Result<Error, Array<Result<Error, Array<Report> | undefined>>>
    {
        const res: Array<Result<Error,Array<Report> | undefined>> = [];

        for(const page of pages)
        {
            res.push(this.getReportPage(page));
        }

        return Result.value<Error, Array<Result<Error,Array<Report> | undefined>>>(res);
    }

    getReports(ids: Array<number>): Result<Error, Array<Result<Error, Report | undefined>>>
    {
        const res: Array<Result<Error, Report | undefined>> = [];

        for(const id of ids)
        {
            res.push(this.getReport(id));
        }

        return Result.value<Error, Array<Result<Error, Report|undefined>>>(res);
    }

    getReportsForClassroom(classroomName: string): Result<Error, Array<Report>>
    {
        if(this.reportClassroomView_.has(classroomName))
        {
            const value = this.reportClassroomView_.get(classroomName);
            if(value !== undefined)
            {
                return Result.value<Error, Array<Report>>(value.map(value1 => value1.data));
            }
            else
            {
                return Result.error<Error, Array<Report>>(new Error('Something went wrong'));
            }
        }
        else
        {
            return Result.error<Error, Array<Report>>(new Error('No such element'));
        }
    }

    hasNextPage(currentPage: number): Result<Error, boolean>
    {
        return Result.value<Error, boolean>(this.pages_.has(currentPage+1));
    }


    onReportChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalReportService.ON_REPORT_CHANGE, handler);
    }

}