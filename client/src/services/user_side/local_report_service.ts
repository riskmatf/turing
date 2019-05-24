import {IReportService, ReportCollection, ReportData} from './i_report_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Report} from "../../models/user_side/report";



export class LocalReportService implements IReportService
{
    private reports_: Map<number, Report>;
    private reportClassroomView_: Map<string, Array<Report>>;
    private emitter_: EventEmitter;
    private static ON_REPORT_CHANGE = 'on_report_change';

    constructor()
    {
        this.reports_ = new Map<number, Report>([
            [0, new Report(0, '704', 1, 'Some error', false, true,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [1, new Report(1, '704', 3, 'Some error also', false, false,
                Report.TYPE_COMPUTER_REPORT, 3)],
            [2, new Report(2, '704', 5, 'Some error hey', false, false,
                Report.TYPE_COMPUTER_REPORT, 5)],

            [3, new Report(3, '718', 1, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [4, new Report(4, '718', 5, 'Some erro asr', false, false,
                Report.TYPE_COMPUTER_REPORT, 5)],
            [5, new Report(5, '718', 7, 'Some errora ', false, false,
                Report.TYPE_COMPUTER_REPORT, 7)],

            [6, new Report(6, 'rlab', 1, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 1)],
            [7, new Report(7, 'rlab', 2, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 2)],
            [8, new Report(8, 'rlab', 3, 'Some error', false, false,
                Report.TYPE_COMPUTER_REPORT, 3)],
        ]);

        this.reportClassroomView_ = new Map<string, Array<Report>>();

        this.reports_.forEach(value =>
        {
            if(this.reportClassroomView_.has(value.classroomName))
            {
                const arr = this.reportClassroomView_.get(value.classroomName);

                if(arr !== undefined)
                {
                    arr.push(value);
                }
            }
            else
            {
                this.reportClassroomView_.set(value.classroomName, [value]);
            }
        });


        this.emitter_ = new EventEmitter();


    }


    addReport(data: ReportData): Promise<Report>
    {
        return (async ()=>
        {
            const newRep = new Report(this.reports_.size, data.classroomName, data.date, data.description, false,
                data.urgent, data.type, data.idComputer);

            this.reports_.set(newRep.idReport, newRep);
            if(this.reportClassroomView_.has(newRep.classroomName))
            {
                const arr = this.reportClassroomView_.get(newRep.classroomName);
                if(arr !== undefined)
                {
                    arr.push(newRep);
                }
            }
            else
            {
                this.reportClassroomView_.set(newRep.classroomName, [newRep]);
            }

            this.emitter_.emit(LocalReportService.ON_REPORT_CHANGE);
            return newRep;
        })();
    }

    fetchAllReports(force?: boolean): Promise<void>
    {
        return (async ()=>{})();
    }

    fetchReport(id: number, force?: boolean): Promise<void>
    {
        return (async ()=>{})();
    }

    fetchReportsForClassroom(classroomName: string, force?: boolean): Promise<void>
    {
        return (async ()=>{})()
    }

    getAllReports(): ReportCollection
    {
        return this.reportClassroomView_;
    }

    getReport(id: number): Report | undefined
    {
        if(this.reports_.has(id))
        {
            return this.reports_.get(id);
        }
        return undefined;
    }

    getReportsForClassroom(classroomName: string): Array<Report>
    {
        if(this.reportClassroomView_.has(classroomName))
        {
            const arr = this.reportClassroomView_.get(classroomName);
            if(arr !== undefined)
            {
                return arr;
            }
        }
        return [];
    }

    onReportChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalReportService.ON_REPORT_CHANGE, handler);
    }

}