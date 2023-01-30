import { createValidator, ExpressJoiContainerConfig, ExpressJoiInstance } from 'express-joi-validation';
import { HttpStatusCode } from '../shared/types/enums/http-status-code.enum';

const validateConfig: ExpressJoiContainerConfig = {
    passError: true,
    statusCode: HttpStatusCode.BadRequest
};

export const validator: ExpressJoiInstance = createValidator(validateConfig);
