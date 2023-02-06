import { Group, GROUP_TABLE_NAME } from '../../src/database/models/group';
import { Migration } from '../umzug';

export const up: Migration = async () => {
    await Group.sync({ force: true });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(GROUP_TABLE_NAME);
};
