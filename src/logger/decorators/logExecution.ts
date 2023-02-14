import logger from '../index';

export default function logExecution() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            let res: any;
            const start = Date.now();

            try {
                res = await childFunction.apply(this, args);
            } catch (e) {
                logger.error(
                    `[Error] method:${propertyKey}; args=${JSON.stringify(args)}; message='${e.error || e.toString()}'`
                );
                throw e;
            } finally {
                logger.info(`The '${propertyKey}' function execution time: %d ms`, Date.now() - start);
            }

            return res;
        };

        return descriptor;
    };
}
