import {useCallback, useState} from "react";

export type ForceRenderType = [boolean, ()=>void];

export function useForceRender(): ForceRenderType
{
    const [value, setValue] = useState(false);

    const forceRender = useCallback(()=>
    {
        setValue(prevValue=>!prevValue);
    }, [setValue]);

    return [value, forceRender];
}