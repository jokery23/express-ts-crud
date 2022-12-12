import { v4 as uuidv4 } from 'uuid';

import { User } from "./domain/user.model";
import { CreateUserDto } from "./dto/create-user.dto";

const users: User[] = [];

export function find(): User[] {

  return users;
}

export function findOne(id: string): User | null {

  return users.find( user => user.id === id) || null;
}

export function create(createUser: CreateUserDto): User | null {

  createUser.age = +createUser.age;

  const user: User = {
    id: uuidv4(),
    isDeleted: false,
    ...createUser,
  };

  users.push(user);

  return user;
}

export function update(id: string): User | null {
  const user = users.find( user => user.id === id);

  if (user) {

  }

  return user;
}

export function remove(id: string): string | null {

  const index = users.findIndex( user => user.id === id);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      isDeleted: true
    }
  } else {
    return null;
  }

  return id;
}