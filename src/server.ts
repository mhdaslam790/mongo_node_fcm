import 'reflect-metadata';
import 'es6-shim';
import express, { Application, } from 'express';
import { loggerDev } from './utils/logger';
import { config } from './config';
import { loaders } from './loaders';

const HOST:string = '192.168.1.4';
const startServer = async () => {
    const app: Application = express();
    await loaders(app);
    loggerDev.debug(`MODE ENV ${process.env.NODE_ENV}`);
    app.listen(8000 ,HOST, () => {
        loggerDev.info(`Server listening on port: ${config.port}`);
    })
        .on('error', err => {
            loggerDev.error(err);
            process.exit(1);
        });
}
startServer();