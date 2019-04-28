import * as React from 'react';
import {RouteComponentProps} from "react-router";
import {Grid, Paper, Typography} from "@material-ui/core";

// Create a union of props we need and add
// the information given by Route from React.
type Props = Readonly<{

}> & RouteComponentProps;

export function HomePage(props: Props): React.ReactElement
{
    return (
        <React.Fragment>
            {/*TODO - set new logo*/}
            <div className='hv-center-container'>
                <img src='/turing/assets/img/logo.png' alt='Turing Logo' />
            </div>

            {/*TODO - fix the layout etc...*/}
            <Paper style={{margin: '20px', width: '100%'}} elevation={1}>
                <Typography variant="h4" component="h3">
                    Turing
                </Typography>
                <Typography component="p">
                   Projekat Turing je platforma namenjena prikazivanju informacija o računarskoj
                   opremi u okviru Matematičkog fakulteta. Platforma u realnom vremenu omogućava
                   administratorima i korisnicima da prate i ažuriraju stanje računarske opreme.
                </Typography>
                <Typography component="p">
                </Typography>
                <Typography component="p">
                    Projekat je izveden u okviru
                    organizacije <a target='_blank'href='http://risk.matf.bg.ac.rs/'>RISK</a>
                    { ' ' } sa ciljem da unapredi funkcionisanje Računarske laboratorije
                    i olakša održavanje računarske opreme.
                </Typography>
            </Paper>

        </React.Fragment>
    );
}