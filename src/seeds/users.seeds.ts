import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/users/domain/user.model';

const generateAge = () => Math.floor(Math.random() * (40 - 18) + 18);
const generatePassword = () => uuidv4().split('-').join('').substring(0, 12);

const predefinedUsers: User[] = [
    {
        id: uuidv4(),
        login: 'john_doe@dev.dev',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'peter_schmeichel@dev.dev',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'luke_skywalker@dev.dev',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'alex_parker@dev.dev',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    },
    {
        id: uuidv4(),
        login: 'luke_show@dev.dev',
        isDeleted: false,
        age: generateAge(),
        password: generatePassword()
    }
];

export const getPredefinedUsers = (): User[] => {
    return predefinedUsers;
};
