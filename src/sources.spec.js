import configureMockStore from 'redux-mock-store';
import sources from './sources';

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
  results,
  tracker,
  registerReactiveAction: register,
  reactiveChangedAction: change,
} = require('mocks')();

const store = configureMockStore([sources(tracker)])({});

const actions = [register, register];
actions.forEach(store.dispatch);

it('should handle a subscribe action', () => {
  expect(store.getActions()).toEqual([
    change,
    register,
    change,
    register,
  ]);
});

it('should fire functions in payload in the correct sequence', () => {
  expect(results).toEqual([
    'i got me data!',
    'my computation be stopped now!',
    'i got me data!',
  ]);
});
