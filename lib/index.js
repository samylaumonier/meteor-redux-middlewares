'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _subscriptions = require('./subscriptions');

var _subscriptions2 = _interopRequireDefault(_subscriptions);

var _sources = require('./sources');

var _sources2 = _interopRequireDefault(_sources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middlewares = [_subscriptions2.default, _sources2.default];

var injectTracker = function injectTracker(tracker, middlewares) {
  return middlewares.map(function (m) {
    return m(tracker);
  });
};

exports.default = function (tracker) {
  var _injectTracker = injectTracker(tracker, middlewares),
      _injectTracker2 = _slicedToArray(_injectTracker, 2),
      subscriptions = _injectTracker2[0],
      sources = _injectTracker2[1];

  return {
    subscriptions: subscriptions,
    sources: sources
  };
};