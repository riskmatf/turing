import * as React from 'react';
import {Button, Col, Row} from "reactstrap";


type Props =
    Readonly<{
        nextPage: ()=>void;
        prevPage: ()=>void;
        hasNextPage: ()=>boolean;
        hasPrevPage: ()=>boolean;
        data: React.ReactNode;
    }>;

export function Pager(props: Props): React.ReactElement
{
    return (
        <React.Fragment>
            <Row className='justify-content-end mb-2'>
                <Col xs='auto'>
                    {
                        props.hasPrevPage() &&
                        <Button onClick={props.prevPage}>
                            Prev
                        </Button>
                    }

                </Col>

                <Col xs='auto'>
                    {
                        props.hasNextPage() &&
                        <Button onClick={props.nextPage}>
                            Next
                        </Button>
                    }

                </Col>
            </Row>

            <Row>
                <Col>
                    {props.data}
                </Col>
            </Row>
        </React.Fragment>

    );
}
