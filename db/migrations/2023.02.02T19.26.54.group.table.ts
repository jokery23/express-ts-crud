import { GROUP_TABLE_NAME } from '../../src/database/models/group';
import { Migration } from '../umzug';
import { DataTypes, fn } from 'sequelize';

export const up: Migration = async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();

    try {
        await sequelize.getQueryInterface().createTable(GROUP_TABLE_NAME, {
            id: {
                type: DataTypes.UUID,
                defaultValue: fn('uuid_generate_v4'),
                primaryKey: true
            },
            name: {
                type: new DataTypes.STRING(64),
                allowNull: false,
                unique: true
            },
            permissions: {
                type: new DataTypes.ARRAY(DataTypes.STRING),
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
    await sequelize.getQueryInterface().dropTable(GROUP_TABLE_NAME);
};
