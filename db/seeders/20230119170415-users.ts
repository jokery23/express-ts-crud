const { v4: uuidv4 } = require('uuid');
const USER_TABLE_NAME = 'Users';

const generateAge = () => Math.floor(Math.random() * (40 - 18) + 18);
const generatePassword = () => uuidv4().split('-').join('').substring(0, 12);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: any) {
        const logins = [
            'john_doe@test.dev',
            'luke_show@test.dev',
            'peter_parker@test.dev',
            'peter_schmeichel@test.dev'
        ];

        await queryInterface.bulkInsert(
            USER_TABLE_NAME,
            logins.map((login) => ({
                login,
                password: generatePassword(),
                age: generateAge(),
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            {}
        );
    },

    async down(queryInterface: any) {
        await queryInterface.bulkDelete(USER_TABLE_NAME, null, {});
    }
};
