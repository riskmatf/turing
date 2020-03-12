import express from 'express';
import { router } from './router';
import { createConnection } from 'typeorm';

createConnection().then( conn => {
	const app = express();
	const port = 3000;

	/*Adding cors support for all routes*/
	app.use('', (req, resp, next) => {
		resp.set('Access-Control-Allow-Origin', '*')
		next()
	})
	app.use("/api/v1", router);
	app.listen(port, err => {
		if (err) {
			return console.error(err);
		}
		return console.log(`server is listening on ${port}`);
	}); 
})