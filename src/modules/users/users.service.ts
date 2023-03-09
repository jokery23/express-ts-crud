import { Service, Token } from 'typedi';
import { UsersServiceInterface } from './types/interfaces/users-service.interface';
import { CreateUserDto } from './types/dto/create-user.dto';
import { UpdateUserDto } from './types/dto/update-user.dto';
import { FindAllUsersParamsDto } from './types/dto/find-all-users-params.dto';
import { User } from '../../database/models/user';
import { FindOptions, Op } from 'sequelize';
import logExecution from '../../logger/decorators/logExecution';
import { GetUserDto } from './types/dto/get-user.dto';

export const USERS_SERVICE_INJECT_TOKEN = new Token<UsersService>('USERS_SERVICE_INJECT_TOKEN');

@Service(USERS_SERVICE_INJECT_TOKEN)
export default class UsersService implements UsersServiceInterface {
    @logExecution()
    async findAll(params: FindAllUsersParamsDto): Promise<GetUserDto[]> {
        const findOptions: FindOptions = {
            include: 'groups',
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

    @logExecution()
    async create(payload: CreateUserDto): Promise<GetUserDto | null> {
        let user: User | null;
        try {
            user = await User.create(payload);
        } catch (e) {
            console.error(`[Error][Create user]: ${e}`);
        }
        return user;
    }

    @logExecution()
    async update(id: string, payload: UpdateUserDto): Promise<GetUserDto | null> {
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

    @logExecution()
    async findOne(id: string): Promise<GetUserDto | null> {
        return await User.findByPk(id);
    }

    async findOneByField(field: string, value: unknown): Promise<GetUserDto | null> {
        return await User.findOne({
            where: {
                [field]: {
                    [Op.eq]: value
                }
            }
        });
    }

    @logExecution()
    async remove(id: string): Promise<GetUserDto | null> {
        const user = await User.findByPk(id);

        if (user) {
            await user.destroy({ force: true });
        }

        return user;
    }
}
