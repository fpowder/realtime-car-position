"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const tslib_1 = require("tslib");
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = tslib_1.__importDefault(require("winston-daily-rotate-file"));
const process_1 = tslib_1.__importDefault(require("process"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const logDir = `${process_1.default.cwd()}/logs`;
(() => {
    if (!fs_1.default.existsSync(`${process_1.default.cwd()}/logs`)) {
        fs_1.default.mkdirSync(`${process_1.default.cwd()}/logs`);
    }
})();
const appName = 'e-avp-server';
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.ms(), winston_1.format.simple(), winston_1.format.prettyPrint()),
    transports: [
        new winston_daily_rotate_file_1.default({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}`,
            filename: `${appName}-out.log`,
            maxSize: '10MB',
            maxFiles: 14
        }),
        new winston_daily_rotate_file_1.default({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}`,
            filename: `${appName}-error.log`,
            maxSize: '10MB',
            maxFiles: 14
        }),
        new winston_1.transports.Console()
    ]
});
//# sourceMappingURL=logger.js.map