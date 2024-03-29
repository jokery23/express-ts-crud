import Joi, { ErrorReport } from 'joi';

import { Group, groupPermissionValues } from '../../../database/models/group';
import { Container } from 'typedi';
import GroupsService, { GROUPS_SERVICE_INJECT_TOKEN } from '../groups.service';

const groupService: GroupsService = Container.get(GROUPS_SERVICE_INJECT_TOKEN);

const nameRule = Joi.string();
const permissionsRule = Joi.array().items(Joi.valid(...groupPermissionValues));
const userIdsRule = Joi.array().items(Joi.string().uuid());

export const createPayloadSchema = Joi.object<Group>({
    name: nameRule.required(),
    permissions: permissionsRule.required()
});

export const uniqueNameSchema = nameRule.external(async (name) => await isUniqueName(name));

export const addUsersPayloadSchema = Joi.object({
    userIds: userIdsRule.required()
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
        throw new Error(`Group with specified name(${name}) already exists`);
    }

    return undefined;
}
