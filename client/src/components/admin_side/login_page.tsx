import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Col, Row, Card, CardTitle, CardBody, Form, FormGroup, Label, Input, Button} from "reactstrap";
import {useCallback, useState} from "react";
import {ServiceLocator} from "../../services/admin_side/service_locator";
import {async} from "q";

type Props =
    Readonly<{

    }> & RouteComponentProps<{}>

export function LoginPage(props: Props): React.ReactElement
{
    const service = ServiceLocator.getAuthService();
    const [userName, setUserName] = useState('');
    const [passsword, setPassword] = useState('');
    const [success, setSuccess] = useState(true);

    const onUserNameChanged = useCallback((e)=>
    {
        setUserName(e.target.value);
    }, [setUserName]);

    const onPasswordChanged = useCallback((e)=>
    {
        setPassword(e.target.value);
    }, [setPassword]);

    const onLogin = useCallback(()=>
    {
        (async ()=>
        {
            const success = await service.login(userName, passsword);
            if(success)
            {
                props.history.replace('/admin/feed');
            }
            else
            {
                console.log('failed');
                setSuccess(false);
            }

        })();

    }, [setSuccess, props.history, userName, passsword]);

    return (
        <React.Fragment>
            <Row style={{height: '100%'}} className='justify-content-center align-items-center'>
                <Col xs='10' md='4'>
                    <Card className='bg-light'>
                        <h3 style={{textAlign: 'center', marginTop: '1.5rem'}}>Login</h3>
                        <CardBody>
                            <Form title='Login'>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input type='text' placeholder='Username' onChange={onUserNameChanged}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input type='password' placeholder='Password' onChange={onPasswordChanged}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label style={{color:'red'}}>
                                        {
                                            !success &&
                                                'Login failed'
                                        }
                                    </Label>
                                </FormGroup>

                                <FormGroup>
                                    <Button color='primary' onClick={onLogin}>
                                        Login
                                    </Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

