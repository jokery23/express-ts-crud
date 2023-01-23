import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { connection } from '../index';

export const USER_TABLE_NAME = 'Users';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;

    declare login: string;

    declare password: string;

    declare age: string;

    declare isDeleted: boolean;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        login: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        age: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                min: 4,
                max: 120
            }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    { sequelize: connection, tableName: USER_TABLE_NAME }
);
