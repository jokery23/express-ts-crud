import request from 'supertest';
import Chance from 'chance';
import { v4 as uuidv4 } from 'uuid';
import app from '../../app';
import { Container } from 'typedi';
import GroupsService, { GROUPS_SERVICE_INJECT_TOKEN } from './groups.service';
import { AppErrorInterface } from '../../shared/types/interfaces/app-error.interface';
import { ROUTES } from '../../loaders/routes';
import { StatusCodes } from 'http-status-codes';
import { Group, GroupPermissionEnum, groupPermissionValues } from '../../database/models/group';
import { InternalServerError, NotFound } from 'http-errors';

const chance = new Chance();
const definedGroups = getDefinedGroups();
const BASE_URL = ROUTES.GROUPS;

describe('Test groups api', () => {
    let groupsService: GroupsService;

    beforeEach(async () => {
        groupsService = Container.get<GroupsService>(GROUPS_SERVICE_INJECT_TOKEN);
    });

    test('should return all groups, status is OK', async () => {
        groupsService.findAll = jest.fn().mockReturnValue(definedGroups);
        const response = await request(app).get(BASE_URL);

        expect(response.body.data).toEqual(definedGroups);
        expect(response.statusCode).toEqual(StatusCodes.OK);
    });

    describe('get group by id', () => {
        test('should return group by id, status is OK', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            groupsService.findOne = jest.fn().mockReturnValue(group);
            const response = await request(app).get(`${BASE_URL}/${group.id}`);

            expect(response.body.data).toEqual(group);
            expect(response.statusCode).toEqual(StatusCodes.OK);
        });

        test('should return 404 status, group not found', async () => {
            groupsService.findOne = jest.fn().mockReturnValue(null);
            const notExistingId = uuidv4();
            const response = await request(app).get(`${BASE_URL}/${notExistingId}`);

            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        });

        test('should return error by wrong id format', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            groupsService.findOne = jest.fn().mockReturnValue(group);
            const wrongUuid = 'wrong-uuid';
            const response = await request(app).get(`${BASE_URL}/${wrongUuid}`);

            const errors: AppErrorInterface[] = response.body.errors;
            const hasWrongId = errors.some(({ field }) => field === 'id');

            expect(hasWrongId).toEqual(true);
            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('create group', () => {
        let group: Partial<Group>;
        let payload: Partial<Group>;

        beforeAll(() => {
            group = chance.pickone(definedGroups);
        });

        beforeEach(() => {
            groupsService.create = jest.fn().mockReturnValue(group);
            payload = {};
        });

        test('should return created group, status is CREATED', async () => {
            payload = {
                name: 'new_group',
                permissions: [GroupPermissionEnum.READ]
            };
            const createdGroup = { id: uuidv4(), ...payload };

            groupsService.findOneByField = jest.fn().mockReturnValue(null);
            groupsService.create = jest.fn().mockReturnValue(createdGroup);
            const response = await request(app).post(BASE_URL).send(payload);

            expect(response.body.data).toEqual(createdGroup);
            expect(response.statusCode).toEqual(StatusCodes.CREATED);
        });

        test('should return errors about required fields', async () => {
            const response = await request(app).post(BASE_URL).send(payload);

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['name', 'permissions'];
            const actualErrorsKeys = errors
                .filter(({ message }) => message.includes('required'))
                .map(({ field }) => field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);
            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return errors about invalid fields', async () => {
            const response = await request(app)
                .post(`${BASE_URL}`)
                .send({
                    name: 123,
                    permissions: ['wrong_permission']
                });

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['name', 'permissions'];
            const actualErrorsKeys = errors.map((error: AppErrorInterface) => error.field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('update group', () => {
        test('should return updated group, status is OK', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            const { id, ...payload }: Partial<Group> = group;
            groupsService.update = jest.fn().mockReturnValue(group);

            const response = await request(app).put(`${BASE_URL}/${id}`).send(payload);

            expect(response.body.data).toEqual(group);
            expect(response.statusCode).toEqual(StatusCodes.OK);
        });

        test('should return error about not allowed fields, status 400', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            const { id, ...payload }: Partial<Group> = group;
            groupsService.update = jest.fn().mockReturnValue(group);

            const response = await request(app)
                .put(`${BASE_URL}/${id}`)
                .send({
                    wrongField: 'wrongValue',
                    wrongField2: 'wrongValue2',
                    ...payload
                });

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['wrongField', 'wrongField2'];
            const actualErrorsKeys = errors.map((error: AppErrorInterface) => error.field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('delete group', () => {
        test('should return 204 status, group was deleted', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            groupsService.remove = jest.fn().mockReturnValue(group);

            const response = await request(app).delete(`${BASE_URL}/${group.id}`);

            expect(response.body.data).toBeFalsy();
            expect(response.statusCode).toEqual(StatusCodes.NO_CONTENT);
        });

        test('should return 404 status, group not found', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            groupsService.remove = jest.fn().mockReturnValue(null);

            const response = await request(app).delete(`${BASE_URL}/${group.id}`);

            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        });
    });

    describe('add users to group', () => {
        test('should return errors about wrong payload', async () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            groupsService.addUsersToGroup = jest.fn().mockImplementation(null);

            const response = await request(app).post(`${BASE_URL}/${group.id}/add-users`).send({});

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['userIds'];
            const actualErrorsKeys = errors.map((error: AppErrorInterface) => error.field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);

            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        describe('should return errors', () => {
            const group: Partial<Group> = chance.pickone(definedGroups);
            const payload = { userIds: [uuidv4(), uuidv4()] };

            test('should return 404', async () => {
                groupsService.addUsersToGroup = jest.fn().mockImplementation(throwNotFound);

                const response = await request(app).post(`${BASE_URL}/${group.id}/add-users`).send(payload);

                expect(response.body.errors).toBeTruthy();
                expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
            });

            test('should return internal server error', async () => {
                groupsService.addUsersToGroup = jest.fn().mockImplementation(throwInternalServerError);

                const response = await request(app).post(`${BASE_URL}/${group.id}/add-users`).send(payload);

                expect(response.body.errors).toBeTruthy();
                expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            });

            test('should throw basic error and return like internal server error', async () => {
                groupsService.addUsersToGroup = jest.fn().mockImplementation(throwBasicError);

                const response = await request(app).post(`${BASE_URL}/${group.id}/add-users`).send(payload);

                expect(response.body.errors).toBeTruthy();
                expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        });
    });
});

function getDefinedGroups(): Partial<Group>[] {
    return [
        {
            id: uuidv4(),
            name: 'admin',
            permissions: [...groupPermissionValues]
        },
        {
            id: uuidv4(),
            name: 'view_user',
            permissions: [GroupPermissionEnum.READ]
        }
    ];
}

function throwNotFound(): never {
    throw NotFound(`Group not found`);
}

function throwInternalServerError(): never {
    throw InternalServerError('Internal server error');
}

function throwBasicError(): never {
    throw Error('Basic error');
}
