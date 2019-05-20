export type ChangeDataSetter<T> = ((prevData: T) => Partial<T>) | Partial<T>;
