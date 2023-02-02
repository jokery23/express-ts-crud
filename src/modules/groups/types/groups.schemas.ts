import Joi, { ErrorReport } from 'joi';

import { Group, groupPermissionValues } from '../../../database/models/group';
import { Container } from 'typedi';
import GroupsService, { GROUPS_SERVICE_INJECT_TOKEN } from '../groups.service';

const groupService: GroupsService = Container.get(GROUPS_SERVICE_INJECT_TOKEN);

const nameRule = Joi.string();
const permissionsRule = Joi.valid(...groupPermissionValues);

export const createPayloadSchema = Joi.object<Group>({
    name: nameRule.required().external(async (name) => await isUniqueName(name)),
    permissions: permissionsRule.required()
});

export const updatePayloadSchema = Joi.object<Group>({
    name: nameRule,
    permissions: permissionsRule
});

export const idParamSchema = Joi.object<Group>({
    id: Joi.string().uuid().required()
});

async function isUniqueName(name: keyof Group): Promise<keyof Group | ErrorReport> {
    const result = await groupService.findOneByField('name', name);
    if (result) {
        throw new Error('Group with specified name already exists');
    }

    return undefined;
}
