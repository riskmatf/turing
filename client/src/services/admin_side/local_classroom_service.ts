import {ClassroomData, ClassroomUpdateBuilder, IClassroomService} from './i_classroom_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Classroom} from "../../models/admin_side/classroom";
import {SetStateAction} from "react";

function schemaUrl(name: string)
{
    return `/turing/assets/schemas/${name}.svg`;
}

const data:Array<[string, string, number]> = [
    ['704','Trg', 15], ['718', 'Trg', 10],
    ['bim','Jagiceva', 8],
    ['rlab', 'Jagiceva', 4]
];

export class LocalClassroomService implements IClassroomService
{

    private static ON_CLASSROOMS_CHANGE = 'on_classrooms_change';

    private emitter_: EventEmitter;
    private classrooms_: Map<string, Classroom>;

    constructor()
    {
        this.emitter_ = new EventEmitter();
        this.classrooms_ = new Map<string, Classroom>(
            data.map(([a, b, c])=> [a, new Classroom(a, b, schemaUrl(a), c)])
            );
    }


    addClassroom(data: ClassroomData): Promise<Classroom>
    {
        return (async ()=>
        {
            if(this.classrooms_.has(data.name))
            {
                throw new Error('Cant add already existing classroom');
            }

            const url = await getUrlFromFile(data.schemaFile);

            const classroom = new Classroom(data.name, data.location, url, data.computerCount);

            this.classrooms_.set(classroom.name, classroom);

            this.emitter_.emit(LocalClassroomService.ON_CLASSROOMS_CHANGE);
            return classroom;
        })();


    }

    fetchClassroom(classroomName: string, force?: boolean): Promise<void>
    {
        return (async ()=>
        {

        })();
    }

    fetchClassrooms(force?: boolean): Promise<void>
    {
        return (async ()=>
        {
        })();
    }

    getClassroom(classroomName: string): Classroom | undefined
    {
        return this.classrooms_.get(classroomName);
    }

    getClassrooms(): Array<Classroom>
    {
        return Array.from(this.classrooms_.values());
    }

    onClassroomsChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(LocalClassroomService.ON_CLASSROOMS_CHANGE, handler);
    }

    removeClassroom(classroomName: string): Promise<void>
    {
        return (async ()=>
        {
            if(!this.classrooms_.has(classroomName))
            {
                throw new Error(`No classroom with ${classroomName}`);
            }

            this.classrooms_.delete(classroomName);
            this.emitter_.emit(LocalClassroomService.ON_CLASSROOMS_CHANGE);
        })();
    }

    updateClassroom(classroomName: string): ClassroomUpdateBuilder
    {
        return new LocalClassroomService.ClassroomUpdateBuilder(classroomName, this);
    }

    private static readonly ClassroomUpdateBuilder =
    class implements ClassroomUpdateBuilder
    {


        private ACTION_SET_COMPUTER_COUNT: 0 = 0;
        private ACTION_SET_LOCATION: 1 = 1;
        private ACTION_SET_NAME: 2 = 2;
        private ACTION_SET_SCHEMA_FILE: 3 = 3;

        private classRoomName_: string;
        private service_: LocalClassroomService;
        private actions_: Array<{type: 0|1|2|3; data: any}>;

        constructor(classroomName: string, service: LocalClassroomService)
        {
            this.classRoomName_ = classroomName;
            this.service_ = service;
            this.actions_ = [];
        }

        executeUpdate(): Promise<void>
        {
            return (async ()=>
            {
                if(!this.service_.classrooms_.has(this.classRoomName_))
                {
                    throw new Error(`Cant update classroom with name ${this.classRoomName_} because it does not exist`);
                }

                const model = this.service_.classrooms_.get(this.classRoomName_);
                if(model === undefined)
                {
                    throw new Error('This should not happen!!!!! Someone lied, classroom should exist  but got undefined');
                }

                for(const action of this.actions_)
                {
                    switch(action.type)
                    {
                        case this.ACTION_SET_COMPUTER_COUNT:
                            if(action.data.computerCount === undefined)
                            {
                                throw new Error('ACTION_SET_COMPUTER_COUNT should have computerCount as argument');
                            }

                            if(typeof(action.data.computerCount) === 'function')
                            {
                                const value = action.data.computerCount(model.computerCount);
                                model.computerCount = value
                            }
                            else
                            {
                                model.computerCount = action.data.computerCount;
                            }

                            break;

                        case this.ACTION_SET_LOCATION:
                            if(action.data.location === undefined)
                            {
                                throw new Error('ACTION_SET_LOCATION should have location as argument');
                            }

                            if(typeof(action.data.location) === 'function')
                            {
                                const value = action.data.location(model.location);
                                model.location = value
                            }
                            else
                            {
                                model.location = action.data.location;
                            }

                            break;

                        case this.ACTION_SET_NAME:
                            if(action.data.name === undefined)
                            {
                                throw new Error('ACTION_SET_NAME should have name as argument');
                            }

                            if(typeof(action.data.name) === 'function')
                            {
                                const value = action.data.name(model.name);
                                model.name = value
                            }
                            else
                            {
                                model.name = action.data.name;
                            }

                            break;

                        case this.ACTION_SET_SCHEMA_FILE:
                            if(action.data.file === undefined)
                            {
                                throw new Error('ACTION_SET_SCHEMA_FILE should have file as argument');
                            }

                            const url = await getUrlFromFile(action.data.file);

                            model.schemaUrl = url;

                            break;
                    }
                }

                this.service_.emitter_.emit(LocalClassroomService.ON_CLASSROOMS_CHANGE);
            })();
        }

        setComputerCount(computerCount: SetStateAction<number>): ClassroomUpdateBuilder
        {

            this.actions_.push({type: this.ACTION_SET_COMPUTER_COUNT, data: {computerCount: computerCount}});
            return this;
        }

        setLocation(location: ((prevState: string) => string) | string): ClassroomUpdateBuilder
        {
            this.actions_.push({type: this.ACTION_SET_LOCATION, data: {location: location}});
            return this;
        }

        setName(name: ((prevState: string) => string) | string): ClassroomUpdateBuilder
        {
            this.actions_.push({type: this.ACTION_SET_NAME, data: {name: name}});
            return this;
        }

        setSchemaFile(file: File): ClassroomUpdateBuilder
        {
            this.actions_.push({type: this.ACTION_SET_SCHEMA_FILE, data: {file: file}});
            return this;
        }

    }

}

export function getUrlFromFile(file: File): Promise<string>
{
    const fileReader = new FileReader();
    const promise = new Promise<string>((resolve, reject) =>
    {

        fileReader.onload = (ev)=>
        {
            if(fileReader.result !== null && typeof(fileReader.result) === 'string')
            {
                resolve(fileReader.result);
            }
            else
            {
                reject(new Error('FileReader dose not have result after onLoad event or it is not string'));
            }

        };
    });

    fileReader.readAsDataURL(file);

    return promise;

}
