import * as React from 'react';
import {createMuiTheme, Theme, MuiThemeProvider} from '@material-ui/core/styles';
import {blue, pink} from '@material-ui/core/colors';

import {AppBar, Drawer, Grid, Paper} from '@material-ui/core';
import {useCallback, useState} from "react";

import './style.css';


export type RenderFunctionProps =
    {
        toggleDrawer: () => void,
        isDrawerOpen: boolean
    };
type Props =
    Readonly<{
        drawerClipped?: boolean;
        renderAppBar?: (props: { toggleDrawer: () => void, isDrawerOpen: boolean }) => React.ReactElement;
        renderDrawer?: (props: { toggleDrawer: () => void, isDrawerOpen: boolean }) => React.ReactElement;
        renderBody?: (props: { toggleDrawer: () => void, isDrawerOpen: boolean }) => React.ReactElement;
    }>;




const theme = createMuiTheme({
    palette:
        {
            primary: blue,
            secondary: pink
        }
});

export function MainLayout(props: Props): React.ReactElement {

    let [isDrawerOpen, setDrawerOpen] = useState(false);
    const isDrawerClipped = props.drawerClipped !== undefined ? props.drawerClipped : false;

    const toggleDrawer = useCallback(() => {
        setDrawerOpen((prevState) => {
            return !prevState;
        });
    }, [setDrawerOpen]);

    /*To change size of drawer go to style.css*/
    const drawerJSX = (
        <Paper  className='main-layout-drawer'
                style=
                    {
                        {
                            height:'100%',
                            zIndex:isDrawerClipped ? 1 : 2000,
                            position:'absolute',
                            left:0,
                            top:0,
                            width: isDrawerOpen ? undefined : '0px',
                            transition: 'width 224ms',
                            overflow: 'hidden'
                        }
                    }>
            {

                props.renderDrawer &&
                props.renderDrawer({toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
            }
        </Paper>
    );

    return (
        <MuiThemeProvider theme={theme}>
            <Grid container direction={'column'} style={{height:'100%'}} wrap={'nowrap'}>
                <Grid item>
                    <AppBar position={'relative'}>
                        {
                            props.renderAppBar &&
                            props.renderAppBar({toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
                        }
                    </AppBar>
                </Grid>

                {
                    !isDrawerClipped &&
                    drawerJSX
                }

                <Grid item
                      style=
                          {
                              {
                                  flexGrow:1,
                                  position:'relative',
                                  overflowY:isDrawerOpen ? 'hidden' : 'auto'
                              }
                          }
                >
                    {
                        isDrawerClipped &&
                        drawerJSX
                    }

                    {

                            props.renderBody &&
                            props.renderBody({toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
                    }
                </Grid>

            </Grid>
        </MuiThemeProvider>
    )
}


