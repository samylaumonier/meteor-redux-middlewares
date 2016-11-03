import subscriptionsMiddleware, { stopSubscription } from './subscriptions';
import sourcesMiddleware from './sources';
import { injectTracker } from './utils';

const middlewares = [
  subscriptionsMiddleware,
  sourcesMiddleware,
];

export default (tracker) => {
  const [subscriptions, sources] = injectTracker(tracker, middlewares);

  return {
    subscriptions,
    sources,
  };
};

export { stopSubscription };
