import * as React from 'react';
import {useClassrooms} from "../../services/user_side/i_classroom_service";
import {useForceRender} from "../../utils/force_render";
import {Link, match} from 'react-router-dom';
import {useMemo, useState} from "react";
import {Classroom} from "../../models/user_side/classroom";
import {Card, CardBody, CardHeader, CardImg, Col, Row, UncontrolledCollapse} from "reactstrap";
import {ClassroomDisplay} from "./classroom_display";

type AppBarProps  =
    Readonly<{

    }>;


type BodyProps =
    Readonly<{
        match: match<void>
    }>;

export function BodyPart(props: BodyProps): React.ReactElement
{
    const [value, forceRender] = useForceRender();
    const classrooms = useClassrooms(forceRender);

    const classroomJSX = useMemo(()=>
    {
        console.log('hi');

        const devided = new Map<string, Array<Classroom>>();

        for(const classroom of classrooms.classrooms)
        {
            if(devided.has(classroom.location))
            {
                const tmp = devided.get(classroom.location);
                if(tmp !== undefined)
                {
                    tmp.push(classroom);
                }
            }
            else
            {
                devided.set(classroom.location, [classroom]);
            }
        }

        let res = [];
        for(let it = devided.entries(), curr = it.next(); !curr.done; curr = it.next())
        {
            const location = curr.value[0];
            const classroomsArr = curr.value[1];
            const classroomsInLocationJSX= classroomsArr.map(value=>
            {
                return (
                    <Col xs='12' md='4' className='mb-2'>
                       <ClassroomDisplay classroom={value}/> 
                    </Col>
                );
            });

            res.push(
                (
                    <Card className='mb-2'>
                        <CardHeader id={`location_${location}_toggler`}>
                            <h3>{location}</h3>
                        </CardHeader>

                        <UncontrolledCollapse toggler={`location_${location}_toggler`} isOpen={true}>
                            <CardBody>
                                <Row className='justify-content-center'>
                                    {classroomsInLocationJSX}
                                </Row>
                            </CardBody>
                        </UncontrolledCollapse>
                    </Card>
                ),
            );
        }

        return res;
    }, [value]);


    return (
        <Row>
            <Col>
                {classroomJSX}
            </Col>
        </Row>
    );
}