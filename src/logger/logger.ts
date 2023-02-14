import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
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
