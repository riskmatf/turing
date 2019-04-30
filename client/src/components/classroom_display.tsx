import * as React from 'react';
import {Classroom} from "../models/user_side/classroom";
import {CardBody, Card, CardHeader, CardImg} from "reactstrap";

type Props =
    Readonly<{
        classroom: Classroom;
    }>;

export function ClassroomDisplay(props: Props): React.ReactElement
{
    return (
        <Card>
            <CardHeader>
                <h3>{props.classroom.name}</h3>
            </CardHeader>

            <CardImg  src={'https://via.placeholder.com/150'} top/>

            <CardBody>
                Computer count: {props.classroom.computerCount}
            </CardBody>
        </Card>
    );
}