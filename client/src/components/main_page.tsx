import * as React from 'react';
import {useClassrooms} from "../services/user_side/i_classroom_service";
import {useForceRender} from "../utils/force_render";
import {Button, Grid, Typography} from "@material-ui/core";
import {ListItem, List, ListItemText} from "@material-ui/core";
import {Link, match} from 'react-router-dom';

type AppBarProps  =
    Readonly<{

    }>;

export function AppBarPart(props: AppBarProps): React.ReactElement
{
    return <h1>Turing</h1>
}

type BodyProps =
    Readonly<{
        match: match<void>
    }>;

export function BodyPart(props: BodyProps): React.ReactElement
{
    const forceRender = useForceRender();
    const classrooms = useClassrooms(forceRender);

    const classroomsJSX = classrooms.classrooms.map(value=>
    {
        return (
            <ListItem>
                <ListItemText style={{textAlign:'center'}}>
                    <Link to={`${props.match.url}classrooms/${value.name}`} style={{textDecoration: 'none'}}>
                        <Button fullWidth>
                            <Typography variant={'h5'}>
                                {value.name}
                            </Typography>
                        </Button>
                    </Link>
                </ListItemText>
            </ListItem>
        );
    });

    return (
        <Grid container justify={'center'}>
            <Grid item xs={6}>
                <List>
                    {classroomsJSX}
                </List>
            </Grid>
        </Grid>
    );
}