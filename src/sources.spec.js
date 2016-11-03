import configureMockStore from 'redux-mock-store';
import sources from './sources';
import { registerReactiveSource } from './actions';


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
  treasure,
} = require('mocks')();

const store = configureMockStore([sources(tracker)])({});
const register = registerReactiveSource({ key: 'mates', get });
const changed = {
  type: 'MATES_REACTIVE_SOURCE_CHANGED',
  payload: treasure,
};

const actions = [register, register];
actions.forEach(store.dispatch);

it('should handle a registerReactiveSource action', () => {
  expect(store.getActions()).toEqual([
    changed,
    register,
    changed,
    register,
  ]);
});

it('should fire in the correct sequence', () => {
  expect(results).toEqual([
    'i got me data!',
    'my computation be stopped now!',
    'i got me data!',
  ]);
});
