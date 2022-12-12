import { User } from "../domain/user.model";

export type CreateUserDto = Pick<User, 'login' | 'password' | 'age'>