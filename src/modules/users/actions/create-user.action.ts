import { CreateUserPayloadDto } from '../types/create-user-payload.dto';
import AppDataSource from '../../../app-data-source';
import { User } from '../../../entities/user';

import {
  validate,
} from 'class-validator';

export const createUser = async (payload: CreateUserPayloadDto): Promise<User> => {
  const createdUser: User = { ...payload };
  const repository = AppDataSource.getRepository(User);

  console.log(createdUser);

  const errors = await validate(createdUser);
  console.log('Errors: ', errors);

  // const user = await repository.save(createdUser);

  return createdUser;
}