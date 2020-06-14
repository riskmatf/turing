import express from 'express';
import { apiRouter } from './apiRouter';
import { createConnection } from 'typeorm';
import path from 'path';
import fs from 'fs';
// import proxy from 'express-http-proxy';

import consoleStamp from 'console-stamp';
export let imagesPaths : Map<string, string> = new Map<string, string>();

// using only default options since new version of console-stamp has no @types and it's too much of a nuance to deal with all of that
consoleStamp(console);

createConnection().then( _conn => {
	const app = express();
	const port = 3000;


	fs.readdir(path.join(__dirname, "public/images"),
				(err, files)=>{
					if(err){
						return console.log("Cant open images!");
					}
					files.forEach(file => {
						const indexOfDot = file.lastIndexOf(".");
						if(indexOfDot){
							const name = file.substr(0, indexOfDot);
							imagesPaths.set(name, file);
						}
					});
				});


	/*Adding cors support for all routes*/
	app.use('', (req, resp, next) => {
		resp.set('Access-Control-Allow-Origin', '*');
		console.log(req.url);
		next();
	});
	app.use("/static", express.static(path.join(__dirname, "public")));
	const frontendFolder = path.join(__dirname, "front");
	app.use("/", express.static(frontendFolder));
	app.use("/api/v1", apiRouter);
	app.get("*", (req, res)=>{
		res.sendFile(path.join(frontendFolder, "index.html"));
	});
	// app.use("/", proxy("http://turing.dev.matf.bg.ac.rs:8080"));
	app.listen(port, err => {
		if (err) {
			return console.error(err);
		}
		return console.log(`server is listening on ${port}`);
	});
});