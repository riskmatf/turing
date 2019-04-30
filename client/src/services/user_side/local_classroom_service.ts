import {IClassroomService} from "./i_classroom_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {Classroom} from "../../models/user_side/classroom";

function schemaUrl(name: string)
{
    return `/turing/assets/schemas/${name}.svg`;
}

const data:Array<[string, string, number]> = [
    ['704','Trg', 5],
    ['718', 'Trg', 10],
    ['bim','Jagiceva', 8],
    ['rlab', 'Jagiceva', 4]
];

export class LocalClassroomService implements IClassroomService
{

    private classrooms_: Map<string, Classroom>;
    private emitter_: EventEmitter;
    private static ON_CLASSROOM_CHANGE = 'on_classroom_change';

    constructor()
    {
        this.classrooms_ = new Map<string, Classroom>(
            data.map(([a, b, c])=> [a, new Classroom(a, b, schemaUrl(a), c)])
        );
        this.emitter_ = new EventEmitter();
    }

    fetchClassroom(classroomName: string, force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            return ;
        })();
    }

    fetchClassrooms(force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            return ;
        })();
    }

    getClassroom(classroomName: string): Classroom | undefined
    {
        this.fetchClassroom(classroomName);

        if(this.classrooms_.has(classroomName))
        {
            return this.classrooms_.get(classroomName);
        }

        return undefined;
    }

    getClassrooms(): Array<Classroom>
    {
        return Array.from(this.classrooms_.values());
    }

    onClassroomChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalClassroomService.ON_CLASSROOM_CHANGE, handler);
    }
}