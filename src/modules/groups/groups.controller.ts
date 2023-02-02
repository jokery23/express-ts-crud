import { Service, Inject } from 'typedi';
import GroupsService, { GROUPS_SERVICE_INJECT_TOKEN } from './groups.service';
import { Group } from '../../database/models/group';
import { CreateGroupDto } from './types/dto/create-group.dto';
import { UpdateGroupDto } from './types/dto/update-group.dto';

@Service()
export default class GroupsController {
    constructor(@Inject(GROUPS_SERVICE_INJECT_TOKEN) private readonly groupsService: GroupsService) {}

    async findAll(): Promise<Group[]> {
        return await this.groupsService.findAll();
    }

    async createGroup(payload: CreateGroupDto): Promise<any> {
        return await this.groupsService.create(payload);
    }

    async updateGroup(id: string, payload: UpdateGroupDto): Promise<any> {
        return await this.groupsService.update(id, payload);
    }

    async findOne(id: string): Promise<Group | null> {
        return await this.groupsService.findOne(id);
    }

    async remove(id: string): Promise<Group | null> {
        return await this.groupsService.remove(id);
    }
}
