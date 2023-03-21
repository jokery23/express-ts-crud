import request from 'supertest';
import Chance from 'chance';
import { v4 as uuidv4 } from 'uuid';
import app from '../../app';
import { Container } from 'typedi';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from './users.service';
import { GetUserDto } from './types/dto/get-user.dto';
import { CreateUserDto } from './types/dto/create-user.dto';
import { AppErrorInterface } from '../../shared/types/interfaces/app-error.interface';
import { ROUTES } from '../../loaders/routes';
import { StatusCodes } from 'http-status-codes';

const chance = new Chance();
const definedUsers = getDefinedUsers();
const BASE_URL = ROUTES.USERS;

describe('Test users module', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        usersService = Container.get<UsersService>(USERS_SERVICE_INJECT_TOKEN);
    });

    test('should return all users, status is OK', async () => {
        usersService.findAll = jest.fn().mockReturnValue(definedUsers);
        const response = await request(app).get(BASE_URL);

        expect(response.body.data).toEqual(definedUsers);
        expect(response.statusCode).toEqual(StatusCodes.OK);
    });

    describe('get user by id', () => {
        test('should return user by id, status is OK', async () => {
            const user: GetUserDto = chance.pickone(definedUsers);
            usersService.findOne = jest.fn().mockReturnValue(user);
            const response = await request(app).get(`${BASE_URL}/${user.id}`);

            expect(response.body.data).toEqual(user);
            expect(response.statusCode).toEqual(StatusCodes.OK);
        });

        test('should return 404 status, user not found', async () => {
            usersService.findOne = jest.fn().mockReturnValue(null);
            const notExistingId = uuidv4();
            const response = await request(app).get(`${BASE_URL}/${notExistingId}`);

            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        });

        test('should return error by wrong id format', async () => {
            const user: GetUserDto = chance.pickone(definedUsers);
            usersService.findOne = jest.fn().mockReturnValue(user);
            const wrongUuid = 'wrong-uuid';
            const response = await request(app).get(`${BASE_URL}/${wrongUuid}`);

            const errors: AppErrorInterface[] = response.body.errors;
            const hasWrongId = errors.some(({ field }) => field === 'id');

            expect(hasWrongId).toEqual(true);
            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('creating user', () => {
        let user: GetUserDto;
        let payload: Partial<CreateUserDto>;

        beforeAll(() => {
            user = chance.pickone(definedUsers);
            usersService.create = jest.fn().mockReturnValue(user);
        });

        beforeEach(() => {
            payload = {};
        });

        test('should create user, errors are empty, correct status code is 201', async () => {
            payload = {
                login: 'correct_email@test.dev',
                password: '123password',
                age: 23
            };

            // resolve email is unique
            usersService.findOneByField = jest.fn().mockReturnValue(null);
            usersService.create = jest.fn().mockReturnValue(payload);

            const response = await request(app).post(`${BASE_URL}`).send(payload);

            const errors: AppErrorInterface[] = response.body.errors;

            expect(response.body.data).toEqual(payload);
            expect(errors).toBeFalsy();
            expect(response.statusCode).toEqual(StatusCodes.CREATED);
        });

        test('should return errors about empty required fields', async () => {
            const response = await request(app).post(`${BASE_URL}`).send(payload);

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['login', 'password', 'age'];
            const actualErrorsKeys = errors
                .filter(({ message }) => message.includes('required'))
                .map(({ field }) => field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return errors about invalid fields', async () => {
            payload = {
                login: 'invalid_email',
                password: '123#$%#$%_',
                age: 3
            };
            const response = await request(app).post(`${BASE_URL}`).send(payload);

            const errors: AppErrorInterface[] = response.body.errors;
            const expectedErrorsKeys = ['login', 'password', 'age'];
            const actualErrorsKeys = errors.map((error: AppErrorInterface) => error.field);

            expect(expectedErrorsKeys).toEqual(actualErrorsKeys);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('updating user', () => {
        test('should return updated user, status is OK', async () => {
            const user: GetUserDto = chance.pickone(definedUsers);
            const { id = null, ...payload }: Partial<GetUserDto> = user;
            usersService.update = jest.fn().mockReturnValue(user);

            const response = await request(app).put(`${BASE_URL}/${id}`).send(payload);

            expect(response.body.data).toEqual(user);
            expect(response.statusCode).toEqual(StatusCodes.OK);
        });

        test('should return error about not allowed field, status 400', async () => {
            const user: Partial<GetUserDto> = chance.pickone(definedUsers);
            usersService.update = jest.fn().mockReturnValue(user);

            const response = await request(app).put(`${BASE_URL}/${user.id}`).send(user);

            const errors: AppErrorInterface[] = response.body.errors;
            const hasWrongId = errors.some(({ field }) => field === 'id');

            expect(hasWrongId).toEqual(true);
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });

    describe('deleting user', () => {
        test('should return 204 status, user was deleted', async () => {
            const user: GetUserDto = chance.pickone(definedUsers);
            usersService.remove = jest.fn().mockReturnValue(user);

            const response = await request(app).delete(`${BASE_URL}/${user.id}`);

            expect(response.body.data).toBeFalsy();
            expect(response.statusCode).toEqual(StatusCodes.NO_CONTENT);
        });

        test('should return 404 status, user not found', async () => {
            const user: GetUserDto = chance.pickone(definedUsers);
            usersService.remove = jest.fn().mockReturnValue(null);

            const response = await request(app).delete(`${BASE_URL}/${user.id}`);

            expect(response.body.data).toEqual(null);
            expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        });
    });
});

function getDefinedUsers(): GetUserDto[] {
    const count = chance.integer({ min: 3, max: 5 });
    const users: GetUserDto[] = [];

    for (let i = 0; i < count; i++) {
        users.push({
            id: uuidv4(),
            login: chance.email(),
            age: chance.age({ type: 'adult' })
        });
    }

    return users;
}
