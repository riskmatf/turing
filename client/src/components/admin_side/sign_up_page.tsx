import * as React from 'react';
import {Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {useCallback, useState} from "react";
import {ServiceLocator} from "../../services/admin_side/service_locator";



export function SignUpPage(props: {}): React.ReactElement
{

    const [signUpData, setSignUpData] = useState(
        {
            displayName: '',
            userName: '',
            password: '',
            password1: ''
        });

    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState(false);

    const onDisplayChanged = useCallback((e)=>
    {
        const value = e.target.value;
        setSignUpData(prevState => ({...prevState, displayName: value}));
    }, [setSignUpData]);

    const onUserNameChanged = useCallback((e)=>
    {
        const value = e.target.value;

        setSignUpData(prevState => ({...prevState, userName: value}));
    }, [setSignUpData]);

    const onPasswordChanged = useCallback((e)=>
    {
        const value = e.target.value;

        setSignUpData(prevState => ({...prevState, password: value}));
    }, [setSignUpData]);

    const onPassword1Changed = useCallback((e)=>
    {
        const value = e.target.value;

        setSignUpData(prevState => ({...prevState, password1: value}));
    }, [setSignUpData]);

    const onSignUp = useCallback(()=>
    {
        if(signUpData.password !== signUpData.password1)
        {
            setError('Passwords dont match');
        }
        else if(signUpData.password === '')
        {
            setError('Password cant be an empty string');
        }
        else if(signUpData.displayName === '')
        {
            setError('Display name cant be an empty string');
        }
        else if(signUpData.userName === '')
        {
            setError('Username cant be an empty string');
        }
        else
        {
            ServiceLocator.getAuthService().addAdmin(
                {
                    displayName: signUpData.displayName,
                    password: signUpData.password,
                    username: signUpData.password
                })
                .then((value =>
                {
                    if(value.isError())
                    {
                        setError(value.error.message);
                    }
                    else
                    {
                        setSuccess(true);
                        setSignUpData({displayName: '', password: '', userName: '', password1: ''});
                    }
                }));
        }


    }, [signUpData]);

    return (
        <React.Fragment>
            <Row style={{height: '100%'}} className='justify-content-center align-items-center'>
                <Col xs='10' md='4'>
                    <Card className='bg-light'>
                        <h3 style={{textAlign: 'center', marginTop: '1.5rem'}}>Add admin</h3>
                        <CardBody>
                            <Form title='Add admin'>
                               <FormGroup>
                                    <Label>Display name</Label>
                                    <Input type='text' placeholder='Display name' onChange={onDisplayChanged}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input type='text' placeholder='Username' onChange={onUserNameChanged}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input type='password' placeholder='Password' onChange={onPasswordChanged}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Repeat password</Label>
                                    <Input type='password' placeholder='Repeat password' onChange={onPassword1Changed}/>
                                </FormGroup>


                                <FormGroup>
                                    <Label style={{color:'red'}}>
                                        {
                                            error !== undefined &&
                                               error
                                        }
                                    </Label>
                                </FormGroup>

                                <FormGroup>
                                    <Label style={{color:'green'}}>
                                        {
                                            success &&
                                                'Admin added'
                                        }
                                    </Label>
                                </FormGroup>

                                <FormGroup>
                                    <Button color='primary' onClick={onSignUp}>
                                        Sign up
                                    </Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}