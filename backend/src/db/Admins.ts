import {AbstractRepository, EntityRepository} from 'typeorm';
import {Admin} from "../../entities/Admin";
import {Md5} from 'ts-md5';

@EntityRepository(Admin)
export class AdminRepository extends AbstractRepository<Admin>
{
    public async findByUsername(username: string){
        return this.repository.findOne(username);
    }
    public async findByDisplayName(displayName: string) {
        return this.repository.findOne({displayName});
    }
    public async addUser(username: string, password: string, displayName: string){
        const userExists = (await this.findByUsername(username)) !== undefined;
        if(userExists){
            return undefined;
        }
        const newAdmin = new Admin();
        newAdmin.username = username;
        newAdmin.password = Md5.hashStr(password).toString();
        newAdmin.displayName = displayName;
        return this.repository.save(newAdmin);
    }

    public async changePassword(username: string, newPassword: string){
        const user = await this.findByUsername(username);
        if(!user){
            return undefined;
        }
        user.password = Md5.hashStr(newPassword).toString();
        return this.repository.save(user);
    }
    public async changeDisplayName(username: string, newDisplayName: string){
        const user = await this.findByUsername(username);
        if(!user){
            return undefined;
        }
        user.displayName = newDisplayName;
        return this.repository.save(user);
    }
}