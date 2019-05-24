import React, {useEffect} from 'react';
import {ServiceLocator as UserServiceLocator} from "./services/user_side/serviceLocator";
import {LocalReportService as UserLocalReportService} from "./services/user_side/local_report_service";
import {LocalClassroomService as UserLocalClassroomService} from "./services/user_side/local_classroom_service";
import {ServiceLocator as AdminServiceLocator} from './services/admin_side/service_locator';
import {LocalReportService as AdminLocalReportService} from './services/admin_side/local_report_service';
import {LocalClassroomService as AdminLocalClassroomService} from './services/admin_side/local_classroom_service';

import {BrowserRouter, Redirect, Route, RouteComponentProps, Switch} from "react-router-dom";
import {BodyPart as ClassroomPageBodyPart} from './components/user_side/classroom_page';
import {HomePage} from './components/user_side/home_page';
import {BodyPart as SchemaBodyPart} from './components/user_side/shema_page';
import {MainLayout as UserMainLayout} from "./components/user_side/main_layout";

import {LoginPage} from "./components/admin_side/login_page";
import {ReportsPage} from "./components/admin_side/reports_page";
import {ClassroomsPage} from "./components/admin_side/classrooms_page";
import {ClassroomPage} from "./components/admin_side/classroom_page";
import {FeedPage} from "./components/admin_side/feed_page";
import {LocalAuthService} from "./services/admin_side/local_auth_service";
import {useForceRender} from "./utils/force_render";

/**
 * Here register all services that you need for program
 * ServiceLocator.registerAudioService(new AudioServiceImpl())
 */

UserServiceLocator.registerClassroomService(new UserLocalClassroomService());
UserServiceLocator.registerReportService(new UserLocalReportService());

AdminServiceLocator.registerReportService(new AdminLocalReportService());
AdminServiceLocator.registerClassroomService(new AdminLocalClassroomService());
AdminServiceLocator.registerAuthService(new LocalAuthService());


type Props = {};

function ErrorPage(props: {}): React.ReactElement
{
    return (
        <h1>You are far from home go back</h1>
    );
}

function AdminRoutes(props: RouteComponentProps): React.ReactElement | null
{
    const service = AdminServiceLocator.getAuthService();
    const [, forceRender] = useForceRender();

    useEffect(()=>
    {
        const sub = service.onLogedInChange(forceRender);

        return ()=>
        {
            sub.remove();
        }
    }, [service, forceRender]);

    if(service.isLogedIn() === undefined)
    {
        return null;
    }

    if(service.isLogedIn() === false)
    {
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path={'/admin'} component={LoginPage}/>
                    <Redirect to={'/admin'}/>
                </Switch>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Switch>
                <Route path={'/admin/feed'} component={FeedPage}/>
                <Route path={'/admin/reports'} component={ReportsPage}/>
                <Route path={'/admin/classrooms/:id'} component={ClassroomPage}/>
                <Route path={'/admin/classrooms'} component={ClassroomsPage}/>
                <Route exact path={'/admin'} render={(props)=>{props.history.replace('/admin/feed'); return null;}}/>
                <Redirect to={'/error'}/>
            </Switch>
        </React.Fragment>
    );
}

function ClientRoutes(props: RouteComponentProps): React.ReactElement
{
    return (
        <UserMainLayout>
            <Switch>
                <Route path={'/classrooms/:id'} component={SchemaBodyPart}/>
                <Route path={'/classrooms'} component={ClassroomPageBodyPart} />
                <Route path={'/error'} component={ErrorPage}/>
                <Route exact path={'/'} component={HomePage}/>
                <Redirect to={'/error'}/>
            </Switch>
        </UserMainLayout>
    );
}

export function App(props: Props): React.ReactElement {
    return (
        <BrowserRouter basename={'turing'}>
            <Switch>

                {/*Admin routes*/}
                <Route path={'/admin'} component={AdminRoutes}/>
                {/*Client routes*/}
                <Route path={'/'} component={ClientRoutes}/>
            </Switch>

        </BrowserRouter>
    );
}
