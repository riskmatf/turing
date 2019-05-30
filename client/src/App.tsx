import React, {useEffect} from 'react';
import {ServiceLocator as UserServiceLocator} from "./services/user_side/serviceLocator";
import {
    RemoteClassroomService as UserRemoteClassroomService
} from './services/user_side/remote_classroom_service';
// import {LocalClassroomService} from './services/user_side/local_classroom_service';
import {RemoteReportService as UserRemoteReportService} from "./services/user_side/remote_report_service";
import {ServiceLocator as AdminServiceLocator} from './services/admin_side/service_locator';
import {RemoteReportService as AdminRemoteReportService} from './services/admin_side/remote_report_service';
import {RemoteClassroomService as AdminRemoteClassroomService} from './services/admin_side/remote_classroom_service';

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
import {RemoteAuthService} from './services/admin_side/remote_auth_service';
import {SignUpPage} from './components/admin_side/sign_up_page';
import {useForceRender} from "./utils/force_render";

/**
 * Here register all services that you need for program
 * ServiceLocator.registerAudioService(new AudioServiceImpl())
 */

UserServiceLocator.registerClassroomService(new UserRemoteClassroomService());
// UserServiceLocator.registerClassroomService(new LocalClassroomService());
UserServiceLocator.registerReportService(new UserRemoteReportService());

AdminServiceLocator.registerReportService(new AdminRemoteReportService());
AdminServiceLocator.registerClassroomService(new AdminRemoteClassroomService());
AdminServiceLocator.registerAuthService(new RemoteAuthService());


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

    // console.log(service.isLogedIn());

    useEffect(()=>
    {
        const sub = service.onLogedInChange(forceRender);
        setTimeout(()=>forceRender(), 0);
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
                <Route path={'/admin/add'} component={SignUpPage}/>
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
