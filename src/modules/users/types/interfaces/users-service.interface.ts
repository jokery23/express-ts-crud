import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../../../database/models/user';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindAllUsersDto } from '../dto/find-all-users.dto';

export interface UsersServiceInterface {
    findAll(params: FindAllUsersDto): Promise<User[]>;

    findOne(id: string): Promise<User | null>;

    findOneByField(field: string, value: unknown): Promise<User | null>;

    create(payload: CreateUserDto): Promise<User | null>;

    update(id: string, payload: UpdateUserDto): Promise<User | null>;

    remove(id: string): Promise<User | null>;
}
