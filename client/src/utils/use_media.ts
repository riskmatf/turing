import {useEffect, useRef} from "react";

export function useMedia<T>(queries: Array<string>, values: Array<T>, forceRender: ()=>void): Array<T>
{
    if(values.length !== queries.length)
    {
        throw new Error('You have to provide values for all queries');
    }


    const matches = useRef<Array<MediaQueryList>>([]);


    useEffect(()=>
    {
        for(const query of queries)
        {
            const match = window.matchMedia(query);
            matches.current.push(match);
            match.addEventListener('change', forceRender);
        }

        forceRender();

        return ()=>
        {
            for(const match of matches.current)
            {
                match.removeEventListener('change', forceRender);
            }
        };

        /**
         *  WARNING!!!!!!!
         *  previous version of the line below looked like this
         *  [forceRender, queries] this caused an infinite loop of rendering because every time this functions gets
         *  called it receives new array and react does shallow compare (ref compare) and this means
         *  every time component that uses this hook rerender it sends new array forcing it self to rerender again
         *  and so on. Unwrapping values solves the problem, because string are always the same as ref goes an they dont
         *  change when recreated.
         */
    }, [forceRender, ...queries]);


    const arr: Array<T> = [];

    matches.current.forEach((value, index) =>
    {
        if(value.matches)
        {
            arr.push(values[index]);
        }
    });

    return arr;
}