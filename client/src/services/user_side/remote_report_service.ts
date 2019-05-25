import {IReportService,  ReportData} from './i_report_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/user_side/report";
import {Result} from "../../utils/result";
import {fetchReports, addReport, fetchReportByID} from './fetch_functions';

type Wraper = {report: Result<Error, Report | undefined>; metaData: {time: number}}
type Wraper1 = {reports: Result<Error, Array<Report>>; metaData: {time: number}};

export class RemoteReportService implements IReportService
{
    private reports_: Map<number, Wraper>;
    private classroom_report_view_: Map<string, Wraper1>;
    private emitter_: EventEmitter;
    private static ON_REPORT_CHANGE = 'on_report_change';
    private static FETCH_ON = 10 * 60 * 1000;


    constructor()
    {
        this.reports_ = new Map<number, Wraper>();
        this.classroom_report_view_ = new Map<string, Wraper1>();
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

            const classroom = this.classroom_report_view_.get(res.value.classroomName);
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

            this.emitter_.emit(RemoteReportService.ON_REPORT_CHANGE);
            return res;
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
                const classroom = this.classroom_report_view_.get(rep.classroomName);
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


            this.emitter_.emit(RemoteReportService.ON_REPORT_CHANGE);
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

    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<Result<Error, void>>
    {
        return (async ()=>
        {
            let wrapper = this.classroom_report_view_.get(classroomName);
            const time = new Date().getTime();

            if(wrapper === undefined)
            {
                this.classroom_report_view_.set(classroomName, {reports: Result.value([]), metaData: {time: time}});
                wrapper = this.classroom_report_view_.get(classroomName);
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



            this.emitter_.emit(RemoteReportService.ON_REPORT_CHANGE);
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
        this.fetchReports(ids);

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

        const res = this.classroom_report_view_.get(classroomName);
        if(res === undefined)
        {
            return Result.value([]);
        }
        else
        {
            return res.reports;
        }
    }

    onReportChange(handler: () => void): EventSubscription
    {
        return  this.emitter_.addListener(RemoteReportService.ON_REPORT_CHANGE, handler);
    }
}