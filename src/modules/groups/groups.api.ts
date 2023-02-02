import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import GroupsController from './groups.controller';
import { AppResponseInterface } from '../../shared/types/interfaces/app-response.interface';
import { Group } from '../../database/models/group';
import { createPayloadSchema, updatePayloadSchema, idParamSchema } from './types/groups.schemas';
import { validator } from '../../shared/validators/main.validator';

const groupsApi: Router = Router();
const groupsController = Container.get(GroupsController);

groupsApi.get('/', async (req: Request, res: Response) => {
    const groups = await groupsController.findAll();

    const response: AppResponseInterface<Group[]> = {
        data: groups
    };

    res.json(response);
});

groupsApi.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    try {
        await createPayloadSchema.validateAsync(payload);
    } catch (e) {
        return next(e);
    }

    const user = await groupsController.createGroup(payload);

    const response: AppResponseInterface<Group> = {
        data: user
    };

    res.json(response);
});

groupsApi.put(
    '/:id',
    validator.params(idParamSchema),
    validator.body(updatePayloadSchema),
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;
        const group = await groupsController.updateGroup(id, payload);

        const response: AppResponseInterface<Group> = {
            data: group
        };

        res.json(response);
    }
);

groupsApi.get('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const group = await groupsController.findOne(id);

    const response: AppResponseInterface<Group> = {
        data: group
    };

    res.json(response);
});

groupsApi.delete('/:id', validator.params(idParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const group = await groupsController.remove(id);

    const response: AppResponseInterface<Group> = {
        data: group
    };

    res.json(response);
});

export default groupsApi;
