import * as React from 'react';
import {RouteComponentProps} from "react-router";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";

// Create a union of props we need and add
// the information given by Route from React.
type Props = Readonly<{

}> & RouteComponentProps;

export function HomePage(props: Props): React.ReactElement
{
    return (
        <React.Fragment>
            <Row>
            {/*TODO - set new logo*/}
                <Col>
                    <div className='hv-center-container'>
                        <img src='/turing/assets/img/logo.png' alt='Turing Logo' />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                        {/*TODO - fix the layout etc...*/}
                        <Card>
                            <CardHeader>
                                Turing
                            </CardHeader>
                            <CardBody>
                                <p>
                                   Projekat Turing je platforma namenjena prikazivanju informacija o računarskoj
                                   opremi u okviru Matematičkog fakulteta. Platforma u realnom vremenu omogućava
                                   administratorima i korisnicima da prate i ažuriraju stanje računarske opreme.
                                </p>
                                <p>
                                    Projekat je izveden u okviru
                                    organizacije <a target='_blank'href='http://risk.matf.bg.ac.rs/'>RISK</a>
                                    { ' ' } sa ciljem da unapredi funkcionisanje Računarske laboratorije
                                    i olakša održavanje računarske opreme.
                                </p>
                            </CardBody>
                        </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}