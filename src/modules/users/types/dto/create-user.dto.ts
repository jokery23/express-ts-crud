import { User } from '../../../../database/models/user';

export type CreateUserDto = Pick<User, 'login' | 'password' | 'age'>;
