const treasure = [
  { id: 'treasure' },
];

module.exports = () => {
  const results = [];

  const tracker = {
    autorun: f => ({
      value: f(),
      stop: () => {
        const txt = 'my computation be stopped now!';
        results.push(txt);
        return txt;
      },
    }),
  };

  function get() {
    results.push('i got me data!');
    return treasure;
  }

  function subscribe(ready) {
    results.push('yarg, i subscribed!');
    return {
      subscriptionId: 1,
      ready: () => ready,
      stop: () => results.push('my subscription be stopped now!'),
    };
  }

  return {
    get,
    results,
    treasure,
    subscribe,
    tracker,
  };
};
