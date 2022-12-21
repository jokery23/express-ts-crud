import { v4 as uuidv4 } from 'uuid';

import { predefinedUsers } from '../../seeds/users.seeds';

import { User } from './domain/user.model';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { RemoveUserResponseDto } from './domain/dto/remove-user-response.dto';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { CreateUserResponseDto } from './domain/dto/create-user-response.dto';
import { UpdateUserResponseDto } from './domain/dto/update-user-response.dto';

export class UsersService {
    private users: User[] = [];

    constructor() {
        this.users.push(...predefinedUsers);
    }

    getAutoSuggestUsers(loginSubstring = '', limit = 10): User[] {
        let users: User[] = this.users.sort(this.sortByLogin);

        if (loginSubstring) {
            users = users.filter((user) => user.login.toLowerCase().includes(loginSubstring));
        }

        return users.slice(0, limit);
    }

    findOne(id: string): User | null {
        return this.users.find((user) => user.id === id) || null;
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
        const index = this.users.findIndex((user) => user.id === id);
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
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
            this.users[index] = {
                ...this.users[index],
                isDeleted: true
            };
        } else {
            return null;
        }

        return id;
    }

    private sortByLogin(userA: User, userB: User): number {
        const nameA = userA.login.toLowerCase();
        const nameB = userB.login.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }
}
