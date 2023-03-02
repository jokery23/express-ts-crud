import { Service, Token } from 'typedi';
import { AuthServiceInterface } from './types/interfaces/auth-service.interface';
import logExecution from '../../logger/decorators/logExecution';
import { CreateTokenDto } from './types/dto/create-token.dto';
import * as jwt from 'jsonwebtoken';
import process from 'node:process';

export const AUTH_SERVICE_INJECT_TOKEN = new Token<AuthService>('AUTH_SERVICE_INJECT_TOKEN');

const SECRET = process.env.JWT_TOKEN_SECRET;

@Service(AUTH_SERVICE_INJECT_TOKEN)
export default class AuthService implements AuthServiceInterface {
    @logExecution()
    createToken(payload: CreateTokenDto): Promise<string> {
        const token = jwt.sign(payload, SECRET, { expiresIn: '1800s' });

        return Promise.resolve(token);
    }
}
