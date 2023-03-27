import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { AppResponseInterface } from '../../shared/types/interfaces/app-response.interface';
import { createPayloadSchema, updatePayloadSchema, idParamSchema, uniqueLoginSchema } from './types/users.schemas';
import { validator } from '../../shared/validators/main.validator';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from './users.service';
import { CreateUserDto } from './types/dto/create-user.dto';
import { NotFound } from 'http-errors';
import { GetUserDto } from './types/dto/get-user.dto';
import { StatusCodes } from 'http-status-codes';

const usersApi: Router = Router();
const usersService = Container.get<UsersService>(USERS_SERVICE_INJECT_TOKEN);

usersApi.get('/', async (req: Request, res: Response) => {
    let { limit = 10, search = '' } = req.query;
    limit = Number(limit);
    search = String(search);

    const users = await usersService.findAll({ search, limit });

    const response: AppResponseInterface<GetUserDto[]> = {
        data: users
    };

    res.json(response);
});

usersApi.post('/', validator.body(createPayloadSchema), async (req: Request, res: Response, next: NextFunction) => {
    const payload: CreateUserDto = req.body;

    try {
        await uniqueLoginSchema.validateAsync(payload.login);
    } catch (e) {
        return next(e);
    }

    const user = await usersService.create(payload);

    const response: AppResponseInterface<GetUserDto> = {
        data: user
    };

    res.status(StatusCodes.CREATED).json(response);
});

usersApi.put(
    '/:id',
    validator.params(idParamSchema),
    validator.body(updatePayloadSchema),
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;
        const user = await usersService.update(id, payload);

        const response: AppResponseInterface<GetUserDto> = {
            data: user
        };

        res.json(response);
    }
);

usersApi.get('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.findOne(id);

    if (!user) {
        throw new NotFound();
    }

    const response: AppResponseInterface<GetUserDto> = {
        data: user
    };

    res.json(response);
});

usersApi.delete('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.remove(id);

    if (!user) {
        throw new NotFound();
    }

    res.status(StatusCodes.NO_CONTENT).json();
});

export default usersApi;
