import { Service, Token } from 'typedi';
import { GroupsServiceInterface } from './types/interfaces/groups-service.interface';
import { CreateGroupDto } from './types/dto/create-group.dto';
import { UpdateGroupDto } from './types/dto/update-group.dto';
import { Group } from '../../database/models/group';
import { User } from '../../database/models/user';
import { UserGroup } from '../../database/models/user-group';
import { Op } from 'sequelize';
import { connection } from '../../database';
import logTimeExecution from '../../logger/decorators/logTimeExecution';

export const GROUPS_SERVICE_INJECT_TOKEN = new Token<GroupsService>('GROUPS_SERVICE_INJECT_TOKEN');

@Service(GROUPS_SERVICE_INJECT_TOKEN)
export default class GroupsService implements GroupsServiceInterface {
    @logTimeExecution()
    async findAll(): Promise<Group[]> {
        return await Group.findAll({ include: 'users' });
    }
    @logTimeExecution()
    async create(payload: CreateGroupDto): Promise<Group | null> {
        let group: Group | null;
        try {
            group = await Group.create(payload);
        } catch (e) {
            console.error(`[Error][Create group]: ${e}`);
        }
        return group;
    }

    @logTimeExecution()
    async update(id: string, payload: UpdateGroupDto): Promise<Group | null> {
        let group: Group | null;
        try {
            group = await Group.findByPk(id);
            if (group) {
                group = await group.update(payload);
            } else {
                throw Error(`Group with id(${id}) not found`);
            }
        } catch (e) {
            console.error(`[Error][Update group]: ${e.message || e}`);
        }
        return group;
    }

    @logTimeExecution()
    async findOne(id: string): Promise<Group | null> {
        function sleep(ms: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        await sleep(200);
        return await Group.findByPk(id);
    }

    @logTimeExecution()
    async findOneByField(field: string, value: unknown): Promise<Group | null> {
        return await Group.findOne({
            where: {
                [field]: {
                    [Op.eq]: value
                }
            }
        });
    }

    @logTimeExecution()
    async remove(id: string): Promise<Group | null> {
        const group = await Group.findByPk(id);

        if (group) {
            await group.destroy({ force: true });
        }

        return group;
    }

    @logTimeExecution()
    async addUsersToGroup(groupId: string, userIds: string[]): Promise<string[]> {
        const transaction = await connection.transaction();
        const group = await Group.findByPk(groupId);
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        });

        if (!group) {
            throw Error(`Group with id(${groupId}) not found`);
        }
        if (!users || users.length === 0) {
            throw Error(`Users with ids(${userIds}) not found`);
        }

        try {
            for (let i = 0; i < users.length; i++) {
                await UserGroup.create({ userId: users[i].id, groupId });
            }

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw Error(`[Error][Add users to group]: ${e.message || e}`);
        }

        return userIds;
    }
}
