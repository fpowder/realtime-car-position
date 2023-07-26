import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import process from 'process';
import fs from 'fs';

const logDir = `${process.cwd()}/logs`;
(() => {
    if(! fs.existsSync(`${process.cwd()}/logs`)) {
        fs.mkdirSync(`${process.cwd()}/logs`);
    }
})();

const appName = 'e-avp-server';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.ms(),
        format.simple(),
        format.prettyPrint()
    ),
    transports: [
        new DailyRotateFile({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}`,
            filename: `${appName}-out.log`,
            maxSize: '10MB',
            maxFiles: 14
        }),
        new DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}`,
            filename: `${appName}-error.log`,
            maxSize: '10MB',
            maxFiles: 14
        }),
       new transports.Console()
    ]
});