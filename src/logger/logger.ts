import { createLogger, format, transports } from 'winston';
import { env } from 'node:process';

export const logger = createLogger({
    silent: env.NODE_ENV === 'test',
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
