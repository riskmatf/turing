import React, {useCallback} from 'react';
import {ServiceLocator} from "./services/user_side/serviceLocator";
import {LocalReportService} from "./services/user_side/local_report_service";
import {LocalClassroomService} from "./services/user_side/local_classroom_service";
import {BrowserRouter, Link, Redirect, Route, Switch} from "react-router-dom";

import {MainLayout} from './components/main_layout';
import {BodyPart as ClassroomPageBodyPart} from './components/classroom_page';
import {HomePage} from './components/home_page';
import {BodyPart as SchemaBodyPart} from './components/shema_page';

/**
 * Here register all services that you need for program
 * ServiceLocator.registerAudioService(new AudioServiceImpl())
 */

ServiceLocator.registerClassroomService(new LocalClassroomService());
ServiceLocator.registerReportService(new LocalReportService());

type Props = {};

function ErrorPage(props: {}): React.ReactElement
{
    return (
        <h1>You are far from home go back</h1>
    );
}

function Body(props: Props): React.ReactElement
{
    return (
        <React.Fragment>
            <Switch>
                <Route path={'/classrooms/:id'} component={SchemaBodyPart}/>
                <Route path={'/classrooms'} component={ClassroomPageBodyPart} />
                <Route path={'/error'} component={ErrorPage}/>
                <Route exact path={'/'} component={HomePage}/>
                <Redirect to={'/error'}/>
            </Switch>
        </React.Fragment>
    );
}

export function App(props: Props): React.ReactElement {
    return (
        <BrowserRouter basename={'turing'}>
            <MainLayout body={Body}/>
        </BrowserRouter>
    );
}
