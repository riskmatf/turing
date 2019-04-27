import * as React from 'react';
import {match, RouteComponentProps} from "react-router";
import {Grid, Typography} from "@material-ui/core";
import {useClassroom } from "../services/user_side/i_classroom_service";
import {useForceRender} from "../utils/force_render";
import {SvgShema} from "./svg_shema";

type AppBarProps  =
    Readonly<{
    }> & RouteComponentProps<{id: string}>;

export function AppBarPart(props: AppBarProps): React.ReactElement | null
{
    const forceRender =  useForceRender();
    const classroom = useClassroom(props.match.params.id, forceRender);


    if(classroom.classroom === undefined)
    {
        return null;
    }

    return (
            <Grid container style={{height:'100%'}} alignItems={'center'}>
                <Grid item>
                    <Typography variant={'h5'} color={'inherit'}>
                        {classroom.classroom.name}
                    </Typography>
                </Grid>
            </Grid>
        );
}

type BodyProps =
    Readonly<{
}> & RouteComponentProps<{id: string}>;

export function BodyPart(props: BodyProps): React.ReactElement | null
{
    const forceRender = useForceRender();
    const classroom = useClassroom(props.match.params.id, forceRender);

    if(classroom.classroom === undefined)
    {
        return null;
    }

    return (
        <Grid container  justify={'center'} style={{paddingTop: '10px'}}>
            <Grid item xs={12} md={6}>
                <SvgShema url={classroom.classroom.schemaUrl} numOfEl={classroom.classroom.computerCount}/>
            </Grid>
        </Grid>
    );
}
