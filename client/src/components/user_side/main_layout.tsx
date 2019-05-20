import * as React from 'react';
import {useCallback, useState} from "react";

import {Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse} from 'reactstrap';
import {Container, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faQuestionCircle, faChalkboardTeacher} from '@fortawesome/free-solid-svg-icons';

import {Link} from "react-router-dom";


type Props<T> =
    Readonly<{
        children: React.ReactNode
    }>;

export function MainLayout(props: Props<{}>): React.ReactElement {

    let [isDrawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = useCallback(() => {
        setDrawerOpen((prevState) => {
            return !prevState;
        });
    }, [setDrawerOpen]);

    return (
        <React.Fragment>
            <Navbar color={'light'} light expand={'md'}>
                <NavbarBrand>Turing</NavbarBrand>
                <NavbarToggler onClick={toggleDrawer}/>
                <Collapse isOpen={isDrawerOpen} navbar>
                    <Nav className='ml-auto' navbar>
                    <NavItem style={{marginRight:10}}>
                    <Link to={'/'} className='nav-link'>
                    <FontAwesomeIcon icon={faHome} size={'1x'}/>
                    Home
                    </Link>
                    </NavItem>

                    <NavItem style={{marginRight:10}}>
                    <Link to={'/classrooms'} className='nav-link'>
                    <FontAwesomeIcon icon={faChalkboardTeacher} size={'1x'}/>
                    Classrooms
                    </Link>
                    </NavItem>

                    <NavItem>
                    <Link to={'/tutorial'} className='nav-link'>
                    <FontAwesomeIcon icon={faQuestionCircle} size={'1x'}/>
                    Tutorial
                    </Link>
                    </NavItem>

                    </Nav>
                    </Collapse>
            </Navbar>

            <Container style={{flexGrow:1, overflowY:'auto'}}>
                <Row>
                    <Col>
                        {props.children}
                    </Col>
                </Row>
            </Container>


        </React.Fragment>

    )
}
