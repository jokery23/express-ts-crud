import { Service, Token } from 'typedi';
import { AuthServiceInterface } from './types/interfaces/auth-service.interface';
import logExecution from '../../logger/decorators/logExecution';
import { CreateTokenDto } from './types/dto/create-token.dto';
import * as jwt from 'jsonwebtoken';
import { GetUserDto } from '../users/types/dto/get-user.dto';
import { User } from '../../database/models/user';
import { Op } from 'sequelize';
import { getJWTSecret } from '../../shared/config.helper';

export const AUTH_SERVICE_INJECT_TOKEN = new Token<AuthService>('AUTH_SERVICE_INJECT_TOKEN');

@Service(AUTH_SERVICE_INJECT_TOKEN)
export default class AuthService implements AuthServiceInterface {
    @logExecution()
    createToken(payload: CreateTokenDto): Promise<string> {
        const token = jwt.sign(payload, getJWTSecret(), { expiresIn: '1800s' });

        return Promise.resolve(token);
    }

    async getUserById(value: string): Promise<GetUserDto | null> {
        return await User.findOne({
            where: {
                id: {
                    [Op.eq]: value
                }
            }
        });
    }
}
