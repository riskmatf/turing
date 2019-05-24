import * as React from 'react';
import {Classroom} from "../../models/user_side/classroom";
import {CardBody, Card, CardHeader, CardImg, Row, Col} from "reactstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTimes, faMinus, faEdit, faPlus} from '@fortawesome/free-solid-svg-icons';
import {useCallback} from "react";

type Props =
    Readonly<{
        classroom: Classroom;
        onClassroomRemove: (classroom: string)=>void;
    }>;

export function ClassroomDisplay(props: Props): React.ReactElement
{
    const onClassroomRemove = useCallback(()=>
    {
        props.onClassroomRemove(props.classroom.name);
    }, [props.onClassroomRemove, props.classroom.name]);

    return (
        <Card>
            <CardHeader>
                <Row className='justify-content-between'>
                    <Col xs='auto'>
                        <h3>{props.classroom.name}</h3>
                    </Col>

                    <Col xs='auto'>
                        <Row>
                            <Col xs='auto' onClick={onClassroomRemove}>
                                <FontAwesomeIcon icon={faMinus} className='text-danger'/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </CardHeader>

            <Link to={`/admin/classrooms/${props.classroom.name}`} style={{color:'inherit', textDecoration: 'none'}}>
                <CardImg  src={'https://via.placeholder.com/150'} top/>

                <CardBody>
                    Computer count: {props.classroom.computerCount}
                </CardBody>
            </Link>
        </Card>
    );
}