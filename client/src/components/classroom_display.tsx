import * as React from 'react';
import {Classroom} from "../models/user_side/classroom";
import {CardBody, Card, CardHeader, CardImg} from "reactstrap";
import {Link} from "react-router-dom";

type Props =
    Readonly<{
        classroom: Classroom;
    }>;

export function ClassroomDisplay(props: Props): React.ReactElement
{
    return (
        <Link to={`/classrooms/${props.classroom.name}`} style={{color:'inherit', textDecoration: 'none'}}>
            <Card>
                <CardHeader>
                    <h3>{props.classroom.name}</h3>
                </CardHeader>

                <CardImg  src={'https://via.placeholder.com/150'} top/>

                <CardBody>
                    Computer count: {props.classroom.computerCount}
                </CardBody>
            </Card>
        </Link>
    );
}