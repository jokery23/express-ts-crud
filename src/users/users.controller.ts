import { UsersServiceInterface } from './domain/interfaces/users-service.interface';

import { FindAllUsersDto } from './domain/dto/find-all-users.dto';
import { Service, Inject } from 'typedi';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from './users.service';
import { User } from '../database/models/user';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { UpdateUserDto } from './domain/dto/update-user.dto';

@Service()
export default class UsersController {
    constructor(@Inject(USERS_SERVICE_INJECT_TOKEN) private readonly usersService: UsersService) {}

    async findAll(params: FindAllUsersDto): Promise<User[]> {
        return await this.usersService.findAll(params);
    }

    async createUser(payload: CreateUserDto): Promise<any> {
        return await this.usersService.create(payload);
    }

    async updateUser(id: number, payload: UpdateUserDto): Promise<any> {
        return await this.usersService.update(id, payload);
    }

    async findOne(id: number): Promise<User | null> {
        return await this.usersService.findOne(+id);
    }

    async remove(id: number): Promise<User | null> {
        return await this.usersService.remove(+id);
    }
}
