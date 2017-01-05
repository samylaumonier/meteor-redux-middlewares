import configureMockStore from 'redux-mock-store';
import sources from './sources';
import { registerReactiveSource } from './actions';

describe('sources middleware', () => {
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
    tracker,
  } = require('mocks')();

  const register = registerReactiveSource({ key: 'mates', get });

  const store = configureMockStore([sources(tracker)])({});

  store.dispatch(register);
  jest.runOnlyPendingTimers();

  store.dispatch(register);
  jest.runOnlyPendingTimers();

  it('should handle a registerReactiveSource action', () => {
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should fire in the correct sequence', () => {
    expect(results).toMatchSnapshot();
  });
});
