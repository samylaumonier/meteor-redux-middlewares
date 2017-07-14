import configureMockStore from 'redux-mock-store';
import subscriptions from './subscriptions';
import { stopSubscription, startSubscription } from './actions';

describe('subscriptions middleware', () => {
  const run = (subKey, { ready = true, onReadyData = null } = {}) => {
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

    // Start action configuration
    const startSubConfig = {
      key: subKey,
      subscribe: () => subscribe(ready),
      get,
    };

    if (onReadyData) {
      startSubConfig.onReadyData = () => {
        results.push(onReadyData);
        return onReadyData;
      };
    }

    // Create actions & store
    const stop = stopSubscription(subKey);
    const start = startSubscription(startSubConfig);
    const store = configureMockStore([subscriptions(tracker)])({});

    store.dispatch(start);
    jest.runOnlyPendingTimers();

    store.dispatch(start);
    jest.runOnlyPendingTimers();

    store.dispatch(stop);
    jest.runOnlyPendingTimers();

    return {
      store,
      results,
    };
  };

  const subKey = 'mates';
  const onReadyData = 'im ready, but me eyepatch is lost';

  it('should handle a startSubscription action', () => {
    const { store } = run(subKey, { onReadyData });
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should handle a startSubscription action (subscription never ready)', () => {
    const { store } = run(subKey, { ready: false });
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should fire in the correct sequence', () => {
    const { results } = run(subKey, { onReadyData });
    expect(results).toMatchSnapshot();
  });

  it('should fire in the correct sequence (without ready data)', () => {
    const { results } = run(subKey);
    expect(results).toMatchSnapshot();
  });

  it('should throw an error', () => {
    expect(run).toThrow();
  });
});
