import * as React from 'react';
import {RouteComponentProps} from "react-router";

// Create a union of props we need and add
// the information given by Route from React.
type Props = Readonly<{

}> & RouteComponentProps;

export function HomePage(props: Props): React.ReactElement
{
    // TODO Create some basic layout with the logo and welcome info...
    return (
        <React.Fragment>
            <h1>Hello from HomePage</h1>
            <img src='/turing/assets/img/logo.png' alt='Logo' />
        </React.Fragment>
    );
}