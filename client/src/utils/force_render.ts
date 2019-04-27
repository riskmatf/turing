import {useCallback, useState} from "react";

export type ForceRenderType = ()=>void;

export function useForceRender(): ForceRenderType
{
    const [, setValue] = useState(false);

    const forceRender = useCallback(()=>
    {
        setValue(prevValue=>!prevValue);
    }, [setValue]);

    return forceRender;
}