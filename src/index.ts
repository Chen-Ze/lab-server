import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { router as serverRouter } from './routes/server';
import logger from 'morgan';
import compression from 'compression';

dotenv.config();

const app = express();
app.use(compression());
const port = Number(process.env.PORT); // default port to listen

app.use(express.json());
// app.use(logger('dev'));
app.use('/', serverRouter);
app.use('/server/vs', express.static(path.join(__dirname, '..', '/node_modules/monaco-editor/min/vs')));

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});