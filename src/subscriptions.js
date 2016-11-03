import runContextual from './runContextual';

import {
  STOP_SUBSCRIPTION,
  START_SUBSCRIPTION,
  stopSubscription,
} from './actions';

import {
  hasGet,
  hasKey,
  errorWith,
  hasSubscribe,
  stringPayload,
} from './utils';

const subscriptions = {};
const computations = {};

export default tracker => ({ dispatch }) => next => action => {
  const throwIfNot = errorWith(action);

  if (action.type === STOP_SUBSCRIPTION) {
    const stop = () => {
      throwIfNot(stringPayload,
        'A stopSubscription action needs a string payload to identify a subscription'
      );

      if (subscriptions[action.payload]) {
        const subscriptionId = subscriptions[action.payload].subscriptionId;

        computations[subscriptionId].stop();
        subscriptions[action.payload].stop();
      }
    };

    runContextual(stop);
  }

  if (action.type === START_SUBSCRIPTION) {
    const start = () => {
      throwIfNot(hasSubscribe,
        'A startSubscription action needs a `subscribe` function to start a subscription'
      );

      throwIfNot(hasKey,
        'A startSubscription action needs a `key` string to identify a subscription'
      );

      throwIfNot(hasGet,
        'A startSubscription action needs a `get` function to load data'
      );

      const { key, subscribe } = action.payload;

      if (subscriptions[key]) {
        dispatch(stopSubscription(key));
      }

      const subscription = subscribe();
      const { subscriptionId } = subscription;

      subscriptions[key] = subscription;
      computations[subscriptionId] = tracker.autorun(() => {
        const ready = subscription.ready();

        if (ready) {
          dispatch({
            type: `${key.toUpperCase()}_SUBSCRIPTION_CHANGED`,
            payload: action.payload.get(),
          });
        }

        dispatch({
          type: `${key.toUpperCase()}_SUBSCRIPTION_READY`,
          payload: {
            ready,
            data: action.payload.onReadyData
              ? action.payload.onReadyData()
              : {},
          },
        });
      });
    };

    runContextual(start);
  }

  return next(action);
};
