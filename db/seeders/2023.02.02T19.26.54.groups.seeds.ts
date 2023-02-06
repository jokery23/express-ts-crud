import type { Seeder } from '../umzug';
import { groupPermissionValues, GROUP_TABLE_NAME, GroupPermissionEnum } from '../../src/database/models/group';

export const up: Seeder = async ({ context }) => {
    const seeds = [
        {
            name: 'admin',
            permissions: groupPermissionValues,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'view_user',
            permissions: [GroupPermissionEnum.READ],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    await context.getQueryInterface().bulkInsert(GROUP_TABLE_NAME, seeds);
};

export const down: Seeder = async ({ context }) => {
    await context.getQueryInterface().bulkDelete(GROUP_TABLE_NAME, null);
};
