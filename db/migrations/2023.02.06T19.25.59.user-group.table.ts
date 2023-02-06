import { UserGroup, USER_GROUP_TABLE_NAME } from '../../src/database/models/user-group';
import { Migration } from '../umzug';

export const up: Migration = async () => {
    await UserGroup.sync({ force: true });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(USER_GROUP_TABLE_NAME);
};
