import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {withMainLayout} from "./main_layout";
import {useForceRender} from "../../utils/force_render";
import {useClassroom} from "../../services/admin_side/i_classroom_service";
import {Hook} from "../../utils/hook";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useReportForClassroom} from '../../services/admin_side/i_report_service';
import {Report, ReportType} from "../../models/admin_side/report";
import {ReportEditor} from "../user_side/report_editor";
import {Button, Card, CardBody, CardHeader, Col, ListGroup, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {SvgShema} from "../svg_shema";
import {ServiceLocator} from "../../services/admin_side/service_locator";
import {ReportView} from "./report_view";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {ReportData} from "../../services/admin_side/i_report_service";

type Props =
    Readonly<{

    }> & RouteComponentProps<{id: string}>

function ClassroomPage_(props: Props): React.ReactElement | null
{
    const [reportsDidChange, forceRender] = useForceRender();
    const classroom = useClassroom(props.match.params.id, forceRender);
    const [toggleErrors, setToggleErrors]: Hook<{fn?: (id:number, visible: boolean)=>void}> = useState({});
    const reports = useReportForClassroom(props.match.params.id, forceRender);

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
        if(toggleErrors.fn === undefined || classroom.classroom === undefined)
        {
            return ;
        }

        for(let i = 1; i <= classroom.classroom.computerCount; ++i)
        {
            toggleErrors.fn(i, false);
        }

        for(let it = computerNotFixedReports.keys(), curr = it.next(); !curr.done; curr = it.next())
        {
            toggleErrors.fn(curr.value, true);
        }

    }, [reportsDidChange, toggleErrors, classroom.classroom]);

    const onLoad = useCallback((fn: (id: number, visible: boolean)=>void)=>
    {
        setToggleErrors({fn: fn});
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


export const ClassroomPage = withMainLayout(ClassroomPage_);
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

    const onReportSolved = useCallback((idReport: number)=>
    {
        ServiceLocator.getReportService().updateReport(idReport).setFix(true).executeUpdate();
        setModalPage(0);
    }, [setModalPage]);

    const onReportRemoved = useCallback((idReport: number)=>
    {
        ServiceLocator.getReportService().removeReport(idReport);
        setModalPage(0);
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
                                    <ReportView report={currentReport}
                                                soleReport={onReportSolved}
                                                removeReport={onReportRemoved}
                                    />
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
                                                  classroomName: props.classroom,
                                                  urgent: false
                                              }
                                          }/>
                }
            </ModalBody>
        </Modal>
    );
}
