import * as React from 'react';
import {useCallback} from "react";

type Props =
    Readonly<{
        url: string;
        numOfEl: number;
    }>

export function SvgShema(props: Props): React.ReactElement
{
    const handleClick = useCallback((id: number)=>
    {
        console.log(`You have clicked ${id}`);
    }, []);

    const onLoad = useCallback(()=>
    {
        const el = document.querySelector('object');
        if(el === undefined || el === null)
        {
            return ;
        }

        const doc = el.contentDocument;
        if(doc === null || doc === undefined)
        {
            return;
        }

        for(let i = 1; i <= props.numOfEl; ++i)
        {
            const el = doc.querySelector(`#comp_${i}`);
            console.log(el);

            if(el !== null)
            {
                el.addEventListener('click', ()=>
                {
                    handleClick(i);
                });
            }

        }
    }, [props.numOfEl, handleClick]);

    return (
        <object data={props.url} onLoad={onLoad} style={{width:'100%'}}/>
    );
}

