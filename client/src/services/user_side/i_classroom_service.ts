import {Classroom} from "../../models/user_side/classroom";
import {EventSubscription} from 'fbemitter';
import {ServiceLocator} from "./serviceLocator";
import {useCallback, useEffect} from "react";

export interface IClassroomService
{
    getClassroom(classroomName: string): Classroom| undefined;
    getClassrooms(): Array<Classroom>;
    fetchClassroom(classroomName: string, force?: boolean): Promise<void>;
    fetchClassrooms(force?: boolean): Promise<void>;
    onClassroomChange(handler: ()=>void): EventSubscription;
}

export function useClassroom(classroomName: string, forceRender: ()=>void):
    {
        classroom: Classroom | undefined;
        fetchClassroom: (force?:boolean)=>Promise<void>;
    }
{
    const service: IClassroomService = ServiceLocator.getClassroomService();

    useEffect(()=>
    {
        const sub = service.onClassroomChange(forceRender);
        setTimeout(()=>forceRender(), 0);
        return ()=>
        {
        sub.remove();
        }
        }, [service, forceRender]);

    const fetchclassroom = useCallback((force?: boolean)=>
    {
        return service.fetchClassroom(classroomName, force);
        }, [classroomName, service]);

    return {classroom: service.getClassroom(classroomName), fetchClassroom: fetchclassroom};
}

export function useClassrooms(forceRender: ()=>void):
    {
        classrooms: Array<Classroom>;
        fetchClassrooms: (force?: boolean)=>Promise<void>;
    }
{
    const service: IClassroomService = ServiceLocator.getClassroomService();

    useEffect(()=>
    {
        const sub = service.onClassroomChange(forceRender);
        setTimeout(()=>forceRender(), 0);
        return ()=>
        {
           sub.remove();
        }
    }, [service, forceRender]);

    const fetchclassrooms = useCallback((force?: boolean)=>
    {
        return service.fetchClassrooms(force);
    }, [service]);

    return {classrooms: service.getClassrooms(), fetchClassrooms: fetchclassrooms};
}
