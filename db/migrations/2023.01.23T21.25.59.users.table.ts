import { User, USER_TABLE_NAME } from '../../src/database/models/user';
import { Migration } from '../umzug';

export const up: Migration = async () => {
    await User.sync({ force: true });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(USER_TABLE_NAME);
};
