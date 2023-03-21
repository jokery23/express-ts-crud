import process from 'node:process';

export const getConfigFile = (): string => process.env.CONFIG_ENV ?? '';

export const isTest = (): boolean => process.env.NODE_ENV === 'test';

export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export const isSkipAuth = (): boolean => process.env.SKIP_AUTH && isTest();

export const getJWTSecret = (): string => process.env.JWT_TOKEN_SECRET ?? '';

export const getPort = (): number => Number(process.env.SERVER_PORT ?? 8080);
