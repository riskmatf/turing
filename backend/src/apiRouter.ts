import express from 'express';
import classroomsRouter from './routers/classroomsRouter';
const apiRouter = express.Router();

apiRouter.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

apiRouter.use("/classrooms", classroomsRouter);

export {apiRouter};