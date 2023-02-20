import process from 'node:process';

const errorHandlers: string[] = [];

enum ErrorHandlerEnum {
    UNCAUGHT_EXCEPTION = 'uncaughtException',
    DECORATOR = 'decorator',
    MIDDLEWARE = 'middleware'
}

if (!process.env?.ERROR_HANDLERS) {
    errorHandlers.push(ErrorHandlerEnum.UNCAUGHT_EXCEPTION);
    errorHandlers.push(ErrorHandlerEnum.DECORATOR);
    errorHandlers.push(ErrorHandlerEnum.MIDDLEWARE);
    process.env.ERROR_HANDLERS = errorHandlers.join(',');
}
export const isUncaughtExceptionEnabled = process.env?.ERROR_HANDLERS.includes(ErrorHandlerEnum.UNCAUGHT_EXCEPTION);
export const isDecoratorEnabled = process.env?.ERROR_HANDLERS.includes(ErrorHandlerEnum.DECORATOR);
export const isMiddlewareEnabled = process.env?.ERROR_HANDLERS.includes(ErrorHandlerEnum.MIDDLEWARE);
