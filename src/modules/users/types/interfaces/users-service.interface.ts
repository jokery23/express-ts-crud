import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindAllUsersParamsDto } from '../dto/find-all-users-params.dto';
import { GetUserDto } from '../dto/get-user.dto';

export interface UsersServiceInterface {
    findAll(params: FindAllUsersParamsDto): Promise<GetUserDto[]>;

    findOne(id: string): Promise<GetUserDto | null>;

    findOneByField(field: string, value: unknown): Promise<GetUserDto | null>;

    create(payload: CreateUserDto): Promise<GetUserDto | null>;

    update(id: string, payload: UpdateUserDto): Promise<GetUserDto | null>;

    remove(id: string): Promise<GetUserDto | null>;
}
