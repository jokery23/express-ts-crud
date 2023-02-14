import logger from '../index';

export default function logTimeExecution() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            const start = Date.now();
            const res = await childFunction.apply(this, args);
            const end = Date.now();
            logger.info(`The '${propertyKey}' function execution time: %d ms`, end - start);
            return res;
        };

        return descriptor;
    };
}
