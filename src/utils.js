import S from 'sanctuary';

export const has =
  S.meld([S.gets, S.isJust]);

const hasFunc = has(Function);

export const hasSubscribe =
  hasFunc(['payload', 'subscribe']);

export const hasGet =
  hasFunc(['payload', 'get']);

export const createAction =
  type => (payload = {}, meta = {}) => ({ type, payload, meta });

export const injectTracker =
  (tracker, middlewares) => middlewares.map(m => m(tracker));

export const isBrowser =
  typeof process === 'undefined';
