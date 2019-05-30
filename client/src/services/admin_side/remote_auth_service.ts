import {AdminSignInData, IAuthService} from "./i_auth_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {User} from "../../models/admin_side/user";
import {addAdmin, fetchLogin, fetchLogout, fetchWhoami,} from './fetch_functions';
import {Result} from "../../utils/result";


export class RemoteAuthService implements IAuthService
{
    private static ON_LOGIN_CHANGED = 'ON_LOGIN_CHANGED';

    private emitter_: EventEmitter;
    private user_: User | undefined;
    private isLogedIn_: boolean | undefined;
    private logedInChecked_: boolean;

    constructor()
    {
        this.emitter_ = new EventEmitter();
        this.user_ = undefined;
        this.isLogedIn_ = undefined;
        this.logedInChecked_ = false;
    }

    isLogedIn(): boolean | undefined
    {
        if(!this.logedInChecked_)
        {
            this.amILogedIn();
            this.logedInChecked_ = true;
        }
        return this.isLogedIn_;
    }

    login(username: string, password: string): Promise<boolean>
    {

        return ( async ()=>
            {
                const res = await fetchLogin(username, password);

                if(res.isError())
                {
                    return false;
                }

                this.user_ = res.value;
                this.isLogedIn_ = true;

                return true;

            })();
    }

    logout(): Promise<void>
    {
        return (
            async ()=>
            {
                const res = await fetchLogout();

                if(res.isError())
                {
                    throw res.error;
                }
                this.isLogedIn_ = false;
                this.user_ = undefined;

                this.emitter_.emit(RemoteAuthService.ON_LOGIN_CHANGED);
            }
        )();
    }

    onLogedInChange(handler: () => void): EventSubscription
    {
        return this.emitter_.addListener(RemoteAuthService.ON_LOGIN_CHANGED, handler);
    }

    whoIsLogedIn(): User | undefined
    {
        return this.user_;
    }

    addAdmin(data: AdminSignInData): Promise<Result<Error, void>>
    {
        return addAdmin(data);
    }


    private amILogedIn(): void
    {
        (async ()=>
        {
            const res = await fetchWhoami();

            if(res.isError())
            {
                this.isLogedIn_ = false;
            }
            else
            {
                this.isLogedIn_ = true;
                this.user_ = res.value;
            }
            this.emitter_.emit(RemoteAuthService.ON_LOGIN_CHANGED);
        })();
    }
}