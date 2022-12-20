import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/users/domain/user.model';

const generateAge = () => Math.floor(Math.random() * (40 - 18) + 18);
const generatePassword = () => uuidv4().split('-').join('').substring(0, 12);

export const predefinedUsers: User[] = [
    {
        id: uuidv4(),
        login: 'john_doe',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'peter_schmeichel',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'luke_skywalker',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'peter_parker',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'luke_show',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    }
];
