// import configureMockStore from 'redux-mock-store';
//
// import { REGISTER_REACTIVE_SOURCE, REACTIVE_DATA_CHANGED } from './actions';
// import sources from './sources';
//
//
// // Used to hold tags pushed from various functions
// // to ensure the sequence is as expected
// // (the tags are in pirate speak)
// const results = [];
//
// const treasure = [
//   { id: 'treasure' },
// ];
//
// const tracker = {
//   autorun: f => ({
//     value: f(),
//     stop: () => results.push('i be stopped now!'),
//   }),
// };
//
// const payload = {
//   get() {
//     results.push('i got me data!');
//     return treasure;
//   },
// };
//
// const subscribeAction = {
//   type: REGISTER_REACTIVE_SOURCE,
//   payload,
// };
//
// const changedAction = {
//   type: REACTIVE_DATA_CHANGED,
//   payload: treasure,
//   meta: {},
// };
//
// const store = configureMockStore([sources(tracker)])({});
//
// const actions = [subscribeAction, subscribeAction];
// actions.forEach(store.dispatch);
//
// it('should handle a subscribe action', () => {
//   expect(store.getActions()).toEqual([
//     changedAction,
//     subscribeAction,
//     changedAction,
//     subscribeAction,
//   ]);
// });
//
// it('should fire functions in payload in the correct sequence', () => {
//   expect(results).toEqual([
//     'i got me data!',
//     'i be stopped now!',
//     'i got me data!',
//   ]);
// });

import configureMockStore from 'redux-mock-store';
import sources from './sources';

// The results array here is used to hold tags pushed from various functions
// to ensure the sequence is as expected (the tags are in pirate speak)
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
