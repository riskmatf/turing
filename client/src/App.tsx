import React, {useCallback} from 'react';
import {ServiceLocator} from "./services/user_side/serviceLocator";
import {LocalReportService} from "./services/user_side/local_report_service";
import {LocalClassroomService} from "./services/user_side/local_classroom_service";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import {MainLayout, RenderFunctionProps} from './components/main_layout';
/*import {AppBarPart as ClassroomPageAppBar, BodyPart as ClassroomPageBodyPart} from './components/classroom_page';
import {HomePage} from './components/home_page';
import {AppBarPart as SchemaAppBar, BodyPart as SchemaBodyPart} from './components/shema_page';*/


/**
 * Here register all services that you need for program
 * ServiceLocator.registerAudioService(new AudioServiceImpl())
 */

ServiceLocator.registerClassroomService(new LocalClassroomService());
ServiceLocator.registerReportService(new LocalReportService());

type Props = {};

/*
function renderAppBar(props: RenderFunctionProps): React.ReactElement {
    // Hash the callback function and give it dependencies
    // on which to update.
    const onToggleAppBarClick = useCallback(() => {
        if (props.toggleDrawer !== undefined) {
            props.toggleDrawer();
        }
    }, [props.toggleDrawer]);

    return (
        <React.Fragment>
            <Grid container alignItems={'center'} style={{height: '100%'}}>
                <Grid item style={{height: 'auto'}}>
                    <IconButton color='inherit' onClick={onToggleAppBarClick}>
                        <MenuIcon/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <Switch>
                        <Route path={'/classrooms/:id'} component={SchemaAppBar}/>
                        <Route path={'/'} component={MainAppBar}/>
                    </Switch>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function renderBody(): React.ReactElement {
    return (
        <React.Fragment>
            <Switch>
                <Route path={'/classrooms/:id'} component={SchemaBodyPart}/>
                <Route path={'/classrooms'} component={MainBodyPart} />
                <Route path={'/'} component={HomePage}/>
            </Switch>
        </React.Fragment>
    );
}

function renderDrawer(props: RenderFunctionProps): React.ReactElement {
    return (
        <List>
            <Link to={'/'} className='navbarItem'>
                <ListItem button>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
            </Link>

            <Link to={'/tutorial'} className='navbarItem'>
                <ListItem button>
                    <ListItemIcon>
                        <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tutorial" />
                </ListItem>
            </Link>

            <Link to={'/classrooms'} className='navbarItem'>
                <ListItem button>
                    <ListItemIcon>
                        <EventSeatIcon />
                    </ListItemIcon>
                    <ListItemText primary="Classrooms" />
                </ListItem>
            </Link>
        </List>
    );
}
 */

function Body(props: {}): React.ReactElement
{
    return (
        <React.Fragment>
            <h1>hi</h1>
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
