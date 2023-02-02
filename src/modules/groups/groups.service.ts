import { Service, Token } from 'typedi';
import { GroupsServiceInterface } from './types/interfaces/groups-service.interface';
import { CreateGroupDto } from './types/dto/create-group.dto';
import { UpdateGroupDto } from './types/dto/update-group.dto';
import { Group } from '../../database/models/group';
import { Op } from 'sequelize';

export const GROUPS_SERVICE_INJECT_TOKEN = new Token<GroupsService>('GROUPS_SERVICE_INJECT_TOKEN');

@Service(GROUPS_SERVICE_INJECT_TOKEN)
export default class GroupsService implements GroupsServiceInterface {
    async findAll(): Promise<Group[]> {
        return await Group.findAll();
    }

    async create(payload: CreateGroupDto): Promise<Group | null> {
        let group: Group | null;
        try {
            group = await Group.create(payload);
        } catch (e) {
            console.error(`[Error][Create group]: ${e}`);
        }
        return group;
    }

    async update(id: string, payload: UpdateGroupDto): Promise<Group | null> {
        let group: Group | null;
        try {
            group = await Group.findByPk(id);
            if (group) {
                group = await group.update(payload);
            } else {
                throw Error(`Group with id ${id} not found`);
            }
        } catch (e) {
            console.error(`[Error][Update group]: ${e.message || e}`);
        }
        return group;
    }

    async findOne(id: string): Promise<Group | null> {
        return await Group.findByPk(id);
    }

    async findOneByField(field: string, value: unknown): Promise<Group | null> {
        return await Group.findOne({
            where: {
                [field]: {
                    [Op.eq]: value
                }
            }
        });
    }

    async remove(id: string): Promise<Group | null> {
        const group = await Group.findByPk(id);

        if (group) {
            await group.destroy({ force: true });
        }

        return group;
    }
}
