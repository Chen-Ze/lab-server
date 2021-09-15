import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { router as serverRouter } from './routes/server';
import logger from 'morgan';
import compression from 'compression';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(compression());
const port = Number(process.env.PORT); // default port to listen

if (!process.env.BUILD_LOCATION || !fs.existsSync(path.join(process.env.BUILD_LOCATION, 'index.html'))) {
    throw new Error("Client build not found.");
}

app.use(express.static(path.resolve(process.env.BUILD_LOCATION)));

app.use(express.json());
// app.use(logger('dev'));
app.use('/', serverRouter);
app.use('/server/vs', express.static(path.join(__dirname, '..', '/node_modules/monaco-editor/min/vs')));

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});