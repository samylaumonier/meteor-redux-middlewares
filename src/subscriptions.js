/* eslint-disable arrow-parens */
/* eslint-disable consistent-return */
const subscriptions = {};
const computations = {};

export default Tracker => store => next => action => {
  if (!action.meteor || !action.meteor.subscribe) {
    return next(action);
  }

  // setTimeout is fixing this bug: https://github.com/meteor/react-packages/issues/99
  setTimeout(() => {
    if (subscriptions[action.type]) {
      const subscriptionId = subscriptions[action.type].subscriptionId;

      computations[subscriptionId].stop();
      subscriptions[action.type].stop();
    }

    const subscription = action.meteor.subscribe();
    const subscriptionId = subscription.subscriptionId;

    subscriptions[action.type] = subscription;
    computations[subscriptionId] = Tracker.autorun(() => {
      const ready = subscription.ready();

      if (ready) {
        store.dispatch({
          type: `${action.type}_CHANGED`,
          data: action.meteor.get(),
        });
      }

      store.dispatch({
        ready,
        type: `${action.type}_READY`,
        data: action.meteor.onReadyData
          ? action.meteor.onReadyData()
          : null,
      });
    });
  }, 0);
};
