import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, fn } from 'sequelize';
import { connection } from '../index';

export const GROUP_TABLE_NAME = 'Groups';

export enum GroupPermissionEnum {
    READ = 'READ',
    WRITE = 'WRITE',
    DELETE = 'DELETE',
    SHARE = 'SHARE',
    UPLOAD_FILES = 'UPLOAD_FILES'
}

type GroupPermission = keyof typeof GroupPermissionEnum;

export const groupPermissionValues = Object.values(GroupPermissionEnum);

export class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>> {
    declare id: CreationOptional<string>;

    declare name: string;

    declare permissions: GroupPermission[];
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: fn('uuid_generate_v4'),
            primaryKey: true
        },
        name: {
            type: new DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        permissions: {
            type: new DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        sequelize: connection,
        tableName: GROUP_TABLE_NAME
    }
);
