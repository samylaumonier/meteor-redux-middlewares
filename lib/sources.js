"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable consistent-return */
var computations = {};

exports.default = function (Tracker) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.meteor || action.meteor.subscribe || !action.meteor.get) {
          return next(action);
        }

        // setTimeout is fixing this bug: https://github.com/meteor/react-packages/issues/99
        setTimeout(function () {
          if (computations[action.type]) {
            computations[action.type].stop();
          }

          computations[action.type] = Tracker.autorun(function () {
            store.dispatch({
              type: action.type + "_CHANGED",
              data: action.meteor.get()
            });
          });
        }, 0);
      };
    };
  };
};