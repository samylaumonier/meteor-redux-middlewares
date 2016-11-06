import { REGISTER_REACTIVE_SOURCE } from './actions';
import { actionCase, hasGet, hasSubscribe, hasKey, errorWith } from './utils';
import runContextual from './runContextual';

const computations = {};

export default tracker => ({ dispatch }) => next => action => {
  const throwIfNot = errorWith(action);

  if (action.type === REGISTER_REACTIVE_SOURCE) {
    const run = () => {
      throwIfNot(hasKey,
        'A registerReactiveSource action needs a `key` string to identify tracked source'
      );

      throwIfNot(hasGet,
        'A registerReactiveSource action needs a `get` function to load data'
      );

      throwIfNot(x => !hasSubscribe(x),
        'Use a startSubscription action to start a subscription'
      );

      const { key } = action.payload;

      if (computations[key]) {
        computations[key].stop();
      }

      computations[key] = tracker.autorun(() => {
        dispatch({
          type: `${actionCase(key)}_REACTIVE_SOURCE_CHANGED`,
          payload: action.payload.get(),
        });
      });
    };

    runContextual(run);
  }

  return next(action);
};
