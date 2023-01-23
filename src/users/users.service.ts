import { Service, Token } from 'typedi';
import { UsersServiceInterface } from './domain/interfaces/users-service.interface';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResDto } from './domain/dto/create-user-res.dto';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import { FindAllUsersDto } from './domain/dto/find-all-users.dto';
import { User } from '../database/models/user';
import { FindOptions, Op } from 'sequelize';

export const USERS_SERVICE_INJECT_TOKEN = new Token<UsersService>('USERS_SERVICE_INJECT_TOKEN');

@Service(USERS_SERVICE_INJECT_TOKEN)
export default class UsersService implements UsersServiceInterface {
    async findAll(params: FindAllUsersDto): Promise<User[]> {
        const findOptions: FindOptions = {
            limit: params.limit,
            order: [['login', 'asc']]
        };

        if (params.search) {
            findOptions.where = {
                login: {
                    [Op.like]: `%${params.search}%`
                }
            };
        }
        return await User.findAll(findOptions);
    }

    async create(payload: CreateUserDto): Promise<CreateUserResDto> {
        let user: User | null;
        try {
            user = await User.create(payload);
        } catch (e) {
            console.error(`[Error][Create user]: ${e}`);
        }
        return user;
    }

    async update(id: number, payload: UpdateUserDto): Promise<User | null> {
        let user: User | null;
        try {
            user = await User.findByPk(id);
            if (user) {
                user = await user.update(payload);
            }
        } catch (e) {
            console.error(`[Error][Update user]: ${e.message || e}`);
        }
        return user;
    }

    async findOne(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }

    async findOneByField(field: string, value: unknown): Promise<User | null> {
        return await User.findOne({
            where: {
                [field]: {
                    [Op.eq]: value
                }
            }
        });
    }

    async remove(id: number): Promise<User | null> {
        const user = await User.findByPk(id);

        if (user) {
            user.isDeleted = true;
            await user.save();
        }

        return user;
    }
}
