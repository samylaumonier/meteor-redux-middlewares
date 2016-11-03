import {
  REGISTER_REACTIVE_SOURCE,
  reactiveDataChanged,
} from './actions';

import { hasGet, hasSubscribe, isBrowser } from './utils';

const computations = {};

export default tracker => ({ dispatch }) => next => action => {
  if (action.type === REGISTER_REACTIVE_SOURCE) {
    if (!hasGet(action)) {
      throw new Error(
        'A registerReactiveSource action needs a `get` function to load data'
      );
    }

    if (hasSubscribe(action)) {
      throw new Error(
        'Use a startSubscription action to start a subscription'
      );
    }

    const run = () => {
      if (computations[action.type]) {
        computations[action.type].stop();
      }

      computations[action.type] = tracker.autorun(() => {
        dispatch(
          reactiveDataChanged(action.payload.get())
        );
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
