export type ReportType = 1 | 2 | 3;

export class Report
{
    public constructor(public readonly idReport: number, public readonly classroomName: string,
                       public readonly date: number, public description: string, public fixed: boolean,
                       public urgent: boolean, public readonly type: ReportType,
                       public readonly idComputer?: number | null,
					   private idAdmin_?: string| null, private adminComment_?: string | null,
					   private adminDisplayName_?: string| null,)
    {
        if(idReport < 0)
        {
            throw new Error('Can not create Report where idReport is not valid');
        }

        /*if(idAdmin_ !== undefined)
        {
            throw new Error('Can not create Report where idAdmin is not valid');
        }*/

        if(type === Report.TYPE_COMPUTER_REPORT && idComputer === null)
        {
            throw new Error('Can not create computer report with no computer id');
        }

        if(type !== Report.TYPE_COMPUTER_REPORT && idComputer !== null)
        {
            throw new Error('Non computer report does not take computer id');
        }

        if(idComputer !== undefined && idComputer !== null && idComputer < 0)
        {
            throw new Error('Can not create Report where idComputer is not valid');
        }

        if(adminComment_ !== null && idAdmin_ === null)
        {
            throw new Error('Can not set admin comment without admin id');
        }

        if(idAdmin_ !== null && adminComment_ === null)
        {
            throw new Error('Can not set idAdmin when comment is not provided');
		}
    }

    public addAdminComment(id: string, adminComment: string): void
    {
        if(this.idAdmin_ !== null && this.idAdmin_ !== id)
        {
            throw new Error('Comment can be changed only by the same admin that placed it');
        }

        this.idAdmin_ = id;
        this.adminComment_ = adminComment;
    }

    public removeAdminComment(id: string): void
    {
        if(this.idAdmin_ === null)
        {
            throw new Error('Can not remove not set comment');
        }

        this.idAdmin_ = null;
        this.adminComment_ = null;
    }

    public isAdminCommentSet(): boolean
    {
        return this.idAdmin_ !== null && this.adminComment_ !== null;
    }

    public get idAdmin(): string
    {
        if(this.idAdmin_ !== undefined && this.idAdmin_ !== null)
        {
            return this.idAdmin_;
        }

        throw new Error('Admin id is not set');
    }

    public get adminComment(): string
    {
        if(this.adminComment_ !== undefined && this.adminComment_ !== null)
        {
            return this.adminComment_;
        }

        throw new Error('Admin comment is not set');
	}
	
	public get adminDisplayName(): string
    {
        if(this.adminDisplayName_ !== undefined && this.adminDisplayName_ !== null)
        {
            return this.adminDisplayName_;
        }

        throw new Error('admin display name is not set');
    }



    public static readonly TYPE_COMPUTER_REPORT  = 1;
    public static readonly TYPE_PROJECTOR_REPORT = 2;
    public static readonly TYPE_OTHER_REPORT = 3;
}