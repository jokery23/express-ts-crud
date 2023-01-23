import type { Seeder } from '../umzug';
import { v4 as uuidv4 } from 'uuid';
import { USER_TABLE_NAME } from '../../src/database/models/user';

const generateAge = () => Math.floor(Math.random() * (40 - 18) + 18);
const generatePassword = () => uuidv4().split('-').join('').substring(0, 12);

const logins = ['john_doe@test.dev', 'luke_show@test.dev', 'peter_parker@test.dev', 'peter_schmeichel@test.dev'];

export const up: Seeder = async ({ context }) => {
    const seedUsers = logins.map((login) => ({
        login,
        password: generatePassword(),
        age: generateAge(),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }));
    await context.getQueryInterface().bulkInsert(USER_TABLE_NAME, seedUsers);
};

export const down: Seeder = async ({ context }) => {
    await context.getQueryInterface().bulkDelete(USER_TABLE_NAME, null);
};
