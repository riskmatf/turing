import express from 'express';
const router = express.Router();

router.use((req, _res, next)=>{
	console.log("challenge accepted: " + req.baseUrl);
	next();
});

router.get("/", (_req, res)=>{
	res.send("Hello from the otter side");
});

router.get("/classrooms", (_req, res)=>{
	res.send("Classrooms will exist here");
});

export {router};