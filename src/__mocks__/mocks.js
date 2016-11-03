import {
  subscriptionReady,
  startSubscription,
  subscriptionDataChanged,
  registerReactiveSource,
  reactiveDataChanged,
} from '../actions';

const treasure = [
  { id: 'treasure' },
];

module.exports = () => {
  const results = [];

  function get() {
    results.push('i got me data!');
    return treasure;
  }

  function subscribe() {
    results.push('yarg, i subscribed!');
    return {
      subscriptionId: 1,
      ready: () => true,
      stop: () => results.push('my subscription be stopped now!'),
    };
  }

  return {
    get,
    results,
    treasure,
    subscribe,

    tracker: {
      autorun: f => ({
        value: f(),
        stop: () => results.push('my computation be stopped now!'),
      }),
    },

    registerReactiveAction: registerReactiveSource({ get }),
    reactiveChangedAction: reactiveDataChanged(treasure),

    subscriptionReadyAction: subscriptionReady(true),
    startSubscriptionAction: startSubscription('mates'),
    subscriptionDataChangedAction: subscriptionDataChanged(treasure),
  };
};
