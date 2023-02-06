import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../../../../database/models/group';
import { UpdateGroupDto } from '../dto/update-group.dto';

export interface GroupsServiceInterface {
    findAll(): Promise<Group[]>;

    findOne(id: string): Promise<Group | null>;

    findOneByField(field: string, value: unknown): Promise<Group | null>;

    create(payload: CreateGroupDto): Promise<Group | null>;

    update(id: string, payload: UpdateGroupDto): Promise<Group | null>;

    remove(id: string): Promise<Group | null>;

    addUsersToGroup(groupId: string, userIds: string[]): Promise<string[]>;
}
