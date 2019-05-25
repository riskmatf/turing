import {Classroom} from "../../models/admin_side/classroom";
import {SetStateAction, useCallback, useEffect} from "react";
import {ServiceLocator} from "./service_locator";
import {EventSubscription} from "fbemitter";

export type ClassroomData =
    {

        name:string;
        location: string;
        computerCount: number;
        schemaFile: File;
    };

export interface ClassroomUpdateBuilder
{
    setName(name: SetStateAction<string>): ClassroomUpdateBuilder;
    setLocation(location: SetStateAction<string>): ClassroomUpdateBuilder;
    setComputerCount(computerCount: SetStateAction<number>): ClassroomUpdateBuilder;
    setSchemaFile(file: File): ClassroomUpdateBuilder;
    executeUpdate(): Promise<void>;
}

export interface IClassroomService
{
    getClassrooms(): Array<Classroom>;
    fetchClassrooms(force?: boolean): Promise<void>;
    getClassroom(classroomName: string): Classroom | undefined;
    fetchClassroom(classroomName: string, force?: boolean): Promise<void>;
    addClassroom(data: ClassroomData): Promise<Classroom>;
    removeClassroom(classroomName: string): Promise<void>;
    onClassroomsChange(handler: ()=>void): EventSubscription;
}


export function useClassrooms(forceRender: ()=>void):
    {
        classrooms: Array<Classroom>;
        fetchClassrooms: (force?: boolean)=>Promise<void>;
    }

{

    const service = ServiceLocator.getClassroomService();


    const fetchClassrooms = useCallback((force?: boolean)=>
    {
        return service.fetchClassrooms(force);
    }, [service]);


    useEffect(()=>
    {
        const sub = service.onClassroomsChange(forceRender);
        setTimeout(()=>forceRender(),0 );
        return ()=>
        {
            sub.remove();
        }

    }, [service, forceRender]);

    return {
        classrooms: service.getClassrooms(),
        fetchClassrooms: fetchClassrooms
    };
}


export function useClassroom(classroomName: string, forceRender: ()=>void):
    {
        classroom: Classroom | undefined;
        fetchClassroom: (force?: boolean)=>Promise<void>;
        removeClassroom: ()=>Promise<void>;
    }
{

    const service = ServiceLocator.getClassroomService();


    useEffect(()=>
    {
        const sub = service.onClassroomsChange(forceRender);
        setTimeout(()=>forceRender(), 0);
        return ()=>
        {
            sub.remove();
        }

    }, [service, forceRender]);


    const fetchClassroom = useCallback((force?: boolean)=>
    {
        return service.fetchClassroom(classroomName, force);
    }, [service, classroomName]);


    const removeClassroom = useCallback(()=>
    {
        return service.removeClassroom(classroomName);
    }, [service, classroomName]);


    return {
        classroom: service.getClassroom(classroomName),
        fetchClassroom: fetchClassroom,
        removeClassroom: removeClassroom
    };
}