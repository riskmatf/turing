import * as React from 'react';
import {Report} from "../../models/user_side/report";
import {Card, CardBody, CardHeader, Col, ListGroupItem, Row} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';


type Props =
    Readonly<{
        report: Report;
        inline?: boolean;
        onClick?: ()=>void;
    }>;

export function ReportView(props: Props): React.ReactElement
{
    const envelopeColor = props.report.isAdminCommentSet() ? 'green' : 'gray';
    /*Possible optimization to remember this value instead of creating new every render*/
    const date = new Date(props.report.date);


    if(props.inline)
    {
        return (
            <ListGroupItem action onClick={props.onClick}>
                <Row className='justify-content-between'>
                    <Col xs='auto'>
                        Report #{props.report.idReport}
                    </Col>
                    <Col xs='auto'>
                        <FontAwesomeIcon icon={faEnvelope} style={{color: envelopeColor}}/>
                    </Col>
                </Row>

                <Row>
                    <Col style={{overflow:'hidden', maxHeight: '3rem', wordWrap: 'break-word'}}>
                        {props.report.description}
                    </Col>
                </Row>

                <Row className='justify-content-end'>
                    <Col xs='auto'>
                        {
                            `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}.`
                        }
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }
    else
    {
        let reportType =  '';

        if(props.report.type === Report.TYPE_COMPUTER_REPORT)
        {
            reportType = 'Computer report';
        }
        else if(props.report.type == Report.TYPE_OTHER_REPORT)
        {
            reportType = 'Other report';
        }
        else
        {
            reportType = 'Projector report';
        }


        return (
            <React.Fragment>
                <Row className='justify-content-between'>
                    <Col xs='auto'>
                        <h3>Report #{props.report.idReport}</h3>
                    </Col>
                    <Col xs='auto'>
                        {
                            `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}.`
                        }
                    </Col>
                </Row>

                <hr/>

                <Row className='align-items-center'>
                    {/*Type*/}
                    <Col style={{textAlign: 'center'}}>
                        <b>Type</b>: {reportType}
                    </Col>

                    {/*Classroom*/}
                    <Col style={{textAlign: 'center'}}>
                        <b>Classroom</b>: {props.report.classroomName}
                    </Col>

                    {/*Computer id if it exists*/}
                    {
                        /*No need to check idComputer !== undefined but ts forces us*/
                        props.report.type === Report.TYPE_COMPUTER_REPORT && props.report.idComputer !== undefined &&
                        <Col style={{textAlign: 'center'}}>
                            <b>Computer</b> #{props.report.idComputer}
                        </Col>
                    }
                </Row>

                <hr/>

                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                Description
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col style={{wordWrap: 'break-word'}}>
                                        {props.report.description}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <hr/>

                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                Admin commnet
                            </CardHeader>
                            <CardBody>
                                {
                                    props.report.isAdminCommentSet() ?
                                        (
                                            <React.Fragment>
                                                <Row>
                                                    <Col>
                                                        Admin: {props.report.idAdmin}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        Comment:
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col style={{wordWrap: 'break-word'}}>
                                                        {props.report.adminComment}
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                        )
                                        :
                                        (
                                            <Row>
                                                <Col>
                                                    No admin comment set
                                                </Col>
                                            </Row>
                                        )
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </React.Fragment>
        );
    }
}