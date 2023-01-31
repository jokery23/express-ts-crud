import { createValidator, ExpressJoiContainerConfig, ExpressJoiInstance } from 'express-joi-validation';
import { HttpStatusCode } from '../types/enums/http-status-code.enum';

const validateConfig: ExpressJoiContainerConfig = {
    passError: true,
    statusCode: HttpStatusCode.BadRequest
};

export const validator: ExpressJoiInstance = createValidator(validateConfig);
