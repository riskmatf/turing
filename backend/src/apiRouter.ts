import express from 'express';
import classroomsRouter from './routers/classroomsRouter';
import reportsRouter from './routers/reportsRouter';
import bodyParser from 'body-parser';
const apiRouter = express.Router();

apiRouter.use(bodyParser());

apiRouter.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

apiRouter.use("/classrooms", classroomsRouter);

apiRouter.use("/reports", reportsRouter);

export {apiRouter};