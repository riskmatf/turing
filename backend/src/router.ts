import express from 'express';
const router = express.Router();

router.use((req, _res, next)=>{
	console.log("challenge accepted: " + req.baseUrl);
	next();
});

router.get("/", (_req, res)=>{
	res.set("allow-access-control-origin", "*").send("Hello from the otter side");
});

router.get("/classrooms", (_req, res)=>{
	res.set("allow-access-control-origin", "*").send("Classrooms will exist here");
});

export {router};