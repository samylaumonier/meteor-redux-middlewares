import { createAction } from './utils';

export const REGISTER_REACTIVE_SOURCE = 'REGISTER_REACTIVE_SOURCE';
export const registerReactiveSource = createAction(REGISTER_REACTIVE_SOURCE);

export const STOP_SUBSCRIPTION = 'STOP_SUBSCRIPTION';
export const stopSubscription = createAction(STOP_SUBSCRIPTION);

export const START_SUBSCRIPTION = 'START_SUBSCRIPTION';
export const startSubscription = createAction(START_SUBSCRIPTION);

export const types = [
  REGISTER_REACTIVE_SOURCE,
  STOP_SUBSCRIPTION,
  START_SUBSCRIPTION,
];

export const actions = {
  registerReactiveSource,
  stopSubscription,
  startSubscription,
};
