import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import UsersController from './users.controller';
import { AppResponseInterface } from '../shared/types/interfaces/app-response.interface';
import { User } from '../database/models/user';
import { createPayloadSchema, updatePayloadSchema, idParamSchema } from './types/users.schemas';
import { validator } from './users.validator';

const usersApi: Router = Router();
const usersController = Container.get(UsersController);

usersApi.get('/', async (req: Request, res: Response) => {
    let { limit = 10, search = '' } = req.query;
    limit = Number(limit);
    search = String(search);
    const users = await usersController.findAll({ search, limit });

    const response: AppResponseInterface<User[]> = {
        data: users
    };

    res.json(response);
});

usersApi.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    try {
        await createPayloadSchema.validateAsync(payload);
    } catch (e) {
        return next(e);
    }

    const user = await usersController.createUser(payload);

    const response: AppResponseInterface<User> = {
        data: user
    };

    res.json(response);
});

usersApi.put(
    '/:id',
    validator.params(idParamSchema),
    validator.body(updatePayloadSchema),
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;
        const user = await usersController.updateUser(+id, payload);

        const response: AppResponseInterface<User> = {
            data: user
        };

        res.json(response);
    }
);

usersApi.get('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersController.findOne(+id);

    const response: AppResponseInterface<User> = {
        data: user
    };

    res.json(response);
});

usersApi.delete('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersController.remove(+id);

    const response: AppResponseInterface<User> = {
        data: user
    };

    res.json(response);
});

export default usersApi;
