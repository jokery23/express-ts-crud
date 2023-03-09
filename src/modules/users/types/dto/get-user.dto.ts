import { User } from '../../../../database/models/user';

export type GetUserDto = Pick<User, 'id' | 'login' | 'age'>;
