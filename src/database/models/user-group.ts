import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { connection } from '../index';
import { User } from './user';
import { Group } from './group';

export const USER_GROUP_TABLE_NAME = 'UserGroup';

export class UserGroup extends Model<InferAttributes<UserGroup>, InferCreationAttributes<UserGroup>> {
    declare userId: string;

    declare groupId: string;
}

UserGroup.init(
    {
        userId: {
            type: DataTypes.UUID
        },
        groupId: {
            type: DataTypes.UUID
        }
    },
    {
        sequelize: connection,
        timestamps: false,
        tableName: USER_GROUP_TABLE_NAME
    }
);

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', as: 'groups' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', as: 'users' });
