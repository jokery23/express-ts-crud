import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Container } from 'typedi';

import { AppResponseInterface } from '../../shared/types/interfaces/app-response.interface';
import { User } from '../../database/models/user';
import { createPayloadSchema, updatePayloadSchema, idParamSchema, uniqueLoginSchema } from './types/users.schemas';
import { validator } from '../../shared/validators/main.validator';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from './users.service';
import { CreateUserDto } from './types/dto/create-user.dto';

const usersApi: Router = Router();
const usersService = Container.get<UsersService>(USERS_SERVICE_INJECT_TOKEN);

usersApi.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        let { limit = 10, search = '' } = req.query;
        limit = Number(limit);
        search = String(search);

        const users = await usersService.findAll({ search, limit });

        const response: AppResponseInterface<User[]> = {
            data: users
        };

        res.json(response);
    })
);

usersApi.post(
    '/',
    validator.body(createPayloadSchema),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload: CreateUserDto = req.body;

        try {
            await uniqueLoginSchema.validateAsync(payload.login);
        } catch (e) {
            return next(e);
        }

        const user = await usersService.create(payload);

        const response: AppResponseInterface<User> = {
            data: user
        };

        res.json(response);
    })
);

usersApi.put(
    '/:id',
    validator.params(idParamSchema),
    validator.body(updatePayloadSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;
        const user = await usersService.update(id, payload);

        const response: AppResponseInterface<User> = {
            data: user
        };

        res.json(response);
    })
);

usersApi.get(
    '/:id',
    validator.params(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const user = await usersService.findOne(id);

        const response: AppResponseInterface<User> = {
            data: user
        };

        res.json(response);
    })
);

usersApi.delete(
    '/:id',
    validator.params(idParamSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const user = await usersService.remove(id);

        const response: AppResponseInterface<User> = {
            data: user
        };

        res.json(response);
    })
);

export default usersApi;
