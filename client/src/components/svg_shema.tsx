import * as React from 'react';
import {RefObject, useCallback, useRef} from "react";

type Props =
    Readonly<{
        url: string;
        numOfEl: number;
        onLoad: (errorToggle: (id: number, visible: boolean)=>void)=>void;
        onClick: (id_comp: number)=>void;
    }>

/**
 * TODO change errorToggle to (id: nummber)=>void
 * And also add toggleOutline
 *
 */
export function SvgShema(props: Props): React.ReactElement
{
    const objectRef = useRef<HTMLObjectElement>(null);
    const onLoad = useCallback(()=>
    {
        //const el = document.querySelector('object');
        const el = objectRef.current;

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
                //res.push(value=>err_el.setAttribute('visibility', value ? '' : 'hidden'));
            }
        }

        props.onLoad((id: number, visible: boolean)=>
        {
            console.log(id);
            console.log(res);
            res[id-1].setAttribute('visibility', visible? '' : 'hidden');
        });
    }, [props.numOfEl, props.onLoad, props.onClick]);

    return (
        <object data={props.url} onLoad={onLoad} style={{width:'100%'}} type='image/svg+xml'
                ref={objectRef}
        />
    );
}

