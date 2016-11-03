import configureMockStore from 'redux-mock-store';
import subscriptions from './subscriptions';
import { stopSubscription, startSubscription } from './actions';

/**
 * See src/__mocks__/mocks.js
 *
 * The results array imported here is used to hold tags pushed from various
 * functions to ensure the sequence is as expected
 * (the tags are in pirate speak)
 *
 * The two actions are simply calls to the corresponding action creator
 * functions, and are used as plain objects to dispatch
 * and later check against
 */
const {
  get,
  results,
  subscribe,
  tracker,
  treasure,
} = require('mocks')();

const createStore = configureMockStore([subscriptions(tracker)]);

const onReadyData = 'im ready, but me eyepatch is lost';
const subKey = 'mates';

const start = startSubscription({
  onReadyData: () => {
    results.push(onReadyData);
    return onReadyData;
  },
  key: subKey,
  subscribe,
  get,
});

const ready = {
  type: 'MATES_SUBSCRIPTION_READY',
  payload: {
    ready: true,
    data: onReadyData,
  },
};

const changed = {
  type: 'MATES_SUBSCRIPTION_CHANGED',
  payload: treasure,
};

const stop = stopSubscription(subKey);

const store = createStore({});
store.dispatch(start);
store.dispatch(start);
store.dispatch(stop);

it('should first stop the subscription and tracker before re-subscribing', () => {
  expect(store.getActions()).toEqual([
    changed,
    ready,
    start,
    stop,     // first stop due to duplicate startSubscription
    changed,
    ready,
    start,
    stop,     // second stop is due to manual dispatch stopSubscription
  ]);
});

it('should fire in the correct sequence', () => {
  expect(results).toEqual([
    'yarg, i subscribed!',
    'i got me data!',
    'im ready, but me eyepatch is lost',
    'my computation be stopped now!',
    'my subscription be stopped now!',
    'yarg, i subscribed!',
    'i got me data!',
    'im ready, but me eyepatch is lost',
    'my computation be stopped now!',
    'my subscription be stopped now!',
  ]);
});
