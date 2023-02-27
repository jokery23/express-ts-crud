import { Service, Token } from 'typedi';
import { AuthServiceInterface } from './types/interfaces/auth-service.interface';
import logExecution from '../../logger/decorators/logExecution';
import { CreateTokenDto } from './types/dto/create-token.dto';

export const AUTH_SERVICE_INJECT_TOKEN = new Token<AuthService>('AUTH_SERVICE_INJECT_TOKEN');

@Service(AUTH_SERVICE_INJECT_TOKEN)
export default class AuthService implements AuthServiceInterface {
    @logExecution()
    createToken({ password, username }: CreateTokenDto): Promise<string> {
        return Promise.resolve(`token-${password}-${username}`);
    }
}
