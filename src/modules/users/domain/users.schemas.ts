import Joi, { CustomHelpers, ErrorReport } from 'joi';

import { User } from './user.model';
import { userService } from '../users.service';

export const createPayloadSchema = Joi.object<User>({
    id: Joi.string().required(),
    login: Joi.string()
        .email()
        .required()
        .custom(isUniqueLogin)
        .messages({ 'custom.login.exists': 'User with specified login already exists' }),
    password: Joi.string().alphanum().required(),
    age: Joi.number().integer().min(4).max(120).required(),
    isDeleted: Joi.boolean().required()
});

export const updatePayloadSchema = Joi.object<User>({
    login: Joi.string().email(),
    password: Joi.string().alphanum(),
    age: Joi.number().integer().min(4).max(120),
    isDeleted: Joi.boolean()
});

export const updateParamsSchema = Joi.object<User>({
    id: Joi.string().required()
});

function isUniqueLogin(login: keyof User, helper: CustomHelpers): keyof User | ErrorReport {
    if (userService.findOneByField('login', login)) {
        return helper.error('custom.login.exists');
    }

    return login;
}
