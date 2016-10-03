import { middleware as subscriptionsMiddleware } from './middlewares/subscriptions';
import { middleware as sourcesMiddleware } from './middlewares/sources';

export const subscriptions = subscriptionsMiddleware;
export const sources = sourcesMiddleware;
