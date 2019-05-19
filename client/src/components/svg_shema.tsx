import * as React from 'react';
import {useCallback} from "react";

type Props =
    Readonly<{
        url: string;
        numOfEl: number;
        onLoad: (errorToggle: (id: number)=>void)=>void;
        onClick: (id_comp: number)=>void;
    }>

/**
 * TODO change errorToggle to (id: nummber)=>void
 * And also add toggleOutline
 *
 */
export function SvgShema(props: Props): React.ReactElement
{
    const onLoad = useCallback(()=>
    {

        const el = document.querySelector('object');
        const visible: Array<boolean> = [];

        if(el === undefined || el === null)
        {
            return ;
        }

        const doc = el.contentDocument;
        if(doc === null || doc === undefined)
        {
            return;
        }

        /*TODO change to map*/
        const res: Array<Element> = [];
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
                err_el.setAttribute('visibility', 'hidden');
                res.push(err_el);
                visible.push(false);
                //res.push(value=>err_el.setAttribute('visibility', value ? '' : 'hidden'));
            }
        }

        props.onLoad((id: number)=>
        {
            res[id-1].setAttribute('visibility', !visible[id-1] ? '' : 'hidden');
            visible[id-1] = !visible[id-1];
        });
    }, [props.numOfEl, props.onLoad, props.onClick]);

    return (
        <object data={props.url} onLoad={onLoad} style={{width:'100%'}}/>
    );
}

