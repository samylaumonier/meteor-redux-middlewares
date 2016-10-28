'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stdTracker = require('std-tracker');

var computations = {}; /* eslint-disable arrow-parens */

exports.default = function (store) {
  return function (next) {
    return function (action) {
      if (action.meteor && action.meteor.subscribe && action.meteor.get) {
        // setTimeout is fixing this bug: https://github.com/meteor/react-packages/issues/99
        setTimeout(function () {
          if (computations[action.type]) {
            computations[action.type].stop();
          }

          computations[action.type] = _stdTracker.Tracker.autorun(function () {
            store.dispatch({
              type: action.type + '_CHANGED',
              data: action.meteor.get()
            });
          });
        }, 0);
      }

      return next(action);
    };
  };
};