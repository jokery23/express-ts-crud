import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { AppResponseInterface } from '../../shared/types/interfaces/app-response.interface';
import { Group } from '../../database/models/group';
import {
    createPayloadSchema,
    updatePayloadSchema,
    idParamSchema,
    addUsersPayloadSchema,
    uniqueNameSchema
} from './types/groups.schemas';
import { validator } from '../../shared/validators/main.validator';
import GroupsService, { GROUPS_SERVICE_INJECT_TOKEN } from './groups.service';
import { CreateGroupDto } from './types/dto/create-group.dto';
import { NotFound } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

const groupsApi: Router = Router();
const groupsService = Container.get<GroupsService>(GROUPS_SERVICE_INJECT_TOKEN);

groupsApi.get('/', async (req: Request, res: Response) => {
    const groups = await groupsService.findAll();

    const response: AppResponseInterface<Group[]> = {
        data: groups
    };

    res.json(response);
});

groupsApi.post('/', validator.body(createPayloadSchema), async (req: Request, res: Response, next: NextFunction) => {
    const payload: CreateGroupDto = req.body;

    try {
        await uniqueNameSchema.validateAsync(payload.name);
    } catch (e) {
        return next(e);
    }

    const user = await groupsService.create(payload);

    const response: AppResponseInterface<Group> = {
        data: user
    };

    res.status(StatusCodes.CREATED).json(response);
});

groupsApi.put(
    '/:id',
    validator.params(idParamSchema),
    validator.body(updatePayloadSchema),
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;
        const group = await groupsService.update(id, payload);

        const response: AppResponseInterface<Group> = {
            data: group
        };

        res.json(response);
    }
);

groupsApi.get('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const group = await groupsService.findOne(id);

    if (!group) {
        throw new NotFound();
    }

    const response: AppResponseInterface<Group> = {
        data: group
    };

    res.json(response);
});

groupsApi.delete('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const group = await groupsService.remove(id);

    if (!group) {
        throw new NotFound();
    }

    res.status(StatusCodes.NO_CONTENT).json();
});

groupsApi.post(
    '/:id/add-users',
    validator.params(idParamSchema),
    validator.body(addUsersPayloadSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { userIds } = req.body;

        const response: AppResponseInterface<string[]> = {
            data: []
        };

        try {
            response.data = await groupsService.addUsersToGroup(id, userIds);
        } catch (e) {
            return next(e);
        }

        res.json(response);
    }
);

export default groupsApi;
