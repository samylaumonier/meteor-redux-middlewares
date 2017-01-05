export default run => {
  // setTimeout is fixing this bug:
  // https://github.com/meteor/react-packages/issues/99
  setTimeout(run);
};
