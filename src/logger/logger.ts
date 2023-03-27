import { createLogger, format, transports } from 'winston';
import { isTest } from '../shared/config.helper';

export const logger = createLogger({
    silent: isTest(),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.splat(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        }),
        new transports.File({
            dirname: 'logs',
            filename: 'errors.log',
            level: 'error',
            format: format.combine(
                format.timestamp(),
                format.splat(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        })
    ]
});
