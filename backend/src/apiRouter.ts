import express, { Response } from 'express';
import classroomsRouter from './routers/classroomsRouter';
import reportsRouter from './routers/reportsRouter';
import bodyParser from 'body-parser';
import adminRouter from "./routers/adminRouters/adminRouter";
const apiRouter = express.Router();

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));

apiRouter.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

apiRouter.use("/classrooms", classroomsRouter);

apiRouter.use("/reports", reportsRouter);

apiRouter.use("/admin", adminRouter);

export {apiRouter};


export function serverError(error : any, response: Response){
	console.log(error);
	response.status(500).send({message:"UNKNOWN SERVER ERROR"});
}