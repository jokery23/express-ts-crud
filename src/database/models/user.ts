import { CreationOptional, DataTypes, fn, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { connection } from '../index';

export const USER_TABLE_NAME = 'Users';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;

    declare login: string;

    declare password: string;

    declare age: number;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: fn('uuid_generate_v4'),
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
        }
    },
    {
        sequelize: connection,
        tableName: USER_TABLE_NAME,
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        }
    }
);
