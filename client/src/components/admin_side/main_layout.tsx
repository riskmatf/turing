import * as React from 'react';
import {Button, Col, Container, ListGroup, ListGroupItem, Navbar, NavbarBrand, Row} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faRss, faChalkboardTeacher, faFlag, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {useCallback, useState} from "react";
import {useMedia} from "../../utils/use_media";
import {useForceRender} from "../../utils/force_render";
import {ServiceLocator} from "../../services/admin_side/service_locator";
import {Link} from "react-router-dom";


type Props =
    Readonly<{
        children: React.ReactNode;
    }>;

export function MainLayout(props: Props): React.ReactElement
{
    const [isMenuBarOpen, setMenuBarOpen] = useState(false);
    const [, forceRender] = useForceRender();
    const medias = useMedia(['(min-width: 768px)'], [0], forceRender);

    const service = ServiceLocator.getAuthService();
    const user = service.whoIsLogedIn();

    const toggleMenuBar = useCallback(()=>
    {
        setMenuBarOpen(prevState => !prevState);
    }, [setMenuBarOpen]);

    const onLogout = useCallback(()=>
    {
        service.logout();
    }, [service]);

    if(user === undefined)
    {
        throw new Error('User should not be undefined if you are on this page');
    }

    const isSmallerThenMd = medias.length  < 1;

    return (
        <React.Fragment>
            <Navbar color='light' light>
                <Row className='align-items-center'>

                       <Col xs='auto' className='d-md-none' onClick={toggleMenuBar}>
                           <FontAwesomeIcon icon={faBars}/>
                       </Col>


                    <Col>
                        <NavbarBrand>
                            Turing
                        </NavbarBrand>
                    </Col>
                </Row>


            </Navbar>

            <Container fluid style={{flexGrow: 1, overflow:'hidden'}}>
                <Row style={{height: '100%', flexWrap: 'nowrap'}}>
                    {
                        /**
                         * This col will not scroll to fix it have to wrap content inside with row(col)
                         * and put scroll: auto to row
                         * <row scrollY: auto height:100%><col>....</col><row>
                         * something like this but it has to be tested
                         */
                    }
                    <Col xs='auto'
                         className='admin-main-layout bg-light'
                         style=
                             {
                                 {
                                     overflowY: 'auto',
                                     width: isSmallerThenMd ? (isMenuBarOpen ? '100%' : 0) : undefined,
                                     padding: isSmallerThenMd ? (isMenuBarOpen ? undefined : 0) : undefined
                                 }
                             }
                    >
                        <Row className='mb-2'>
                            <Col>
                                User: {user.displayName}
                            </Col>

                            <Col>
                                <Button onClick={onLogout}>
                                    Logout
                                </Button>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <ListGroup>
                                    <Link to='/admin/feed'>
                                        <ListGroupItem action >
                                            <FontAwesomeIcon icon={faRss}/>
                                            <span  style={{paddingLeft: 10}}>Feed</span>
                                        </ListGroupItem>
                                    </Link>

                                    <Link to='/admin/classrooms'>
                                        <ListGroupItem action>
                                            <FontAwesomeIcon icon={faChalkboardTeacher}/>
                                            <span style={{paddingLeft: 10}}>Classrooms</span>
                                        </ListGroupItem>
                                    </Link>

                                    <Link to='/admin/reports'>
                                        <ListGroupItem action>
                                            <FontAwesomeIcon icon={faFlag}/>
                                            <span style={{paddingLeft: 10}}>Reports</span>
                                        </ListGroupItem>
                                    </Link>

                                    <Link to='/admin/add'>
                                        <ListGroupItem action>
                                            <FontAwesomeIcon icon={faUserPlus}/>
                                            <span style={{paddingLeft: 10}}>Add new admin</span>
                                        </ListGroupItem>
                                    </Link>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>

                    <Col style={{display: 'flex'}}>
                        <Container style={{flexGrow: 1}}>
                            <Row style={{height: '100%', overflowY: 'auto'}}>
                                <Col style={{paddingTop: '15px'}}>
                                    {props.children}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}

export function withMainLayout<T>(Component: React.ComponentType<T>): React.ComponentType<T>
{
    return props =>
    {
        return (
            <React.Fragment>
                <MainLayout>
                    <Component {...props}/>
                </MainLayout>
            </React.Fragment>
        )
    }
}