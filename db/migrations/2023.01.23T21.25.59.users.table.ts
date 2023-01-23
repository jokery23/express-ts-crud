import { MigrationFn } from 'umzug';
import { User, USER_TABLE_NAME } from '../../src/database/models/user';
import { Migration } from '../umzug';

/*
export const up: MigrationFn<User> = async () => await User.sync();
export const down: MigrationFn<User> = async () => await User.drop();
 */

export const up: Migration = async ({ context: sequelize }) => {
    console.log('up....');
    await User.sync({ force: true });
    /*
  await sequelize.getQueryInterface().createTable('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
   */
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(USER_TABLE_NAME);
};
