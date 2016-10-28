/* eslint-disable arrow-parens */
/* eslint-disable consistent-return */
const computations = {};

export default Tracker => store => next => action => {
  if (!action.meteor || action.meteor.subscribe || !action.meteor.ge) {
    return next(action);
  }

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
};
