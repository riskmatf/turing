import express from 'express';
import { router } from './router';

const app = express();
const port = 3000;
app.use("/api/v1", router);
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
}); 