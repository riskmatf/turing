import {Dispatch, SetStateAction} from "react";

export type Hook<T> = [T, Dispatch<SetStateAction<T>>];