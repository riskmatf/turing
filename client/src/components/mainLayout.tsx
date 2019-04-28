import * as React from 'react';
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery'
import {createMuiTheme, Theme, MuiThemeProvider} from '@material-ui/core/styles';
import {blue, pink} from '@material-ui/core/colors';

import {AppBar, Drawer} from '@material-ui/core';
import {useCallback, useState} from "react";

type Size =
    {
        xs: number | string;
        sm: number | string;
        md: number | string;
        lg: number | string;
        xl: number | string;
    };

type DefaultSize =
    {
        xs: number | string;
    } &
    Partial<{
        [K in Exclude<keyof Size, 'xs'>]: Size[K];
    }>;

type DrawerVariant = 'responsive' | 'persistent' | 'permanent' | 'temporary';

export type RenderFunctionProps =
    {
        toggleDrawer?: () => void,
        isDrawerOpen?: boolean
    };
type Props =
    Readonly<{
        drawerVariant: DrawerVariant
        appBarVariant: 'fixed' | 'relative';
        drawerClipped?: boolean;
        drawerWidth?: Partial<Size>;
        appBarHeight?: Partial<Size>;
        renderAppBar?: (props: { toggleDrawer?: () => void, isDrawerOpen?: boolean }) => React.ReactElement;
        renderDrawer?: (props: { toggleDrawer?: () => void, isDrawerOpen?: boolean }) => React.ReactElement;
        renderBody?: (props: { toggleDrawer?: () => void, isDrawerOpen?: boolean }) => React.ReactElement;
    }>;


function makeSize(defSize: DefaultSize): Size {
    let res = {...defSize};

    if (!res.sm) {
        res.sm = res.xs;
    }

    if (!res.md) {
        res.md = res.sm;
    }

    if (!res.lg) {
        res.lg = res.md;
    }

    if (!res.xl) {
        res.xl = res.lg;
    }

    return (res as Size);
}

function safeSize(sizes: Partial<Size>, defSize: DefaultSize): Size {
    if (!sizes.xs && !sizes.sm && !sizes.md && !sizes.lg && !sizes.xl) {
        return makeSize(defSize);
    }

    if (!sizes.xs) {
        sizes.xs = defSize.xs;
    }

    return makeSize(sizes as DefaultSize);
}

function useSizes(appBarSize: Partial<Size>, appBarDefSize: DefaultSize, drawerSize: Partial<Size>,
                  drawerDefaultSize: DefaultSize, drawerVariant: DrawerVariant, theme: Theme)
    : [number | string, number | string, Exclude<DrawerVariant, 'responsive'>] {
    const responsive = drawerVariant === 'responsive';
    const finalAppBarSize = safeSize(appBarSize, appBarDefSize);
    let tmp = {...drawerSize};
    delete tmp.xs;
    delete tmp.sm;
    const finalDrawerSize = safeSize(responsive ? tmp : drawerSize,
        responsive ? {...makeSize(drawerDefaultSize), xs: '100%'} : drawerDefaultSize);

    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));

    const drawerType = drawerVariant === 'responsive' ? 'persistent' : drawerVariant;

    if (isXs) {
        return [finalAppBarSize.xs, finalDrawerSize.xs, drawerType];
    } else if (isSm) {
        return [finalAppBarSize.sm, finalDrawerSize.sm, drawerType];
    } else if (isMd) {
        return [finalAppBarSize.md, finalDrawerSize.md, drawerType];
    } else if (isLg) {
        return [finalAppBarSize.lg, finalDrawerSize.lg, drawerType];
    } else {
        return [finalAppBarSize.xl, finalDrawerSize.xl, drawerType];
    }
}

const theme = createMuiTheme({
    palette:
        {
            primary: blue,
            secondary: pink
        }
});

export function MainLayout(props: Props): React.ReactElement {
    const [appBarHeight, drawerWidth, drawerVariant] =
        useSizes(props.appBarHeight ? props.appBarHeight : {}, {xs: 64},
            props.drawerWidth ? props.drawerWidth : {}, {xs: 224},
            props.drawerVariant, theme);

    let [isDrawerOpen, setDrawerOpen] = useState(false);
    const isDrawerClipped = props.drawerClipped !== undefined ? props.drawerClipped : false;

    const toggleDrawer = useCallback(() => {
        setDrawerOpen((prevState) => {
            return !prevState;
        });
    }, [setDrawerOpen]);

    return (
        <MuiThemeProvider theme={theme}>
            <AppBar position={props.appBarVariant}
                    style={
                    {
                        height: appBarHeight,
                        right: 'auto',
                        left: drawerVariant === 'permanent' || (isDrawerOpen && !isDrawerClipped) ?
                        drawerWidth : 0,
                        transition: 'left 224ms',
                        zIndex: isDrawerClipped ? 1201 : 1200
                        }}
            >
                {
                    props.renderAppBar &&
                    props.renderAppBar(drawerVariant === 'permanent' ?
                        {} : {toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
                }
            </AppBar>

            <Drawer variant={drawerVariant}
                    PaperProps={
                        {
                            style:
                                {
                                    width: drawerWidth,
                                    paddingTop: isDrawerClipped ? appBarHeight : 0
                                }
                        }}
                    open={isDrawerOpen}
            >
                {
                    props.renderDrawer &&
                    props.renderDrawer(drawerVariant === 'permanent' ?
                        {} : {toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
                }

            </Drawer>

            <div style={
                {
                    marginTop: appBarHeight,
                    marginLeft: drawerVariant === 'permanent' || isDrawerOpen ?
                        drawerWidth : 0,
                    transition: 'margin-left 224ms'
                }
            }>

                {
                    props.renderBody &&
                    props.renderBody(drawerVariant === 'permanent' ?
                        {} : {toggleDrawer: toggleDrawer, isDrawerOpen: isDrawerOpen})
                }

            </div>
        </MuiThemeProvider>
    )
}


