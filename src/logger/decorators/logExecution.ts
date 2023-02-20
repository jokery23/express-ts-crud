import logger from '../index';
import { isDecoratorEnabled } from '../../config/logger';

export default function logExecution() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const childFunction = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            let res: any;
            const start = Date.now();

            if (isDecoratorEnabled) {
                try {
                    res = await childFunction.apply(this, args);
                } catch (e) {
                    logger.error(
                        `[Decorator Error] method:${propertyKey}; args=${JSON.stringify(args)}; message='${
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
            } else {
                res = await childFunction.apply(this, args);
            }

            return res;
        };

        return descriptor;
    };
}
