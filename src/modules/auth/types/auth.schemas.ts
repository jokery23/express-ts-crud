import Joi from 'joi';

interface TokenPayload {
    username: string;
    password: string;
}

export const createTokenPayloadSchema = Joi.object<TokenPayload>({
    username: Joi.string().email().required(),
    password: Joi.string().required()
});
