import { createAction } from './utils';

export const REGISTER_REACTIVE_SOURCE = 'REGISTER_REACTIVE_SOURCE';
export const registerReactiveSource = createAction(REGISTER_REACTIVE_SOURCE);

export const REACTIVE_DATA_CHANGED = 'REACTIVE_DATA_CHANGED';
export const reactiveDataChanged = createAction(REACTIVE_DATA_CHANGED);

export const STOP_SUBSCRIPTION = 'STOP_SUBSCRIPTION';
export const stopSubscription = createAction(STOP_SUBSCRIPTION);

export const START_SUBSCRIPTION = 'START_SUBSCRIPTION';
export const startSubscription = createAction(START_SUBSCRIPTION);

export const SUBSCRIPTION_DATA_CHANGED = 'SUBSCRIPTION_DATA_CHANGED';
export const subscriptionDataChanged = createAction(SUBSCRIPTION_DATA_CHANGED);

export const SUBSCRIPTION_READY = 'SUBSCRIPTION_READY';
export const subscriptionReady = createAction(SUBSCRIPTION_READY);

export const types = [
  REGISTER_REACTIVE_SOURCE,
  REACTIVE_DATA_CHANGED,
  STOP_SUBSCRIPTION,
  START_SUBSCRIPTION,
  SUBSCRIPTION_DATA_CHANGED,
  SUBSCRIPTION_READY,
];

export const actions = {
  registerReactiveSource,
  reactiveDataChanged,
  stopSubscription,
  startSubscription,
  subscriptionDataChanged,
  subscriptionReady,
};
