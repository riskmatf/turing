export class Report
{
    public constructor(public readonly idReport: number, public readonly classroomName: string,
                       public readonly idComputer: number, public description: string, public fixed: boolean,
                       private idAdmin_: number | undefined, private adminComment_: string | undefined)
    {
        if(idReport < 0)
        {
            throw new Error('Can not create Report where idReport is not valid');
        }

        if(idAdmin_ !== undefined && idAdmin_ < 0)
        {
            throw new Error('Can not create Report where idAdmin is not valid');
        }

        if(idComputer < 0)
        {
            throw new Error('Can not create Report where idComputer is not valid');
        }

        if(adminComment_ !== undefined && idAdmin_ === undefined)
        {
            throw new Error('Can not set admin comment without admin id');
        }

        if(idAdmin_ !== undefined && adminComment_ === undefined)
        {
            throw new Error('Can not set idAdmin when comment is not provided');
        }
    }

    public addAdminComment(id: number, adminComment: string): void
    {
        if(id < 0)
        {
            throw new Error('Can not add comment for invalid idAdmin');
        }

        this.idAdmin_ = id;
        this.adminComment_ = adminComment;
    }


    public changeAdminComment(comment: string): void
    {
        if(this.idAdmin_ === undefined)
        {
            throw new Error('Can not change admin comment when it was not originally set');
        }

        this.adminComment_ = comment;
    }

    public isAdminCommentSet(): boolean
    {
        return this.idAdmin_ !== undefined && this.adminComment_ !== undefined;
    }

    public get idAdmin(): number
    {
        if(this.idAdmin_ !== undefined)
        {
            return this.idAdmin_;
        }

        throw new Error('Admin id is not set');
    }

    public get adminComment(): string
    {
        if(this.adminComment_ !== undefined)
        {
            return this.adminComment_;
        }

        throw new Error('Admin comment is not set');
    }
}