import { Group } from '../../../../database/models/group';

export type CreateGroupDto = Pick<Group, 'name' | 'permissions'>;
