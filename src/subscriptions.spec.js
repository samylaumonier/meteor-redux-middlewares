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
 */
const {
  get,
  results,
  subscribe,
  tracker,
} = require('mocks')();

const onReadyData = 'im ready, but me eyepatch is lost';
const subKey = 'mates';

const stop = stopSubscription(subKey);
const start = startSubscription({
  onReadyData: () => {
    results.push(onReadyData);
    return onReadyData;
  },
  key: subKey,
  subscribe,
  get,
});

const store = configureMockStore([subscriptions(tracker)])({});
store.dispatch(start);
store.dispatch(start);
store.dispatch(stop);

it('should first stop the subscription and tracker before re-subscribing', () => {
  expect(store.getActions()).toMatchSnapshot();
});

it('should fire in the correct sequence', () => {
  expect(results).toMatchSnapshot();
});
