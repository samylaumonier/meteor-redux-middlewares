import subscriptionsMiddleware from './subscriptions';
import sourcesMiddleware from './sources';
import { injectTracker } from './utils';

const middlewares = [
  subscriptionsMiddleware,
  sourcesMiddleware,
];

export * from './actions';

export default (tracker) => {
  const [subscriptions, sources] = injectTracker(tracker, middlewares);

  return {
    subscriptions,
    sources,
  };
};
