import { isBrowser } from './utils';

export default run => {
  if (isBrowser()) {
    // setTimeout is fixing this bug:
    // https://github.com/meteor/react-packages/issues/99
    setTimeout(run, 0);
  } else {
    run();
  }
};
