import * as React from 'react';
import {match, RouteComponentProps} from "react-router";
import {useClassroom } from "../services/user_side/i_classroom_service";
import {useForceRender} from "../utils/force_render";
import {SvgShema} from "./svg_shema";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ReportData, useReportsForClassroom} from "../services/user_side/i_report_service";
import {Col, Row, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ListGroup} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {Report, ReportType} from "../models/user_side/report";
import {Hook} from "../utils/hook";
import {ReportView} from "./report_view";
import {ReportEditor} from "./report_editor";
import {ServiceLocator} from "../services/user_side/serviceLocator";

type BodyProps =
    Readonly<{
}> & RouteComponentProps<{id: string}>;


export function BodyPart(props: BodyProps): React.ReactElement | null
{
    const [reportsDidChange, forceRender] = useForceRender();
    const classroom = useClassroom(props.match.params.id, forceRender);
    const [toggleErrors, setToggleErrors]: Hook<Array<(t: boolean)=>void> | undefined> = useState();
    const reports = useReportsForClassroom(props.match.params.id, forceRender);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData]: Hook<ModalData | undefined> = useState();


    const computerNotFixedReports = useMemo(()=>
    {
        let res = new Map<number, Array<Report>>();

        for(const rep of reports.reports)
        {
            /*In case of type = computer report idComputer should not be undefined but ts forces us to check*/
            if(rep.type === Report.TYPE_COMPUTER_REPORT && !rep.fixed && rep.idComputer !== undefined)
            {
                if(res.has(rep.idComputer))
                {
                    const temp = res.get(rep.idComputer);
                    if(temp !== undefined)
                    {
                        temp.push(rep);
                    }
                }
                else
                {
                    res.set(rep.idComputer, [rep]);
                }
            }
        }


        return res;

    }, [reportsDidChange]);
    const otherReportsNotFixed = useMemo(()=>
    {
        return reports.reports.filter(value=>
        {
            return value.type !== Report.TYPE_COMPUTER_REPORT && !value.fixed;
        });
    }, [reportsDidChange]);

    let reportsToShow: Array<Report> | undefined = undefined ;

    if(modalData !== undefined)
    {
        if(modalData.reportType === Report.TYPE_COMPUTER_REPORT && modalData.idComputer !== undefined)
        {
            reportsToShow = computerNotFixedReports.has(modalData.idComputer) ?
                computerNotFixedReports.get(modalData.idComputer) : [];
        }
        else if(modalData.reportType !== Report.TYPE_COMPUTER_REPORT)
        {
            reportsToShow = otherReportsNotFixed;
        }
    }

    /**
     * Sets error symbols on computers when ever report data changes
     */
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

        for(let it = computerNotFixedReports.keys(), curr = it.next(); !curr.done; curr = it.next())
        {
            toggleErrors[curr.value-1](true);
        }
    }, [reportsDidChange, toggleErrors]);

    const onLoad = useCallback((arr: Array<(value: boolean)=>void>)=>
    {
        setToggleErrors(arr);
    }, [setToggleErrors]);

    const onToggleModal = useCallback(()=>
    {
        setModalOpen(prevState => !prevState);
    }, [setModalOpen]);

    const onComputerClicked = useCallback((idComp: number)=>
    {
        setModalData(
            {
                idComputer: idComp,
                reportType: Report.TYPE_COMPUTER_REPORT,
                title: `Reports for computer #${idComp}`
            });
        onToggleModal();

    }, [onToggleModal, setModalData]);

    const onAddOtherButtonClicked = useCallback(()=>
    {
        setModalData(
            {
                idComputer: undefined,
                reportType: Report.TYPE_OTHER_REPORT,
                title: 'Other reports'
            });
        onToggleModal();
    }, [onToggleModal, setModalData]);

    if(classroom.classroom === undefined)
    {
        return null;
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <Row className='justify-content-between'>
                                <Col xs='auto'>
                                    <h3>{classroom.classroom.name}</h3>
                                </Col>

                                <Col xs='auto'>
                                    <Button onClick={onAddOtherButtonClicked}>Dodaj uopsten kvar</Button>
                                </Col>
                            </Row>
                        </CardHeader>

                        <CardBody>
                            <SvgShema url={classroom.classroom.schemaUrl} numOfEl={classroom.classroom.computerCount}
                            onLoad={onLoad} onClick={onComputerClicked}/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {
               modalData !== undefined && reportsToShow !== undefined &&
               <ModalComponetn reports={reportsToShow}
                                title={modalData.title}
                                isOpen={isModalOpen}
                                toggleOpenModal={onToggleModal}
                               reportType={modalData.reportType}
                               idComputer={modalData.idComputer}
                               classroom={classroom.classroom.name}
                />
            }


        </React.Fragment>
    );
}

type ModalData =
    {
        title: string;
        reportType: ReportType;
        idComputer?: number;
    };

type ModalProps =
    Readonly<
        {
            reports: Array<Report>;
            title: string;
            isOpen: boolean;
            toggleOpenModal: ()=>void;
            reportType: ReportType;
            idComputer?: number;
            classroom: string;
        }>;

function ModalComponetn(props: ModalProps): React.ReactElement
{
    if(props.reportType !== Report.TYPE_COMPUTER_REPORT && props.idComputer !== undefined)
    {
        //throw new Error('idComputer has to be undefined if reportType is not computer report');
    }

    if(props.reportType === Report.TYPE_COMPUTER_REPORT && props.idComputer === undefined)
    {
        //throw new Error('idComputer can not be undefined if report type is computer report');
    }


    /**
     * What page modal is on:
     * 0 - list of all reports
     * 1 - Detail about report
     * 2 - Adding new report
     */
    const [modalPage, setModalPage] = useState(0);
    const [currentReport, setCurrentReport]: Hook<Report | undefined> = useState();

    const onClosed = useCallback(()=>
    {
        setModalPage(0);
        setCurrentReport(undefined);
    }, [setModalPage, setCurrentReport]);

    const onAddButtonClicked = useCallback(()=>
    {
        setModalPage(2);
    }, [setModalPage]);

    const onBackButtonClicked = useCallback(()=>
        {
            setModalPage(0);
            setCurrentReport(undefined);
        }, [setModalPage, setCurrentReport]);

    const onReportDone = useCallback((reportData: ReportData | undefined)=>
    {
        setModalPage(0);
        if(reportData !== undefined)
        {
            ServiceLocator.getReportService().addReport(reportData);
        }
    }, [setModalPage]);

    const reportsJSX = props.reports.map(value =>
    {
        return (
            <ReportView key={value.idReport}
                        report={value}
                        inline
                        onClick={()=>
                        {
                            setCurrentReport(value);
                            setModalPage(1);
                        }}
            />
            )
    });


    return (
        <Modal isOpen={props.isOpen} toggle={props.toggleOpenModal}
               contentClassName='full-screen-modal'
               className='full-screen-modal'
               /*Important because if this is not set then when you open it after it is closed you will be stuck at last
               * page opened*/
                onClosed={onClosed}
        >
            <ModalHeader toggle={props.toggleOpenModal}>
                {props.title}
            </ModalHeader>

            <ModalBody style={{overflowY: 'auto'}}>
                {
                    modalPage === 0 &&
                        <React.Fragment>
                            <Row className='justify-content-end mb-2'>
                                <Col xs='auto'>
                                    <Button onClick={onAddButtonClicked}>
                                        Add
                                    </Button>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <ListGroup>
                                        {
                                            reportsJSX
                                        }
                                    </ListGroup>
                                </Col>
                            </Row>
                        </React.Fragment>
                }
                {
                    modalPage === 1 && currentReport !== undefined &&
                        <React.Fragment>
                            <Row>
                                <Col xs='auto' onClick={onBackButtonClicked}>
                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ReportView report={currentReport}/>
                                </Col>
                            </Row>
                        </React.Fragment>

                }
                {
                    modalPage === 2 &&
                        <ReportEditor onDone={onReportDone}
                                      predefinedData=
                                          {
                                              {
                                                  type: props.reportType,
                                                  idComputer: props.idComputer,
                                                  date: new Date().getTime(),
                                                  classroomName: props.classroom
                                              }
                                          }/>
                }
            </ModalBody>
        </Modal>
    );
}
