import S from 'sanctuary';

export const has =
  S.meld([S.gets, S.isJust]);

const hasFunc = has(Function);
const hasString = has(String);

const payload = ['payload'];
const path = key => payload.concat(key);
export const stringPayload = hasString(payload);

export const hasSubscribe = hasFunc(path('subscribe'));
export const hasKey = hasString(path('key'));
export const hasGet = hasFunc(path('get'));

export const actionCase =
  S.B(S.toUpper, x => x.replace('.', '_'));

export const createAction =
  type => (payload = {}, meta = {}) => ({ type, payload, meta });

export const injectTracker =
  (tracker, middlewares) => middlewares.map(m => m(tracker));

export const isBrowser =
  () => typeof process === 'undefined';

export const errorWith = x => (f, msg) => {
  if (!f(x)) {
    throw new Error(msg);
  }
};
