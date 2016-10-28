'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stdTracker = require('std-tracker');

var subscriptions = {}; /* eslint-disable arrow-parens */

var computations = {};

exports.default = function (store) {
  return function (next) {
    return function (action) {
      if (action.meteor && action.meteor.subscribe) {
        // setTimeout is fixing this bug: https://github.com/meteor/react-packages/issues/99
        setTimeout(function () {
          if (subscriptions[action.type]) {
            var _subscriptionId = subscriptions[action.type].subscriptionId;

            computations[_subscriptionId].stop();
            subscriptions[action.type].stop();
          }

          var subscription = action.meteor.subscribe();
          var subscriptionId = subscription.subscriptionId;

          subscriptions[action.type] = subscription;
          computations[subscriptionId] = _stdTracker.Tracker.autorun(function () {
            var ready = subscription.ready();

            if (ready) {
              store.dispatch({
                type: action.type + '_CHANGED',
                data: action.meteor.get()
              });
            }

            store.dispatch({
              ready: ready,
              type: action.type + '_READY',
              data: action.meteor.onReadyData ? action.meteor.onReadyData() : null
            });
          });
        }, 0);
      }

      return next(action);
    };
  };
};