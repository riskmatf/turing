import express from 'express';
import { router } from './router';
import { createConnection } from 'typeorm';
import path from 'path';
import fs from 'fs';

export let imagesPaths : Map<string, string> = new Map<string, string>();

createConnection().then( conn => {
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
		resp.set('Access-Control-Allow-Origin', '*')
		console.log(req.url);
		next();
	})
	app.use("/static", express.static(path.join(__dirname, "public")));
	app.use("/api/v1", router);
	app.listen(port, err => {
		if (err) {
			return console.error(err);
		}
		return console.log(`server is listening on ${port}`);
	}); 
})