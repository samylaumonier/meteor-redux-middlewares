import { isFSA } from 'flux-standard-action';
import {
  actionCase,
  createAction,
  has,
  injectTracker,
} from './utils';

describe('#actionCase', () => {
  const result = actionCase('one.man');

  it('replaces dots with underscores', () => {
    expect(result.includes('.')).toBe(false);
  });

  it('capitalizes', () => {
    expect(result.toUpperCase()).toBe(result);
  });
});

describe('#has', () => {
  const hasNumber = has(Number);

  it('should be curried', () => {
    expect(typeof hasNumber).toBe('function');
  });

  it('should return true when a path exists', () => {
    expect(hasNumber(['a', 'b'], { a: { b: 1 } })).toBe(true);
  });

  it('should return false when a path does not exist or is of incorrect type', () => {
    expect(hasNumber(['a', 'b'], { a: { b: 'me' } })).toBe(false);
    expect(hasNumber(['a', 'b'], { a: 1 })).toBe(false);
  });
});

describe('#createAction', () => {
  const fsaCompliant = val => expect(isFSA(val)).toBe(true);
  const action = createAction('myType');

  it('is curried', () => {
    expect(typeof action).toBe('function');
  });

  describe('resulting action is FSA compliant when passed', () => {
    it('1 arg (payload only)', () => {
      fsaCompliant(action(1));
    });

    it('2 args (payload and meta)', () => {
      fsaCompliant(action(1, 2));
    });
  });
});

describe('#injectTracker', () => {
  const id = x => x;
  const middlewares = [id, id];

  const tracker = 1;
  const expected = [tracker, tracker];

  it('should pass tracker to each middleware', () => {
    expect(injectTracker(tracker, middlewares)).toEqual(expected);
  });
});
