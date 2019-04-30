import * as React from 'react';
import {match, RouteComponentProps} from "react-router";
import {useClassroom } from "../services/user_side/i_classroom_service";
import {useForceRender} from "../utils/force_render";
import {SvgShema} from "./svg_shema";
import {useCallback, useEffect, useRef, useState} from "react";
import {useReportsForClassroom} from "../services/user_side/i_report_service";
import {Col, Row, Card, CardHeader, CardBody, Button} from "reactstrap";

type AppBarProps  =
    Readonly<{
    }> & RouteComponentProps<{id: string}>;


type BodyProps =
    Readonly<{
}> & RouteComponentProps<{id: string}>;

export function BodyPart(props: BodyProps): React.ReactElement | null
{
    const [value, forceRender] = useForceRender();
    const classroom = useClassroom(props.match.params.id, forceRender);
    const [toggleErrors, setToggleErrors] = useState();
    const reports = useReportsForClassroom(props.match.params.id, forceRender);

    const onLoad = useCallback((arr: Array<(value: boolean)=>void>)=>
    {
        setToggleErrors(arr);
    }, [setToggleErrors]);

    useEffect(()=>
    {
        if(toggleErrors === undefined)
        {
            return ;
        }

        for(const f of toggleErrors)
        {
            f(false);
        }

        for(const rep of reports.reports)
        {
            if(!rep.fixed)
            {
                toggleErrors[rep.idComputer-1](true);
            }
        }
    }, [value, toggleErrors]);

    const onClick = useCallback((idComp: number)=>
    {

    }, [toggleErrors ]);

    if(classroom.classroom === undefined)
    {
        return null;
    }

    return (
        <Row>
            <Col>
                <Card>
                    <CardHeader>
                        <Row className='justify-content-between'>
                            <Col xs='auto'>
                                <h3>{classroom.classroom.name}</h3>
                            </Col>

                            <Col xs='auto'>
                                <Button>Dodaj uopsten kvar</Button>
                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody>
                        <SvgShema url={classroom.classroom.schemaUrl} numOfEl={classroom.classroom.computerCount}
                                  onLoad={onLoad} onClick={onClick}/>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}
