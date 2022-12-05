import { User } from "../types/user.model";

export type CreateUserDto = Pick<User, 'login' | 'password' | 'age'>