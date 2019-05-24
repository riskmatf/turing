import * as React from 'react';
import {Row, Col, FormGroup, Label, Input, Button} from "reactstrap";
import {useCallback, useEffect, useState} from "react";
import {ClassroomData} from "../../services/admin_side/i_classroom_service";
import {Hook} from "../../utils/hook";


type Props =
    Readonly<{
        onAnswer: (classroomData?: ClassroomData)=>void;
    }>;




export function ClassroomEditor(props: Props): React.ReactElement
{
    const [classroomData, setClassroomData]: Hook<ClassroomData | undefined> = useState();

    const onFileChanged = useCallback((e)=>
    {
        const file = e.target.files[0];
        if(file === undefined)
        {
            return ;
        }

        getClassroomDataFromFile(file).then(value =>
        {
            setClassroomData({schemaFile: value.file, computerCount: value.computerCount, name: value.name,
                location: ''});
        });

    }, []);

    const onNameChange = useCallback((e)=>
    {
        const value = e.target.value;

        setClassroomData(prevState =>
        {
            if(prevState !== undefined)
            {

                return ({...prevState, name: value});
            }
        });
    }, [setClassroomData]);

    const onLocationChange= useCallback((e)=>
    {
        const value = e.target.value;

        setClassroomData(prevState =>
        {
            if(prevState !== undefined)
            {

                return ({...prevState, location: value});
            }
        });
    }, [setClassroomData]);


    const onAccept = useCallback(()=>
    {
        props.onAnswer(classroomData);
    }, [props.onAnswer, classroomData]);

    const onDecline = useCallback(()=>
    {
        props.onAnswer(undefined);
    }, [props.onAnswer]);

    const editable = classroomData !== undefined;

    return (
        <React.Fragment>
            <FormGroup>
                <Label>Schema</Label>
                <Input type='file' onChange={onFileChanged}/>
            </FormGroup>

            <FormGroup>
                <Label>Name</Label>
                <Input type='text' disabled={!editable}
                       value={classroomData !== undefined ? classroomData.name : '' }
                       onChange={onNameChange}
                />
            </FormGroup>

            <FormGroup>
                <Label>Computer Count</Label>
                <Input type='number' disabled
                       value={classroomData !== undefined ? classroomData.computerCount : 0}
                />
            </FormGroup>

            <FormGroup>
                <Label>Location</Label>
                <Input type='text' disabled={!editable}
                       value={classroomData !== undefined ? classroomData.location : ''}
                       onChange={onLocationChange}
                />
            </FormGroup>

            <FormGroup>
                <Row className='justify-content-end'>
                    <Col xs='auto'>
                        <Button color='danger'
                                onClick={onDecline}
                        >
                            Discard
                        </Button>
                    </Col>

                    <Col xs='auto'>
                        <Button color='success' disabled={!editable}
                                onClick={onAccept}
                        >
                            Accept
                        </Button>
                    </Col>
                </Row>
            </FormGroup>

        </React.Fragment>
    );
}

type ClassroomDataFromFile =
    {
        computerCount: number;
        name: string;
        file: File;
    }

function getClassroomDataFromFile(file: File): Promise<ClassroomDataFromFile>
{
    const fileReader = new FileReader();

    const promise = new Promise<ClassroomDataFromFile>((resolve, reject) =>
    {

        fileReader.onload = (ev)=>
        {
            if(fileReader.result !== null && typeof(fileReader.result) === 'string')
            {
                const text = fileReader.result;
                const regex = /comp_\d+/g;
                let compCount = 0;
                while(regex.exec(text) !== null)
                {
                    ++compCount;
                }

                const name = file.name.slice(0, file.name.lastIndexOf('.'));
                resolve({computerCount: compCount, file: file, name: name});
            }
            else
            {
                reject(new Error('FileReader dose not have result after onLoad event or it is not string'));
            }

        };
    });

    fileReader.readAsText(file);

    return promise;

}