
type classroom = {
	name : string,
	location : string, 
	numOfComputers : number,
	schemaPath: string
}

type report = {
	reportID : number,
	classroomName : string,
	reportType : number,
	computerID? : number,
	reportComment? : string,
	fixed : boolean,
	adminComment? : string, 
	adminUsername? : string,
	timestamp : number,
	urgent : boolean
}
type nextObject = {
	itemsRemaining : number,
	nextPageUrl : string
}
type user = {
	username : string, 
	displayName : string
}

export {classroom, report, nextObject, user}