import express from 'express';
import { getAllClassrooms } from './db/Classrooms';
const router = express.Router();

router.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

router.get("/classrooms", (req, res)=>{
	const baseUrl = req.protocol + "://" + req.get("host") + "/";
	getAllClassrooms(baseUrl).then(allClassrooms => res.send(allClassrooms));
});

export {router};