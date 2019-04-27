import React from 'react';
import {ServiceLocator} from "./services/user_side/serviceLocator";
import {LocalClassroomService} from "./services/user_side/local_classroom_service";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import {MainLayout} from './components/mainLayout';
import {AppBarPart as MainAppBar, BodyPart as MainBodyPart} from './components/main_page';
import {AppBarPart as SchemaAppBar, BodyPart as SchemaBodyPart} from './components/shema_page';

/**
 * Here register all services that you need for program
 * ServiceLocator.registerAudioService(new AudioServiceImpl())
 */

ServiceLocator.registerClassroomService(new LocalClassroomService());

type Props = {};

function renderAppBar(): React.ReactElement
{
    return (
        <React.Fragment>
            <Switch>
                <Route path={'/classrooms/:id'} component={SchemaAppBar} />
                <Route path={'/'} component={MainAppBar} />
            </Switch>
        </React.Fragment>
    )
}

function renderBody(): React.ReactElement
{
    return (
        <React.Fragment>
            <Switch>
                <Route path={'/classrooms/:id'} component={SchemaBodyPart} />
                <Route path={'/'} component={MainBodyPart} />
            </Switch>
        </React.Fragment>
    );
    return <h1>Hello body</h1>
}

export function App(props: Props): React.ReactElement
{
    return (
        <BrowserRouter basename={'turing'}>
                <MainLayout drawerVariant={'persistent'} appBarVariant={"fixed"}
                            drawerClipped renderAppBar={renderAppBar}
                            renderBody={renderBody}

                />
        </BrowserRouter>
    );
}
