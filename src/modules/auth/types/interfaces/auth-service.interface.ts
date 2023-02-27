import { CreateTokenDto } from '../dto/create-token.dto';

export interface AuthServiceInterface {
    createToken(params: CreateTokenDto): Promise<string>;
}
