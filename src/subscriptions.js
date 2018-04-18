import {
  STOP_SUBSCRIPTION,
  START_SUBSCRIPTION,
} from './actions';

import {
  actionCase,
  errorWith,
  hasGet,
  hasKey,
  hasSubscribe,
  stringPayload,
} from './utils';

const subscriptions = {};
const computations = {};

const stopSubscription = key => {
  if (subscriptions[key]) {
    const subscriptionId = subscriptions[key].subscriptionId;

    computations[subscriptionId].stop();
    subscriptions[key].stop();

    computations[subscriptionId] = undefined;
    subscriptions[key] = undefined;
  }
};

export default tracker => ({ dispatch }) => next => action => {
  const throwIfNot = errorWith(action);

  if (action.type === STOP_SUBSCRIPTION) {
    const stop = () => {
      throwIfNot(stringPayload,
        'A stopSubscription action needs a string payload to identify a subscription'
      );

      stopSubscription(action.payload);
    };

    setTimeout(stop);
  } else if (action.type === START_SUBSCRIPTION) {
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
      stopSubscription(key);

      const subscription = subscribe();
      const { subscriptionId } = subscription;

      subscriptions[key] = subscription;
      computations[subscriptionId] = tracker.autorun(() => {
        const ready = subscription.ready();

        if (ready) {
          dispatch({
            type: `${actionCase(key)}_SUBSCRIPTION_CHANGED`,
            payload: action.payload.get(),
          });
        }

        dispatch({
          type: `${actionCase(key)}_SUBSCRIPTION_READY`,
          payload: {
            ready,
            data: action.payload.onReadyData
              ? action.payload.onReadyData()
              : {},
          },
        });
      });
    };

    setTimeout(start);
  }

  return next(action);
};
