import * as React from 'react';
import {ReportData} from "../../services/user_side/i_report_service";
import {useCallback, useState} from "react";
import {Button, Col, Input, Row} from "reactstrap";
import {Report} from "../../models/user_side/report";

type Props =
    Readonly<{
        onDone: (data: ReportData | undefined)=>void;
        /*We make a new type that just does not hold description field*/
        predefinedData: {
            [K in Exclude<keyof ReportData, 'description'>]: ReportData[K]
        } ;
    }>;

export function ReportEditor(props: Props): React.ReactElement
{
    const [urgent, setUrgent] = useState(false);
    const [descr, setDescr] = useState('');
    let type = '';
    let date = new Date(props.predefinedData.date);

    const onDescrChanged = useCallback((e)=>
    {
        setDescr(e.target.value);
    }, [setDescr]);

    const onUrgentChanged = useCallback((e)=>
    {
        const value = e.target.checked;

        setUrgent(value);
    }, [setUrgent]);

    const onAccept = useCallback(()=>
    {
        props.onDone({...props.predefinedData, description: descr, urgent: urgent});
    }, [props.onDone, descr]);

    const onDecline = useCallback(()=>
    {
        props.onDone(undefined);
    }, [props.onDone, props.predefinedData]);

    if(props.predefinedData.type === Report.TYPE_COMPUTER_REPORT)
    {
        type = 'Computer report';
    }
    else if(props.predefinedData.type === Report.TYPE_OTHER_REPORT)
    {
        type = 'Other report';
    }
    else
    {
        type = 'Projector report'
    }

    return (
        <React.Fragment>
            <Row className='align-items-center mb-2'>
                {/*Type*/}
                <Col>
                    Type: {type}
                </Col>

                {/*Date*/}
                <Col>
                    Date: {`${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}.`}
                </Col>
            </Row>

            <Row className='align-items-center mb-2'>
                {/*Classroom*/}
                <Col style={{textAlign: 'center'}}>
                    Classroom: {props.predefinedData.classroomName}
                </Col>

                {/*Computer id*/}
                {
                    props.predefinedData.type === Report.TYPE_COMPUTER_REPORT &&
                    props.predefinedData.idComputer !== undefined &&
                    <Col style={{textAlign: 'center'}}>
                        Computer #{props.predefinedData.idComputer}
                    </Col>
                }
            </Row>

            <Row>
                <Col xs='auto'>
                    <Input type='checkbox' onChange={onUrgentChanged} checked={urgent} style={{marginLeft:0}}/>
                </Col>
                <Col xs='auto'>
                    Urgent
                </Col>
            </Row>

            <Row>
                <Col>
                    Description:
                </Col>
            </Row>
            <Row>
                <Col>
                    <Input type='textarea' value={descr} onChange={onDescrChanged}
                           style={{height: '14rem'}}
                    />
                </Col>
            </Row>

            <Row className='justify-content-end mt-2'>
                <Col xs='auto'>
                    <Button color='success' onClick={onAccept}>
                        Accept
                    </Button>
                </Col>

                <Col xs='auto'>
                    <Button color='danger' onClick={onDecline}>
                        Decline
                    </Button>
                </Col>
            </Row>
        </React.Fragment>
    );
}