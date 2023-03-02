import { createValidator, ExpressJoiContainerConfig, ExpressJoiInstance } from 'express-joi-validation';
import { StatusCodes } from 'http-status-codes';

const validateConfig: ExpressJoiContainerConfig = {
    passError: true,
    statusCode: StatusCodes.BAD_REQUEST
};

export const validator: ExpressJoiInstance = createValidator(validateConfig);
