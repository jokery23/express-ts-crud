import { USER_TABLE_NAME } from '../../src/database/models/user';
import { Migration } from '../umzug';
import { DataTypes, fn } from 'sequelize';

export const up: Migration = async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();

    try {
        await sequelize.getQueryInterface().createTable(USER_TABLE_NAME, {
            id: {
                type: DataTypes.UUID,
                defaultValue: fn('uuid_generate_v4'),
                primaryKey: true
            },
            login: {
                type: new DataTypes.STRING(128),
                allowNull: false,
                unique: true
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            age: {
                type: DataTypes.SMALLINT,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });

        transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(USER_TABLE_NAME);
};
