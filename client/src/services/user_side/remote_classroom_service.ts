import {IClassroomService} from "./i_classroom_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Classroom} from "../../models/user_side/classroom";
import {fetchAllClassrooms, fetchClassroomByName} from './fetch_functions';

type Wrapper =
    {
        data: Classroom | undefined;
        metaData:
            {
                time: number;
            }

    };

export class RemoteClassroomService implements IClassroomService
{

    private classrooms_: Map<string, Wrapper>;
    private emitter_: EventEmitter;
    private timeWhenAllFetched_ = -1;
    private static ON_CLASSROOM_CHANGE = 'on_classroom_change';
    private static FETHC_ON =  10 * 60 * 1000;

    constructor()
    {
        this.classrooms_ = new Map<string, Wrapper>();
        this.emitter_ = new EventEmitter();
    }

    fetchClassroom(classroomName: string, force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            let wraper = this.classrooms_.get(classroomName);
            const time = new Date().getTime();
            if(wraper === undefined)
            {
                this.classrooms_.set(classroomName, {data: undefined,metaData:{time:time}})
                wraper = this.classrooms_.get(classroomName);
            }
            else
            {
                if(time - wraper.metaData.time >= RemoteClassroomService.FETHC_ON || force)
                {
                    wraper.metaData.time = time;
                }
                else
                {
                    return;
                }
            }
            /*Make request*/
            console.log('Making a request');
            const classroom = await fetchClassroomByName(classroomName) as Classroom;
            if(wraper !== undefined)
            {
                wraper.data = classroom;
            }
            else
            {
                throw new Error('Wraper should not be undefined');
            }

            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOM_CHANGE);
        })();
    }

    fetchClassrooms(force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            const time = new Date().getTime();
            if(time - this.timeWhenAllFetched_ >= RemoteClassroomService.FETHC_ON || force)
            {
                this.timeWhenAllFetched_ = time;
            }
            else
            {
                return;
            }
            console.log('Making a request');
            /*Make request*/
            const classrooms = (await fetchAllClassrooms()) as Array<Classroom>;
            for(const classroom of classrooms)
            {
                this.classrooms_.set(classroom.name, {data: classroom, metaData: {time: time}});
            }
            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOM_CHANGE);
        })();
    }

    getClassroom(classroomName: string): Classroom | undefined
    {
        this.fetchClassroom(classroomName);
        const wraper = this.classrooms_.get(classroomName);

        console.log(this.classrooms_);
        return wraper === undefined ? undefined : wraper.data;
    }

    getClassrooms(): Array<Classroom>
    {
        this.fetchClassrooms();
        const res: Array<Classroom> = [];

        for(let it = this.classrooms_.values(), curr = it.next(); !curr.done; curr = it.next())
        {
            if(curr.value.data !== undefined)
            {
                res.push(curr.value.data);
            }
        }

        return res;
    }

    onClassroomChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(RemoteClassroomService.ON_CLASSROOM_CHANGE, handler);
    }
}