import { User } from '../user.model';

export type CreateUserDto = Pick<User, 'login' | 'password' | 'age'>
