import {IAuthService} from "./i_auth_service";
import {EventEmitter, EventSubscription} from "fbemitter";
import {User} from "../../models/admin_side/user";


// export class LocalAuthService implements IAuthService
// {
//     private static ON_LOGIN_CHANGED = 'ON_LOGIN_CHANGED';
//     private static users = [
//         {displayName: 'admin', userName: 'admin', password: 'admin'},
//         {displayName: 'admin1', userName: 'admin1', password: 'admin1'}
//     ];
//     private emitter_: EventEmitter;
//     private user_: User | undefined;
//     private isLogedIn_: boolean | undefined;
//
//     constructor()
//     {
//         this.emitter_ = new EventEmitter();
//         this.user_ = undefined;
//         this.isLogedIn_ = undefined;
//
//         this.checkLocalStorageForUser();
//     }
//
//     isLogedIn(): boolean | undefined
//     {
//         return this.isLogedIn_;
//     }
//
//     login(username: string, password: string): Promise<boolean>
//     {
//         console.log(username);
//         console.log(password);
//
//         return ( async ()=>
//             {
//                 const index = LocalAuthService.users.findIndex(
//                     value => value.userName === username && value.password === password);
//
//                 if(index !== -1)
//                 {
//                     this.isLogedIn_ = true;
//                     this.user_ =
//                         new User(LocalAuthService.users[index].userName, LocalAuthService.users[index].displayName);
//                     window.localStorage.setItem('user', JSON.stringify(this.user_));
//                     this.emitter_.emit(LocalAuthService.ON_LOGIN_CHANGED);
//                 }
//                 else
//                 {
//                     return false;
//                 }
//                 return true;
//             }
//         )();
//     }
//
//     logout(): Promise<void>
//     {
//         return (
//             async ()=>
//             {
//                 this.user_ = undefined;
//                 this.isLogedIn_ = false;
//                 window.localStorage.removeItem('user');
//                 this.emitter_.emit(LocalAuthService.ON_LOGIN_CHANGED);
//             }
//         )();
//     }
//
//     onLogedInChange(handler: () => void): EventSubscription
//     {
//         return this.emitter_.addListener(LocalAuthService.ON_LOGIN_CHANGED, handler);
//     }
//
//     whoIsLogedIn(): User | undefined
//     {
//         return this.user_;
//     }
//
//     private checkLocalStorageForUser(): void
//     {
//         const user = window.localStorage.getItem('user');
//         if(user !== null)
//         {
//             const userObject = JSON.parse(user);
//             if(typeof(userObject) === 'object' &&
//                 userObject.userName !== undefined && userObject.displayName !== undefined)
//             {
//                 this.user_ = new User(userObject.userName, userObject.displayName);
//                 this.isLogedIn_= true;
//             }
//             else
//             {
//                 throw new Error('Something went wrong with user');
//             }
//         }
//         else
//         {
//             this.isLogedIn_ = false;
//         }
//
//         this.emitter_.emit(LocalAuthService.ON_LOGIN_CHANGED);
//     }
// }