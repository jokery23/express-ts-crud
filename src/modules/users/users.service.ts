import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

import { getPredefinedUsers } from '../../seeds/users.seeds';

import { User } from './domain/user.model';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { RemoveUserResponseDto } from './domain/dto/remove-user-response.dto';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { CreateUserResponseDto } from './domain/dto/create-user-response.dto';
import { UpdateUserResponseDto } from './domain/dto/update-user-response.dto';

export class UsersService {
    private users: User[] = [];

    constructor() {
        this.users.push(...getPredefinedUsers());
    }

    getAutoSuggestUsers(loginSubstring = '', limit = 10): User[] {
        let users: User[] = _.sortBy<User>(this.users, 'login');

        if (loginSubstring) {
            users = _.filter<User>(users, (user) => user.login.toLowerCase().includes(loginSubstring));
        }

        return _.take(users, limit);
    }

    findOne(id: string): User | null {
        return this.findOneByField('id', id);
    }

    create(createUser: CreateUserDto): CreateUserResponseDto {
        createUser.age = +createUser.age;

        const user: User = {
            id: uuidv4(),
            isDeleted: false,
            ...createUser
        };

        this.users.push(user);

        return user;
    }

    update(id: string, payload: UpdateUserDto): UpdateUserResponseDto {
        const index = _.findIndex<User>(this.users, (user) => user.id === id);
        if (index !== -1) {
            this.users[index] = {
                ...this.users[index],
                ...payload
            };

            return this.users[index];
        }

        return null;
    }

    remove(id: string): RemoveUserResponseDto {
        const removed = _.remove<User>(this.users, (user) => user.id === id);

        return removed.length > 0 ? id : null;
    }

    findOneByField(field: keyof User, value: any): User | null {
        return _.find<User>(this.users, (user) => user[field] === value) || null;
    }
}

export const userService = new UsersService();
