/* eslint-disable arrow-parens */
const computations = {};

export default Tracker => store => next => action => {
  if (action.meteor && action.meteor.subscribe && action.meteor.get) {
    // setTimeout is fixing this bug: https://github.com/meteor/react-packages/issues/99
    setTimeout(() => {
      if (computations[action.type]) {
        computations[action.type].stop();
      }

      computations[action.type] = Tracker.autorun(() => {
        store.dispatch({
          type: `${action.type}_CHANGED`,
          data: action.meteor.get(),
        });
      });
    }, 0);
  }

  return next(action);
};
