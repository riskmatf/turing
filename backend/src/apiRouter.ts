import express, { Response } from 'express';
import classroomsRouter from './routers/classroomsRouter';
import reportsRouter from './routers/reportsRouter';
import bodyParser from 'body-parser';
const apiRouter = express.Router();

//TODO: refator code to use .catch properly
//TODO: fix this
apiRouter.use(bodyParser());

apiRouter.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

apiRouter.use("/classrooms", classroomsRouter);

apiRouter.use("/reports", reportsRouter);

export {apiRouter};


export function serverError(error : any, response: Response){
	console.log(error)
	response.status(500).send({message:"UNKNOWN SERVER ERROR"});
}