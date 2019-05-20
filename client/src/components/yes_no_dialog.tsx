import * as React from 'react';
import {useCallback} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";


type Props =
    Readonly<{
        answer: (answer: boolean)=>void;
        title: string;
        body: string;
        yesText?: string;
        noText?: string;
        isOpen: boolean;
        toggle: ()=>void;
    }>;

export function YesNoDialog(props: Props): React.ReactElement
{
    const yes = useCallback(()=>
    {
        props.answer(true);
        props.toggle();
    }, [props.answer]);

    const no = useCallback(()=>
    {
        props.answer(false);
        props.toggle();
    }, [props.answer]);

    const yesText = props.yesText !== undefined ? props.yesText : 'yes';
    const noText = props.noText !== undefined ? props.noText : 'no';


    return (
        <Modal toggle={props.toggle} isOpen={props.isOpen}>
            <ModalHeader toggle={props.toggle}>
                {props.title}
            </ModalHeader>

            <ModalBody>
                {props.body}
            </ModalBody>

            <ModalFooter>
                <Row className='justify-content-end'>
                    <Col xs='auto'>
                        <Button color='danger' onClick={no}>
                            {noText}
                        </Button>
                    </Col>

                    <Col xs='auto'>
                        <Button color='success' onClick={yes}>
                            {yesText}
                        </Button>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    );
}