import Joi, { ErrorReport } from 'joi';

import { User } from '../../database/models/user';
import { Container } from 'typedi';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from '../users.service';

const userService: UsersService = Container.get(USERS_SERVICE_INJECT_TOKEN);

const loginRule = Joi.string().email();
const passwordRule = Joi.string().alphanum();
const ageRule = Joi.number().integer().min(4).max(120);

export const createPayloadSchema = Joi.object<User>({
    login: loginRule.required().external(async (login) => await isUniqueLogin(login)),
    password: passwordRule.required(),
    age: ageRule.required(),
    isDeleted: Joi.boolean().required()
});

export const updatePayloadSchema = Joi.object<User>({
    login: loginRule,
    password: passwordRule,
    age: ageRule,
    isDeleted: Joi.boolean()
});

export const updateParamsSchema = Joi.object<User>({
    id: Joi.string().required()
});

async function isUniqueLogin(login: keyof User): Promise<keyof User | ErrorReport> {
    const result = await userService.findOneByField('login', login);
    if (result) {
        throw new Error(`User with specified login already exists`);
    }

    return undefined;
}
