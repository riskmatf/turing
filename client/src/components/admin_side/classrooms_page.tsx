import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {withMainLayout} from "./main_layout";
import {useForceRender} from "../../utils/force_render";
import {ClassroomData, useClassrooms} from "../../services/admin_side/i_classroom_service";
import {useCallback, useMemo, useState} from "react";
import {Classroom} from "../../models/admin_side/classroom";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    UncontrolledCollapse
} from "reactstrap";
import {ClassroomDisplay} from "./classroom_display";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {YesNoDialog} from "../yes_no_dialog";
import {ServiceLocator} from "../../services/admin_side/service_locator";
import {ClassroomEditor} from "./classroom_editor";

type Props =
    Readonly<{

    }> & RouteComponentProps<{}>

function ClassroomsPage_(props: Props): React.ReactElement
{
    const [value, forceRender] = useForceRender();
    const classrooms = useClassrooms(forceRender);
    const [yesNoDialogData, setYesNoData]= useState(
        {isOpen: false, classroom: ''});

    const [newDialogIsOpen, setNewDialogIsOpen] = useState(false);

    const toggleYesNoDialog = useCallback(()=>
    {
        setYesNoData(prevState => ({...prevState, isOpen: !prevState.isOpen}));
    }, [setYesNoData]);

    const onYesNoDialogDataAnswer = useCallback((answer: boolean)=>
    {
        if(answer)
        {
            ServiceLocator.getClassroomService().removeClassroom(yesNoDialogData.classroom);
        }
    }, [toggleYesNoDialog, yesNoDialogData]);


    const onClassroomRemove= useCallback((classroom: string)=>
    {
        setYesNoData(prevState => ({classroom: classroom, isOpen: true}));
    }, [setYesNoData]);

    const toggleNewDialog = useCallback(()=>
    {
        setNewDialogIsOpen(prevState =>  !prevState);
    }, [setNewDialogIsOpen]);

    const onAnswerNewDialog = useCallback((answer?: ClassroomData)=>
    {
        console.log(answer);
        if(answer !== undefined)
        {
            ServiceLocator.getClassroomService().addClassroom(answer);
        }

        toggleNewDialog();

    }, [toggleNewDialog]);


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
                        <ClassroomDisplay classroom={value} onClassroomRemove={onClassroomRemove}/>
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
    }, [value, onClassroomRemove]);


    return (
        <React.Fragment>
            <Row className='justify-content-end mb-2'>
                <Col xs='auto'>
                    <Button color='success'
                            onClick={toggleNewDialog}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    {classroomJSX}
                </Col>
            </Row>

            <YesNoDialog answer={onYesNoDialogDataAnswer} title={'Da li zelite da obrisete ucionicu'}
                         body={'Ova akcija je ne moze da se ponisti'}
                         isOpen={yesNoDialogData.isOpen}
                         toggle={toggleYesNoDialog}
            />

            {
                editDialog(
                {
                    isOpen: newDialogIsOpen,
                    toggle: toggleNewDialog,
                    onAnswer: onAnswerNewDialog
                })
            }


        </React.Fragment>
    );
}

export const ClassroomsPage = withMainLayout(ClassroomsPage_);

type EditDialogProps =
    Readonly<{
        isOpen: boolean;
        toggle: ()=>void;
        onAnswer: (answer?: ClassroomData) => void;
    }>;

function editDialog(props: EditDialogProps): React.ReactElement
{
    return (
        <Modal toggle={props.toggle} isOpen={props.isOpen} className='full-screen-modal'
               contentClassName='full-screen-modal'
        >

            <ModalHeader toggle={props.toggle}>
                Add classroom
            </ModalHeader>

            <ModalBody>
                <ClassroomEditor onAnswer={props.onAnswer}/>
            </ModalBody>
        </Modal>
    );
}
