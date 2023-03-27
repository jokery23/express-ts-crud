import logger from '../index';
import { isLogExecutionDecoratorEnabled } from '../../shared/config.helper';

export default function logExecution() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!isLogExecutionDecoratorEnabled()) {
            return descriptor;
        }

        const childFunction = descriptor.value;

        descriptor.value = async (...args: any[]) => {
            let res: any;
            const start = Date.now();

            try {
                res = await childFunction.apply(this, args);
            } catch (e) {
                logger.error(
                    `[Decorator Error Handler] method:${propertyKey}; args=${JSON.stringify(args)}; message='${
                        e.error || e.toString()
                    }'`
                );
                throw e;
            } finally {
                logger.info(
                    `[Decorator Execution Time] The '${propertyKey}' function execution time: %d ms`,
                    Date.now() - start
                );
            }

            return res;
        };

        return descriptor;
    };
}
