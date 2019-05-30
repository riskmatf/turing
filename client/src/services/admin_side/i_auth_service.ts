import {EventSubscription} from 'fbemitter';
import {User} from "../../models/admin_side/user";
import {Result} from "../../utils/result";

export type AdminSignInData =
    {
        username: string;
        password: string;
        displayName: string;
    };

export interface IAuthService
{
    login(username: string, password: string): Promise<boolean>;
    logout(): Promise<void>;

    isLogedIn(): boolean | undefined;
    /*Returns username for current logged in admin*/
    whoIsLogedIn(): User | undefined;

    onLogedInChange(handler: ()=>void): EventSubscription;

    addAdmin(data: AdminSignInData): Promise<Result<Error, void>>;
}