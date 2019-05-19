import * as React from 'react';
import {Report} from "../../models/user_side/report";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {faCheck, faTimes, faMinus, faEdit, faPlus} from '@fortawesome/free-solid-svg-icons';
import {useCallback, useEffect, useRef, useState} from "react";
import {YesNoDialog} from "../yes_no_dialog";
import {ServiceLocator} from "../../services/admin_side/service_locator";
import {SvgShema} from "../svg_shema";
import {Classroom} from "../../models/admin_side/classroom";
import {useClassroom} from "../../services/admin_side/i_classroom_service";
import {useForceRender} from "../../utils/force_render";


type Props =
    Readonly<{
        report: Report;
        inline?: boolean;
        onClick?: ()=>void;
        classroom?: boolean;
        idComputer?: boolean;
        soleReport?: (reportId: number)=>void;
        removeReport?: (reportId: number)=>void;
    }>;

export function ReportView(props: Props): React.ReactElement
{
    if(props.inline)
    {
        return inlineReportViewJSX(props);
    }
    else
    {

        return <ExtendedReportView {...props}/>
    }
}


function ExtendedReportView(props: Props): React.ReactElement
{
    const [confirmDialogData, setConfirmDialogData] = useState(
        {
            body: 'Ova operacija ne moze da se ponisti da li ste sigurni da zelite da uradite?',
            noText: 'Ne, obustavi',
            yesText: 'Da, nastavi',
            open: false,
            title: ''
        });

    const [computerDialogOpen, setComputerDialogOpen] = useState(false);
    const [, forceRender] = useForceRender();
    const classroomApi = useClassroom(props.report.classroomName, forceRender);


    const onAcceptedAction = useRef<()=>void>();

    const onConfirmDialogAnswer = useCallback((answer:boolean)=>
    {
        if(answer)
        {
            if(onAcceptedAction.current !== undefined)
            {
                onAcceptedAction.current();
                onAcceptedAction.current = undefined;
            }
            else
            {
                throw new Error('Action confirmed but action not set');
            }
        }
        else
        {
            onAcceptedAction.current = undefined;
        }
    }, [onAcceptedAction]);

    const toggleConfirmDialog = useCallback(()=>
    {
        setConfirmDialogData(prevState => ({...prevState, open:!prevState.open}));
    }, [setConfirmDialogData]);

    const onReportRemoved = useCallback(()=>
    {
        if(props.removeReport !== undefined)
        {
            onAcceptedAction.current = ()=>
            {
                if(props.removeReport !== undefined)
                {
                    props.removeReport(props.report.idReport);
                }
            }
            toggleConfirmDialog();
        }
        else
        {
            throw new Error('Remove report does not exist so you should not be here');
        }

    }, [props.report.idReport, props.removeReport, onAcceptedAction, toggleConfirmDialog]);

    const onReporortSolved = useCallback(()=>
    {
        if(props.removeReport !== undefined)
        {
            onAcceptedAction.current = ()=>
            {
                if(props.soleReport!== undefined)
                {
                    props.soleReport(props.report.idReport);
                }
            }
            toggleConfirmDialog();
        }
        else
        {
            throw new Error('Solve report does not exist so you should not be here');
        }

    }, [props.soleReport, props.report.idReport, onAcceptedAction, toggleConfirmDialog]);

    const onCommentChanged = useCallback((comment: string)=>
    {
        ServiceLocator.getReportService().updateReport(props.report.idReport).addAdminComment(comment).executeUpdate();
    }, [props.report.idReport]);

    const onCommentRemoved = useCallback(()=>
    {
        onAcceptedAction.current = ()=>
        {
            ServiceLocator.getReportService().updateReport(props.report.idReport).removeComment().executeUpdate();
        };

        toggleConfirmDialog();

    }, [props.report.idReport, onAcceptedAction]);

    const toggleComputerDialog = useCallback(()=>
    {
        setComputerDialogOpen(prevState => !prevState);
    }, [setComputerDialogOpen]);

    const onSchemaLoaded = useCallback((fn: (id: number)=>void)=>
    {
        if(props.report.idComputer !== undefined)
        {
            fn(props.report.idComputer);
        }
    }, []);

    const date = new Date(props.report.date);
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
            {
                /*Buttons on top for removing and solving reports*/
                (props.removeReport !== undefined || props.soleReport !== undefined) &&
                <Row className='justify-content-end mb-2'>
                    {
                        props.removeReport !== undefined &&
                        <Col xs='auto'>
                            <Button color='danger' onClick={onReportRemoved}>
                                Remove
                            </Button>
                        </Col>
                    }


                    {
                        props.soleReport !== undefined &&
                        <Col xs='auto'>
                            <Button color='success' onClick={onReporortSolved}>
                                Solve
                            </Button>
                        </Col>
                    }

                </Row>
            }


            {/*Report id and date row*/}
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

            {/*Type classroom and computer id row*/}
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
                        <Row>
                            <Col xs='12' md='auto'>
                                <b>Computer</b> #{props.report.idComputer}
                            </Col>
                            <Col xs='12' md='auto' onClick={toggleComputerDialog}>
                                <FontAwesomeIcon icon={faQuestionCircle}/>
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>

            <hr/>

            {/*Description row*/}
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
                    <EditComment report={props.report} onRemove={onCommentRemoved} onChange={onCommentChanged}/>
                </Col>
            </Row>

            <YesNoDialog answer={onConfirmDialogAnswer}
                         toggle={toggleConfirmDialog}
                         title={confirmDialogData.title}
                         body={confirmDialogData.body}
                         isOpen={confirmDialogData.open}
                         yesText={confirmDialogData.yesText}
                         noText={confirmDialogData.noText}
            />


            {
                classroomApi.classroom !== undefined &&
                computerModal(
                {
                    onSchemaLoaded: onSchemaLoaded,
                    classroom: classroomApi.classroom,
                    toggler: toggleComputerDialog,
                    isOpen: computerDialogOpen,
                    report: props.report
                })
            }


        </React.Fragment>
    );
}

function inlineReportViewJSX(props: Props): React.ReactElement
{
    const envelopeColor = props.report.isAdminCommentSet() ? 'green' : 'gray';
    /*Possible optimization to remember this value instead of creating new every render*/
    const date = new Date(props.report.date);

    return (
        <ListGroupItem action onClick={props.onClick}>
            <Row className='justify-content-between'>
                <Col xs='auto'>
                    Report #{props.report.idReport}
                </Col>

                {
                    props.classroom&&
                    <Col xs='auto' className='d-none d-md-flex'>
                        Classroom: {props.report.classroomName}
                    </Col>
                }

                {
                    props.idComputer&&
                    <Col xs='auto' className='d-none d-md-flex'>
                        ComputerId: {props.report.idComputer}
                    </Col>
                }

                <Col xs='auto'>
                    <FontAwesomeIcon icon={faEnvelope} style={{color: envelopeColor}}/>
                </Col>
            </Row>

            {
                (props.classroom || props.idComputer) &&
                <Row className='d-md-none justify-content-center'>
                    {
                        props.classroom&&
                        <Col xs='auto'>
                            Classroom: {props.report.classroomName}
                        </Col>
                    }

                    {
                        props.idComputer&&
                        <Col xs='auto'>
                            ComputerId: {props.report.idComputer}
                        </Col>
                    }
                </Row>
            }

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

type EditCommentProps =
    Readonly<{
        report: Report;
        onRemove: ()=>void;
        onChange: (comment: string)=>void;
    }>;

function EditComment(props: EditCommentProps): React.ReactElement
{
    const [editingData, setEditingData] = useState({inEditing: false, currentComment: ''});

    const toggleEditing = useCallback(()=>
    {
        setEditingData(prevState =>
        {
            if(prevState.inEditing)
            {
                return {inEditing: false, currentComment: ''};
            }
            else
            {
                return (
                    {
                        inEditing: true,
                        currentComment: props.report.isAdminCommentSet() ? props.report.adminComment : ''
                    });
            }
        });
    }, [setEditingData, props.report]);

    const onRemove = useCallback(()=>
    {
        props.onRemove();
    }, []);

    const onAccepted = useCallback(()=>
    {
        props.onChange(editingData.currentComment);
        toggleEditing();

    }, [toggleEditing, editingData.currentComment]);

    const onRejected = useCallback(()=>
    {
        toggleEditing();
    }, [toggleEditing]);

    const onCommentChanged = useCallback((comment: string)=>
    {
        setEditingData(prevState => ({...prevState, currentComment: comment}));
    }, [setEditingData]);


    return (
        <Card>
            <CardHeader>
                <Row className='justify-content-between'>
                    <Col xs='auto'>
                        Admin comment:
                    </Col>

                    <Col xs='auto'>
                        {
                            actionButtonsJSX(
                                {
                                    report: props.report, editing: editingData.inEditing,
                                    toggleEditing: toggleEditing, onRemove: onRemove, onAccepted: onAccepted,
                                    onRejected: onRejected
                                })
                        }
                    </Col>
                </Row>
            </CardHeader>

            <CardBody>
                {
                    editingPartJSX(
                        {
                            report: props.report,
                            isEditing: editingData.inEditing,
                            currentComment: editingData.currentComment,
                            onCommentChange: onCommentChanged
                        })
                }
            </CardBody>
        </Card>
    );
}

type ActionButtonsJSXProps =
    Readonly<{
        report: Report;
        editing: boolean;
        toggleEditing: ()=>void;
        onAccepted: ()=>void;
        onRejected: ()=>void;
        onRemove: ()=>void;
    }>;

function actionButtonsJSX(props: ActionButtonsJSXProps): React.ReactElement | null
{
    if(props.editing)
    {
        return (
            <Row>
                <Col  xs='auto' className='text-danger' onClick={props.onRejected}>
                    <FontAwesomeIcon icon={faTimes}/>
                </Col>
                <Col xs='auto' className='text-success' onClick={props.onAccepted}>
                    <FontAwesomeIcon icon={faCheck}/>
                </Col>
            </Row>
        );
    }
    else if(props.report.isAdminCommentSet())
    {
        const currAdmin = ServiceLocator.getAuthService().whoIsLogedIn();
        if(currAdmin === undefined)
        {
            throw new Error('You should not be undefined here');
        }

        if(currAdmin.userName === props.report.idAdmin)
        {
            return (
                <Row>
                    <Col xs='auto' className='text-danger' onClick={props.onRemove}>
                        <FontAwesomeIcon icon={faMinus}/>
                    </Col>

                    <Col xs='auto' onClick={props.toggleEditing}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </Col>
                </Row>
            );
        }
        else
        {
            return null;
        }

    }
    else
    {
        return (
            <Row>
                <Col xs='auto' onClick={props.toggleEditing}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Col>
            </Row>
        );
    }
}

type EditingPartJSXProps =
    Readonly<
        {
            report: Report;
            isEditing: boolean;
            currentComment: string;
            onCommentChange: (comment: string)=>void;
        }>;

function editingPartJSX(props: EditingPartJSXProps): React.ReactElement
{
    if(!props.isEditing)
    {
        if(props.report.isAdminCommentSet())
        {
            return (
                <React.Fragment>
                    <Row>
                        <Col>
                            Admin: {props.report.idAdmin}
                        </Col>
                    </Row>

                    <Row style={{maxHeight:'20rem', overflowY: 'auto'}}>
                        <Col style={{wordWrap: 'break-word'}}>
                            {props.report.adminComment}
                        </Col>
                    </Row>
                </React.Fragment>
            );
        }
        else
        {
            return (
                <Row>
                    <Col>
                        No admin comment set
                    </Col>
                </Row>
            );
        }
    }
    else
    {
        return (
            <Row>
                <Col>
                    <Input type='textarea' value={props.currentComment}
                           onChange={e=>props.onCommentChange(e.target.value)}
                           style={{height: '20rem'}}
                    />

                </Col>
            </Row>
        )
    }
}

type ComputerModalProps =
    Readonly<{
        toggler: ()=>void;
        isOpen: boolean;
        report: Report;
        classroom: Classroom;
        onSchemaLoaded: (fn:(id: number)=>void)=>void;
    }>;

function computerModal(props: ComputerModalProps): React.ReactElement
{

    return (
        <Modal isOpen={props.isOpen} toggle={props.toggler}>
            <ModalHeader toggle={props.toggler}>
                Prikaz racunara
            </ModalHeader>

            <ModalBody>
                <SvgShema url={props.classroom.schemaUrl} numOfEl={props.classroom.computerCount}
                          onLoad={props.onSchemaLoaded}
                          onClick={()=>{}}/>
            </ModalBody>
        </Modal>
    );
}
