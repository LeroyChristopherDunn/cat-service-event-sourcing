import { Logger } from '@nestjs/common';

const logger = new Logger('Config');

export type EnvironmentType = 'development' | 'test' | 'production';
export const ENVIRONMENT: EnvironmentType =
  (process.env.NODE_ENV as EnvironmentType) || 'development';
logger.log('ENVIRONMENT:', ENVIRONMENT);

export const EVENT_STORE_URL: string = process.env.EVENT_STORE_URL;
logger.log('EVENT_STORE_URL:', EVENT_STORE_URL);

export const NUM_SEED_ITERATIONS: number =
  parseInt(process.env.NUM_SEED_ITERATIONS) || 0;
logger.log('NUM_SEED_EVENTS:', NUM_SEED_ITERATIONS);
