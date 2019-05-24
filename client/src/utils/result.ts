export class Result<E, V>
{
    private filed_?: E | V;
    private type_: 0 | 1 | 2;

    private constructor(type: 0 | 1 | 2, filed?: E | V)
    {
        this.type_ = type;
        this.filed_ = filed;
    }


    public isError(): boolean
    {
        return this.type_ === Result.TYPE_ERROR;
    }


    public get value(): V
    {
        return this.filed_ as V;
    }

    public get error(): E
    {
        return this.filed_ as E;
    }

    private static TYPE_VALUE: 0 = 0;
    private static TYPE_ERROR: 1 = 1;
    private static TYPE_SUCCESS: 2 = 2;


    public static success<E>(): Result<E, void>
    {
        return new Result<E, void>(this.TYPE_SUCCESS);
    }

    public static error<E, V>(error: E): Result<E, V>
    {
        return new Result<E, V>(this.TYPE_ERROR, error);
    }

    public static value<E, V>(value: V): Result<E, V>
    {
        return new Result<E, V>(this.TYPE_VALUE, value);
    }

}