import * as React from 'react';
import {useCallback} from "react";

type Props =
    Readonly<{
        url: string;
        numOfEl: number;
        onLoad: (errorToggle: Array<(value: boolean)=>void>)=>void;
        onClick: (id_comp: number)=>void;
    }>

export function SvgShema(props: Props): React.ReactElement
{
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

        const res: Array<(value: boolean)=>void> = [];
        for(let i = 1; i <= props.numOfEl; ++i)
        {
            const comp_el = doc.querySelector(`#comp_${i}`);
            const err_el = doc.querySelector(`#err_${i}`);

            if(comp_el !== null)
            {
                comp_el.addEventListener('click', ()=>
                {
                    props.onClick(i);
                });
            }

            if(err_el !== null)
            {
                res.push(value=>err_el.setAttribute('visibility', value ? '' : 'hidden'));
            }
        }

        props.onLoad(res);
    }, [props.numOfEl, props.onLoad, props.onClick]);

    return (
        <object data={props.url} onLoad={onLoad} style={{width:'100%'}}/>
    );
}

