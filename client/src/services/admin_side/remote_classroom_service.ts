import {ClassroomData, ClassroomUpdateBuilder, IClassroomService} from './i_classroom_service';
import {EventEmitter, EventSubscription} from "fbemitter";
import {Classroom} from "../../models/admin_side/classroom";
import {fetchAllClassrooms, fetchClassroomByName, deleteClassroom, addClassroom} from './fetch_functions';

type Wraper =
    {
        data: Classroom | undefined;
        metaData: {time: number};
    };

export class RemoteClassroomService implements IClassroomService
{

    private static ON_CLASSROOMS_CHANGE = 'on_classrooms_change';

    private emitter_: EventEmitter;
    private classrooms_: Map<string, Wraper>;
    private static FETHC_ON = 10 * 60 * 1000;
    private allClassroomsFatched_ = 0;

    constructor()
    {
        this.emitter_ = new EventEmitter();
        this.classrooms_ = new Map<string, Wraper>();
    }


    addClassroom(data: ClassroomData): Promise<Classroom>
    {
        return (async ()=>
        {

            const res = await addClassroom(data);
            const time = new Date().getTime();

            if(res.isError())
            {
                throw res.error;
            }

            this.classrooms_.set(res.value.name, {data: res.value, metaData:{time: time}});

            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOMS_CHANGE);

            return res.value;
        })();


    }

    fetchClassroom(classroomName: string, force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            let wraper = this.classrooms_.get(classroomName);
            const time = new Date().getTime();
            if(wraper === undefined)
            {
                this.classrooms_.set(classroomName, {data: undefined,metaData:{time:time}});
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

            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOMS_CHANGE);
        })();
    }

    fetchClassrooms(force?: boolean): Promise<void>
    {
        return (async ()=>
        {
            const time = new Date().getTime();
            if(time - this.allClassroomsFatched_ >= RemoteClassroomService.FETHC_ON || force)
            {
                this.allClassroomsFatched_= time;
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
            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOMS_CHANGE);
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


    onClassroomsChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(RemoteClassroomService.ON_CLASSROOMS_CHANGE, handler);
    }

    removeClassroom(classroomName: string): Promise<void>
    {
        return (async ()=>
        {
            this.classrooms_.delete(classroomName);
            const res = await deleteClassroom(classroomName);
            if(res.isError())
            {
                throw res.error;
            }

            this.emitter_.emit(RemoteClassroomService.ON_CLASSROOMS_CHANGE);
        })();
    }

    //<editor-fold desc="Not implemented">
    // updateClassroom(classroomName: string): ClassroomUpdateBuilder
    // {
    //     return new RemoteClassroomService.ClassroomUpdateBuilder(classroomName, this);
    // }
    //</editor-fold>

    //<editor-fold desc="Not implemented">
    // private static readonly ClassroomUpdateBuilder =
    // class implements ClassroomUpdateBuilder
    // {


        // private ACTION_SET_COMPUTER_COUNT: 0 = 0;
        // private ACTION_SET_LOCATION: 1 = 1;
        // private ACTION_SET_NAME: 2 = 2;
        // private ACTION_SET_SCHEMA_FILE: 3 = 3;

        // private classRoomName_: string;
        // private service_: RemoteClassroomService;
        // private actions_: Array<{type: 0|1|2|3; data: any}>;

        // constructor(classroomName: string, service: RemoteClassroomService)
        // {
        //     this.classRoomName_ = classroomName;
        //     this.service_ = service;
        //     this.actions_ = [];
        // }

        // executeUpdate(): Promise<void>
        // {
        //     return (async ()=>
        //     {
        //         if(!this.service_.classrooms_.has(this.classRoomName_))
        //         {
        //             throw new Error(`Cant update classroom with name ${this.classRoomName_} because it does not exist`);
        //         }

                // const wrapper = this.service_.classrooms_.get(this.classRoomName_);

                // if(wrapper === undefined || wrapper.classroom === undefined)
                // {
                //     throw new Error('This should not happen!!!!! Someone lied, classroom should exist  but got undefined');
                // }
                // const model = wrapper.classroom;


                // for(const action of this.actions_)
                // {
                //     switch(action.type)
                //     {
                //         case this.ACTION_SET_COMPUTER_COUNT:
                //             if(action.data.computerCount === undefined)
                //             {
                //                 throw new Error('ACTION_SET_COMPUTER_COUNT should have computerCount as argument');
                //             }

                            // if(typeof(action.data.computerCount) === 'function')
                            // {
                            //     const value = action.data.computerCount(model.computerCount);
                            //     model.computerCount = value
                            // }
                            // else
                            // {
                            //     model.computerCount = action.data.computerCount;
                            // }

                            // break;

                        // case this.ACTION_SET_LOCATION:
                        //     if(action.data.location === undefined)
                        //     {
                        //         throw new Error('ACTION_SET_LOCATION should have location as argument');
                        //     }

                            // if(typeof(action.data.location) === 'function')
                            // {
                            //     const value = action.data.location(model.location);
                            //     model.location = value
                            // }
                            // else
                            // {
                            //     model.location = action.data.location;
                            // }

                            // break;

                        // case this.ACTION_SET_NAME:
                        //     if(action.data.name === undefined)
                        //     {
                        //         throw new Error('ACTION_SET_NAME should have name as argument');
                        //     }

                            // if(typeof(action.data.name) === 'function')
                            // {
                            //     const value = action.data.name(model.name);
                            //     model.name = value
                            // }
                            // else
                            // {
                            //     model.name = action.data.name;
                            // }

                            // break;

                        // case this.ACTION_SET_SCHEMA_FILE:
                        //     if(action.data.file === undefined)
                        //     {
                        //         throw new Error('ACTION_SET_SCHEMA_FILE should have file as argument');
                        //     }

                            // const url = await getUrlFromFile(action.data.file);

                            // model.schemaUrl = url;

                //             break;
                //     }
                // }

        //         this.service_.emitter_.emit(RemoteClassroomService.ON_CLASSROOMS_CHANGE);
        //     })();
        // }

        // setComputerCount(computerCount: SetStateAction<number>): ClassroomUpdateBuilder
        // {

        //     this.actions_.push({type: this.ACTION_SET_COMPUTER_COUNT, data: {computerCount: computerCount}});
        //     return this;
        // }

        // setLocation(location: ((prevState: string) => string) | string): ClassroomUpdateBuilder
        // {
        //     this.actions_.push({type: this.ACTION_SET_LOCATION, data: {location: location}});
        //     return this;
        // }

        // setName(name: ((prevState: string) => string) | string): ClassroomUpdateBuilder
        // {
        //     this.actions_.push({type: this.ACTION_SET_NAME, data: {name: name}});
        //     return this;
        // }

        // setSchemaFile(file: File): ClassroomUpdateBuilder
        // {
        //     this.actions_.push({type: this.ACTION_SET_SCHEMA_FILE, data: {file: file}});
        //     return this;
        // }

    // }
    //</editor-fold>

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

    fileReader.readAsText(file, 'base64');

    return promise;

}