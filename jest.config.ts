import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    setupFiles: ['./jest.setup.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};
export default config;
