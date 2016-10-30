import subscriptionsMiddleware from './subscriptions';
import sourcesMiddleware from './sources';

const middlewares = [
  subscriptionsMiddleware,
  sourcesMiddleware,
];

const injectTracker = (tracker, middlewares) => middlewares.map(m => m(tracker));

export default (tracker) => {
  const [subscriptions, sources] = injectTracker(tracker, middlewares);

  return {
    subscriptions,
    sources,
  };
};
