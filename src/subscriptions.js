import {
  START_SUBSCRIPTION,
  stopSubscription,
  subscriptionReady,
  subscriptionDataChanged,
} from './actions';

import { hasSubscribe, isBrowser } from './utils';

const subscriptions = {};
const computations = {};

export default Tracker => ({ dispatch }) => next => action => {
  if (action.type === START_SUBSCRIPTION && hasSubscribe(action)) {
    const run = () => {
      if (subscriptions[action.type]) {
        dispatch(stopSubscription(action.type));
      }

      const subscription = action.meteor.subscribe();
      const subscriptionId = subscription.subscriptionId;

      subscriptions[action.type] = subscription;
      computations[subscriptionId] = Tracker.autorun(() => {
        const ready = subscription.ready();

        if (ready) {
          dispatch(
            subscriptionDataChanged({ data: action.meteor.get() })
          );
        }

        dispatch(subscriptionReady({
          ready,
          data: action.meteor.onReadyData
            ? action.meteor.onReadyData()
            : null,
        }));
      });
    };

    if (isBrowser) {
      // setTimeout is fixing this bug:
      // https://github.com/meteor/react-packages/issues/99
      setImmediate(run);
    } else {
      run();
    }
  }

  return next(action);
};
