export interface IAuthService
{
    login(username: string, password: string): Promise<void>;
    logout(): Promise<void>;
    isLogedIn(): boolean;
    /*Returns username for current logged in admin*/
    whoIsLogedIn(): string;
    jwt(): string;
}